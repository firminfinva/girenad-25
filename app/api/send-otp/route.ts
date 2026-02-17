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

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Create new OTP in database (keep old ones for statistics)
    await prisma.oTP.create({
      data: {
        userId: user.id,
        otp,
        expiresAt,
        used: false,
      },
    });

    // Create transporter using SMTP configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Get logo URL - use EMAIL_LOGO_URL if set, otherwise use default
    const logoUrl = process.env.EMAIL_LOGO_URL || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/assets/logo.png`;

    // Professional HTML email template
    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Code de vérification GIRENAD</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <!-- Email Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                
                <!-- Header with Logo -->
                <tr>
                  <td style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); padding: 40px 30px; text-align: center;">
                    <img src="${logoUrl}" alt="GIRENAD Logo" style="max-width: 120px; height: auto; margin-bottom: 10px;" />
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">GIRENAD</h1>
                    <p style="margin: 8px 0 0 0; color: #d1fae5; font-size: 14px; font-weight: 400;">Code de vérification</p>
                  </td>
                </tr>
                
                <!-- Body Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px; font-weight: 600; line-height: 1.3;">Bonjour,</h2>
                    
                    <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                      Vous avez demandé un code de vérification pour accéder à votre compte GIRENAD.
                    </p>
                    
                    <!-- OTP Code Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td align="center" style="padding: 30px 0;">
                          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px dashed #059669; border-radius: 12px; padding: 30px; margin: 0 auto; max-width: 400px;">
                            <p style="margin: 0 0 15px 0; color: #065f46; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Votre code de vérification</p>
                            <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin: 0 auto; text-align: center; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                              <p style="margin: 0; color: #059669; font-size: 42px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace; line-height: 1.2;">${otp}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Important Notice -->
                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px; margin: 30px 0;">
                      <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                        <strong>⚠️ Important :</strong> Ce code expire dans <strong>5 minutes</strong>. Ne partagez jamais ce code avec qui que ce soit.
                      </p>
                    </div>
                    
                    <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      Si vous n'avez pas demandé ce code, veuillez ignorer cet email. Votre compte reste sécurisé.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                      <strong style="color: #059669;">GIRENAD</strong><br>
                      Organisation à but non lucratif
                    </p>
                    <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                      Cet email a été envoyé automatiquement. Merci de ne pas y répondre.<br>
                      © ${new Date().getFullYear()} GIRENAD. Tous droits réservés.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Plain text version for email clients that don't support HTML
    const text = `Bonjour,\n\nVotre code de vérification GIRENAD est : ${otp}\n\nCe code expire dans 5 minutes.\n\nSi vous n'avez pas demandé ce code, veuillez ignorer cet email.\n\nCordialement,\nL'équipe GIRENAD`;

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Votre code de vérification GIRENAD",
      text: text,
      html: html,
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
