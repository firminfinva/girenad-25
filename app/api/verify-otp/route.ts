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

    // Find OTP for this user
    const storedOtp = await prisma.oTP.findUnique({
      where: { userId: user.id },
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

    // OTP is valid - delete it before generating token
    await prisma.oTP.delete({
      where: { userId: user.id },
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

    // Remove password from user data
    const { password: _, ...userWithoutPassword } = user;

    // Return success response with explicit status
    return NextResponse.json(
      {
        message: "OTP vérifié avec succès",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          validated: user.validated,
        },
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
