import dotenv from "dotenv";
import path from "path";
import nodemailer from "nodemailer";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

// console.log({
//   SMTP_HOST: process.env.SMTP_HOST,
//   SMTP_PORT: process.env.SMTP_PORT,
//   SMTP_USER: process.env.SMTP_USER,
//   SMTP_PASS: process.env.SMTP_PASS ? "DEFINED" : "MISSING",
//   MAIL_FROM: process.env.MAIL_FROM,
// });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// AUTHENTICATION VERIFICATION EMAIL --------------
export const sendVerificationEmail = async (email, verifyCode) => {
  try {
    if (!email?.trim()) {
      throw new Error("Verification email recipient is required");
    }

    if (!verifyCode) {
      throw new Error("Verification code is required");
    }

    const mailOptions = {
      from: `"Cam-Cabs" <${process.env.MAIL_FROM}>`,
      to: email.trim(),
      subject: "Verify your email | camCabs",

      // Fallback for email clients that don't support HTML

      text: `
Welcome to CamCabs!

Your email verification code is: ${verifyCode}

This code expires in 10 minutes.

For your security, never share this code with anyone.

If you did not request this code, you can safely ignore this email.

CamCabs Support Team
`.trim(),

      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />

  <title>Verify your email | CamCabs</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #F3F4F6;
  font-family: Arial, Helvetica, sans-serif;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
">

  <!-- Preheader: preview text shown in supported email clients -->
  <div style="
    display: none;
    font-size: 1px;
    color: #F3F4F6;
    line-height: 1px;
    max-height: 0;
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    mso-hide: all;
  ">
    Your CamCabs verification code is ready. It expires in 10 minutes.
  </div>

  <!-- Email Background -->
  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      width: 100%;
      border-collapse: collapse;
      background-color: #F3F4F6;
    "
  >
    <tr>
      <td align="center" style="padding: 36px 12px;">

        <!-- Main Email Container -->
        <table
          role="presentation"
          width="600"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width: 100%;
            max-width: 600px;
            border-collapse: separate;
            border-spacing: 0;
            background-color: #FFFFFF;
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            overflow: hidden;
          "
        >

          <!-- Brand Header -->
          <tr>
            <td align="center" style="
              padding: 32px 24px 28px;
              background-color: #FFFFFF;
              border-bottom: 1px solid #F3F4F6;
            ">

              <!-- Brand Accent -->
              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="border-collapse: collapse;"
              >
                <tr>
                  <td
                    width="5"
                    style="
                      width: 5px;
                      background-color: #F97316;
                      border-radius: 3px;
                    "
                  ></td>

                  <td style="padding-left: 12px;">
                    <h1 style="
                      margin: 0;
                      color: #111827;
                      font-size: 28px;
                      line-height: 34px;
                      font-weight: 800;
                      letter-spacing: -0.8px;
                    ">
                      Cam<span style="color: #F97316;">Cabs</span>
                    </h1>
                  </td>
                </tr>
              </table>

              <p style="
                margin: 10px 0 0;
                color: #6B7280;
                font-size: 13px;
                line-height: 20px;
              ">
                Your journey starts here.
              </p>

            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 32px 32px;">

              <p style="
                margin: 0 0 12px;
                color: #F97316;
                font-size: 12px;
                line-height: 18px;
                font-weight: 700;
                letter-spacing: 1.5px;
                text-transform: uppercase;
              ">
                Account verification
              </p>

              <h2 style="
                margin: 0 0 18px;
                color: #111827;
                font-size: 27px;
                line-height: 35px;
                font-weight: 700;
                letter-spacing: -0.5px;
              ">
                Verify your email address
              </h2>

              <p style="
                margin: 0 0 14px;
                color: #374151;
                font-size: 15px;
                line-height: 25px;
              ">
                Hello,
              </p>

              <p style="
                margin: 0 0 26px;
                color: #4B5563;
                font-size: 15px;
                line-height: 25px;
              ">
                Welcome to CamCabs! We're glad you're here.
                Enter the verification code below to confirm your
                email address and continue setting up your account.
              </p>

              <!-- Verification Code -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  width: 100%;
                  border-collapse: separate;
                  border-spacing: 0;
                  margin: 0 0 22px;
                "
              >
                <tr>
                  <td align="center" style="
                    padding: 25px 16px 24px;
                    background-color: #FFF7ED;
                    border: 1px solid #FED7AA;
                    border-radius: 10px;
                  ">

                    <p style="
                      margin: 0 0 13px;
                      color: #9A3412;
                      font-size: 11px;
                      line-height: 16px;
                      font-weight: 700;
                      letter-spacing: 2px;
                      text-transform: uppercase;
                    ">
                      Your verification code
                    </p>

                    <p
                      aria-label="Email verification code"
                      style="
                        margin: 0;
                        color: #111827;
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 34px;
                        line-height: 42px;
                        font-weight: 700;
                        letter-spacing: 8px;
                        overflow-wrap: anywhere;
                      "
                    >${verifyCode}</p>

                    <p style="
                      margin: 13px 0 0;
                      color: #78716C;
                      font-size: 12px;
                      line-height: 18px;
                    ">
                      Enter this code on the CamCabs verification screen.
                    </p>

                  </td>
                </tr>
              </table>

              <!-- Expiration Information -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  width: 100%;
                  border-collapse: collapse;
                  margin: 0 0 25px;
                "
              >
                <tr>
                  <td
                    width="28"
                    valign="top"
                    style="
                      width: 28px;
                      padding: 2px 10px 0 0;
                    "
                  >
                    <div style="
                      width: 22px;
                      height: 22px;
                      background-color: #F3F4F6;
                      border-radius: 50%;
                      color: #4B5563;
                      font-size: 13px;
                      line-height: 22px;
                      text-align: center;
                      font-weight: 700;
                    ">
                      !
                    </div>
                  </td>

                  <td valign="top">
                    <p style="
                      margin: 0;
                      color: #374151;
                      font-size: 13px;
                      line-height: 21px;
                    ">
                      <strong style="color: #111827;">
                        This code expires in 10 minutes.
                      </strong>
                      Request a new code if it expires before you
                      complete verification.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  width: 100%;
                  border-collapse: collapse;
                  margin: 0 0 28px;
                "
              >
                <tr>
                  <td style="
                    padding: 16px 18px;
                    background-color: #F9FAFB;
                    border: 1px solid #E5E7EB;
                    border-left: 3px solid #F97316;
                    border-radius: 5px;
                  ">
                    <p style="
                      margin: 0 0 5px;
                      color: #111827;
                      font-size: 13px;
                      line-height: 19px;
                      font-weight: 700;
                    ">
                      Keep your account secure
                    </p>

                    <p style="
                      margin: 0;
                      color: #6B7280;
                      font-size: 13px;
                      line-height: 21px;
                    ">
                      CamCabs will never ask you to share your
                      verification code with another person.
                      If you didn't request this code, simply ignore
                      this email.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Sign-off -->
              <p style="
                margin: 0;
                color: #4B5563;
                font-size: 14px;
                line-height: 23px;
              ">
                Thank you for choosing CamCabs.<br />
                Best regards,<br />
                <strong style="color: #111827;">
                  CamCabs Support Team
                </strong>
              </p>

            </td>
          </tr>

          <!-- Footer Divider -->
          <tr>
            <td style="padding: 0 32px;">
              <div style="
                height: 1px;
                background-color: #E5E7EB;
                font-size: 0;
                line-height: 1px;
              ">&nbsp;</div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="
              padding: 25px 24px 28px;
              background-color: #FFFFFF;
            ">

              <p style="
                margin: 0 0 8px;
                color: #6B7280;
                font-size: 12px;
                line-height: 19px;
              ">
                This is an automated account security email.
                Please do not reply directly to this message.
              </p>

              <p style="
                margin: 0 0 8px;
                color: #9CA3AF;
                font-size: 11px;
                line-height: 18px;
              ">
                Sent to the email address associated with your
                CamCabs account.
              </p>

              <p style="
                margin: 0;
                color: #9CA3AF;
                font-size: 11px;
                line-height: 18px;
              ">
                &copy; ${new Date().getFullYear()} CamCabs.
                All rights reserved.
              </p>

            </td>
          </tr>

        </table>

        <!-- Space below the email card -->
        <table
          role="presentation"
          width="600"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="width: 100%; max-width: 600px;"
        >
          <tr>
            <td align="center" style="
              padding: 16px 12px 0;
              color: #9CA3AF;
              font-size: 11px;
              line-height: 17px;
            ">
              Travel confidently. Travel with CamCabs.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`.trim(),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Verification email sent to ${email}`, info.messageId);

    return info;
  } catch (error) {
    console.error(`Failed to send verification email to ${email}:`, error);

    throw error;
  }
};

// --------- Welcome email ------------------------
export const sendWelcomeEmail = async (email) => {
  try {
    if (typeof email !== "string" || !email.trim()) {
      throw new Error("Welcome email recipient is required");
    }

    const recipient = email.trim();

    const currentYear = new Date().getFullYear();

    const appUrl = process.env.APP_URL;

    const mailFrom = process.env.MAIL_FROM;

    if (!mailFrom) {
      throw new Error("MAIL_FROM is not configured");
    }

    if (!appUrl) {
      throw new Error("APP_URL is not configured");
    }

    const mailOptions = {
      from: `"CamCabs" <${mailFrom}>`,
      to: recipient,
      subject: "Welcome to CamCabs — Your journey starts here!",

      text: `
Welcome to CamCabs!

Your account has been successfully created and your email address has been verified.

You're all set to start using CamCabs and enjoy a convenient, comfortable, and reliable travel experience.

Get started: ${appUrl}

If you have any questions or need assistance, please contact our support team.

Best regards,
CamCabs Support Team

This is an automated email. Please do not reply directly to this message.

© ${currentYear} CamCabs. All rights reserved.
      `.trim(),

      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />

  <title>Welcome to CamCabs</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #F3F4F6;
  font-family: Arial, Helvetica, sans-serif;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
">

  <!-- Preheader -->
  <div style="
    display: none;
    max-height: 0;
    max-width: 0;
    overflow: hidden;
    opacity: 0;
    color: #F3F4F6;
    font-size: 1px;
    line-height: 1px;
    mso-hide: all;
  ">
    Welcome to CamCabs! Your account is verified and ready to go.
  </div>

  <!-- Email Background -->
  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      width: 100%;
      border-collapse: collapse;
      background-color: #F3F4F6;
    "
  >
    <tr>
      <td align="center" style="padding: 36px 12px;">

        <!-- Main Container -->
        <table
          role="presentation"
          width="600"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width: 100%;
            max-width: 600px;
            border-collapse: separate;
            border-spacing: 0;
            background-color: #FFFFFF;
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            overflow: hidden;
          "
        >

          <!-- Brand Header -->
          <tr>
            <td align="center" style="
              padding: 32px 24px 28px;
              background-color: #FFFFFF;
              border-bottom: 1px solid #F3F4F6;
            ">

              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="border-collapse: collapse;"
              >
                <tr>
                  <td
                    width="5"
                    style="
                      width: 5px;
                      background-color: #F97316;
                      border-radius: 3px;
                    "
                  ></td>

                  <td style="padding-left: 12px;">
                    <h1 style="
                      margin: 0;
                      color: #111827;
                      font-size: 28px;
                      line-height: 34px;
                      font-weight: 800;
                      letter-spacing: -0.8px;
                    ">
                      Cam<span style="color: #F97316;">Cabs</span>
                    </h1>
                  </td>
                </tr>
              </table>

              <p style="
                margin: 10px 0 0;
                color: #6B7280;
                font-size: 13px;
                line-height: 20px;
              ">
                Your journey starts here.
              </p>

            </td>
          </tr>

          <!-- Welcome Content -->
          <tr>
            <td style="padding: 36px 32px 32px;">

              <!-- Welcome Label -->
              <p style="
                margin: 0 0 12px;
                color: #F97316;
                font-size: 12px;
                line-height: 18px;
                font-weight: 700;
                letter-spacing: 1.5px;
                text-transform: uppercase;
              ">
                You're officially on board
              </p>

              <h2 style="
                margin: 0 0 20px;
                color: #111827;
                font-size: 27px;
                line-height: 35px;
                font-weight: 700;
                letter-spacing: -0.5px;
              ">
                Welcome to CamCabs!
              </h2>

              <p style="
                margin: 0 0 16px;
                color: #374151;
                font-size: 15px;
                line-height: 25px;
              ">
                Hello,
              </p>

              <p style="
                margin: 0 0 16px;
                color: #4B5563;
                font-size: 15px;
                line-height: 25px;
              ">
                We're delighted to have you with us. Your CamCabs
                account has been successfully created, and your
                email address has been verified.
              </p>

              <p style="
                margin: 0 0 26px;
                color: #4B5563;
                font-size: 15px;
                line-height: 25px;
              ">
                You're all set! Get ready to discover a more
                convenient way to travel, with a simple booking
                experience designed around your journey.
              </p>

              <!-- Welcome Highlight -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  width: 100%;
                  border-collapse: separate;
                  border-spacing: 0;
                  margin: 0 0 28px;
                "
              >
                <tr>
                  <td style="
                    padding: 20px;
                    background-color: #FFF7ED;
                    border: 1px solid #FED7AA;
                    border-radius: 10px;
                  ">

                    <p style="
                      margin: 0 0 7px;
                      color: #9A3412;
                      font-size: 14px;
                      line-height: 21px;
                      font-weight: 700;
                    ">
                      Your next journey starts here.
                    </p>

                    <p style="
                      margin: 0;
                      color: #78716C;
                      font-size: 13px;
                      line-height: 21px;
                    ">
                      Your account is ready. Sign in to CamCabs
                      and get started whenever you're ready.
                    </p>

                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
                align="center"
                style="
                  margin: 0 auto 28px;
                  border-collapse: separate;
                  border-spacing: 0;
                "
              >
                <tr>
                  <td
                    align="center"
                    bgcolor="#F97316"
                    style="
                      background-color: #F97316;
                      border-radius: 7px;
                    "
                  >
                    <a
                      href="${appUrl}"
                      target="_blank"
                      style="
                        display: inline-block;
                        padding: 15px 32px;
                        color: #FFFFFF;
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 15px;
                        line-height: 20px;
                        font-weight: 700;
                        text-decoration: none;
                        border-radius: 7px;
                      "
                    >
                      Get Started &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="
                margin: 0;
                color: #6B7280;
                font-size: 13px;
                line-height: 22px;
              ">
                If the button doesn't work, copy and paste this
                address into your browser:
              </p>

              <p style="
                margin: 8px 0 28px;
                font-size: 13px;
                line-height: 21px;
                overflow-wrap: anywhere;
                word-break: break-word;
              ">
                <a
                  href="${appUrl}"
                  target="_blank"
                  style="
                    color: #EA580C;
                    text-decoration: underline;
                  "
                >${appUrl}</a>
              </p>

              <!-- Support Information -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  width: 100%;
                  border-collapse: collapse;
                  margin: 0 0 28px;
                "
              >
                <tr>
                  <td style="
                    padding: 16px 18px;
                    background-color: #F9FAFB;
                    border: 1px solid #E5E7EB;
                    border-left: 3px solid #F97316;
                    border-radius: 5px;
                  ">
                    <p style="
                      margin: 0 0 5px;
                      color: #111827;
                      font-size: 13px;
                      line-height: 20px;
                      font-weight: 700;
                    ">
                      Need a hand?
                    </p>

                    <p style="
                      margin: 0;
                      color: #6B7280;
                      font-size: 13px;
                      line-height: 21px;
                    ">
                      If you have any questions or need assistance,
                      our support team will be happy to help.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Sign-off -->
              <p style="
                margin: 0;
                color: #4B5563;
                font-size: 14px;
                line-height: 23px;
              ">
                Thank you for choosing CamCabs.<br />
                Best regards,<br />
                <strong style="color: #111827;">
                  CamCabs Support Team
                </strong>
              </p>

            </td>
          </tr>

          <!-- Footer Divider -->
          <tr>
            <td style="padding: 0 32px;">
              <div style="
                height: 1px;
                background-color: #E5E7EB;
                font-size: 0;
                line-height: 1px;
              ">&nbsp;</div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="
              padding: 25px 24px 28px;
              background-color: #FFFFFF;
            ">

              <p style="
                margin: 0 0 8px;
                color: #6B7280;
                font-size: 12px;
                line-height: 19px;
              ">
                This is an automated account email.
                Please do not reply directly to this message.
              </p>

              <p style="
                margin: 0 0 8px;
                color: #9CA3AF;
                font-size: 11px;
                line-height: 18px;
              ">
                You're receiving this email because you created
                a CamCabs account.
              </p>

              <p style="
                margin: 0;
                color: #9CA3AF;
                font-size: 11px;
                line-height: 18px;
              ">
                &copy; ${currentYear} CamCabs.
                All rights reserved.
              </p>

            </td>
          </tr>

        </table>

        <!-- Bottom Tagline -->
        <table
          role="presentation"
          width="600"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="width: 100%; max-width: 600px;"
        >
          <tr>
            <td align="center" style="
              padding: 16px 12px 0;
              color: #9CA3AF;
              font-size: 11px;
              line-height: 17px;
            ">
              Travel confidently. Travel with CamCabs.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
      `.trim(),
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    console.error("FAILED TO SEND WELCOME EMAIL:", error.message);

    throw error;
  }
};

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });
};
