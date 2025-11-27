import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Everyone can request OTP unless validated = false
    // If validated = false, user is blocked and cannot request OTP
    if (user.validated === false) {
      return NextResponse.json(
        {
          error:
            "Votre compte n'est pas validé. Veuillez contacter l'administrateur.",
        },
        { status: 403 }
      );
    }

    // Delete any existing OTP for this user
    await prisma.oTP.deleteMany({
      where: { userId: user.id },
    });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Create new OTP in database
    await prisma.oTP.create({
      data: {
        userId: user.id,
        otp,
        expiresAt,
      },
    });

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Votre OTP pour la connexion",
      text: `Votre OTP est : ${otp}. Il expire dans 5 minutes.`,
    });

    return NextResponse.json({ message: "OTP envoyé avec succès" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Échec de l'envoi de l'OTP" },
      { status: 500 }
    );
  }
}
