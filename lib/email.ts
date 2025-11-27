import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Gets the base URL for assets (logo, etc.)
 */
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

/**
 * Sends an email using the configured SMTP transporter
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
  from,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
}): Promise<void> {
  const mailOptions = {
    from: from || process.env.SMTP_USER || "noreply@girenad.org",
    to,
    subject,
    text,
    html: html || text,
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Sends a professional OTP email to a user
 */
export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  const baseUrl = getBaseUrl();
  const logoUrl = `${baseUrl}/assets/logo.png`;
  
  const subject = "Votre code de vérification GIRENAD";
  const text = `Bonjour,\n\nVotre code de vérification GIRENAD est : ${otp}\n\nCe code expire dans 5 minutes.\n\nSi vous n'avez pas demandé ce code, veuillez ignorer cet email.\n\nCordialement,\nL'équipe GIRENAD`;
  
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

  await sendEmail({ to: email, subject, text, html });
}

export default transporter;
