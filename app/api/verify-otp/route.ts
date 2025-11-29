import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email et OTP requis" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Find the most recent unused OTP for this user
    const storedOtp = await prisma.oTP.findFirst({
      where: {
        userId: user.id,
        used: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Verify OTP - strict check
    if (!storedOtp) {
      return NextResponse.json(
        { error: "OTP non trouvé. Veuillez demander un nouveau code." },
        { status: 400 }
      );
    }

    if (storedOtp.otp !== otp) {
      return NextResponse.json(
        { error: "Code OTP incorrect. Veuillez réessayer." },
        { status: 400 }
      );
    }

    if (new Date() > storedOtp.expiresAt) {
      return NextResponse.json(
        { error: "Code OTP expiré. Veuillez demander un nouveau code." },
        { status: 400 }
      );
    }

    // OTP is valid - mark it as used instead of deleting it (for statistics)
    await prisma.oTP.update({
      where: { id: storedOtp.id },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    // Generate JWT token (only store userId)
    // Note: validated field is only changed by admin, not automatically
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return success response with token only
    // User data will be fetched from backend using the token
    return NextResponse.json(
      {
        message: "OTP vérifié avec succès",
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Échec de la vérification de l'OTP" },
      { status: 500 }
    );
  }
}
