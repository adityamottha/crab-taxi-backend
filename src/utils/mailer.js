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
      from: `"Crab Taxi" <${process.env.MAIL_FROM}>`,
      to: email.trim(),
      subject: "Verify your email | Crab Taxi",

      // Fallback for email clients that don't support HTML
      text: `
Welcome to Crab Taxi!

Your email verification code is: ${verifyCode}

This code will expire in 10 minutes.

If you did not request this verification code, you can safely ignore this email.

Crab Taxi Team
      `.trim(),

      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <meta name="color-scheme" content="light" />

  <title>Verify your email | Crab Taxi</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f4f6f8;
  font-family: Arial, Helvetica, sans-serif;
">

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      width: 100%;
      background-color: #f4f6f8;
      padding: 40px 16px;
    "
  >
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 600px;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="
                background-color: #111827;
                padding: 32px 24px;
              "
            >

              <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 28px;
                line-height: 1.2;
                font-weight: 700;
              ">
                Crab Taxi
              </h1>

              <p style="
                margin: 8px 0 0;
                color: #d1d5db;
                font-size: 14px;
                line-height: 1.5;
              ">
                Ride smarter. Travel better.
              </p>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="
              padding: 40px 32px;
            ">

              <h2 style="
                margin: 0 0 20px;
                color: #111827;
                font-size: 24px;
                line-height: 1.3;
                font-weight: 700;
              ">
                Verify your email address
              </h2>

              <p style="
                margin: 0 0 16px;
                color: #374151;
                font-size: 16px;
                line-height: 1.6;
              ">
                Hello,
              </p>

              <p style="
                margin: 0 0 24px;
                color: #374151;
                font-size: 16px;
                line-height: 1.6;
              ">
                Thanks for creating an account with Crab Taxi.
                Please use the verification code below to verify
                your email address.
              </p>

              <!-- OTP Box -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin: 0 0 24px;
                "
              >
                <tr>
                  <td
                    align="center"
                    style="
                      background-color: #f3f4f6;
                      border: 1px solid #e5e7eb;
                      border-radius: 10px;
                      padding: 24px 16px;
                    "
                  >

                    <p style="
                      margin: 0 0 10px;
                      color: #6b7280;
                      font-size: 13px;
                      line-height: 1.5;
                      text-transform: uppercase;
                      letter-spacing: 1px;
                    ">
                      Verification Code
                    </p>

                    <p style="
                      margin: 0;
                      color: #111827;
                      font-size: 32px;
                      line-height: 1.2;
                      font-weight: 700;
                      letter-spacing: 8px;
                    ">
                      ${verifyCode}
                    </p>

                  </td>
                </tr>
              </table>

              <!-- Expiration -->
              <p style="
                margin: 0 0 20px;
                color: #374151;
                font-size: 14px;
                line-height: 1.6;
              ">
                <strong>This code will expire in 10 minutes.</strong>
                For your security, please do not share this code with
                anyone.
              </p>

              <!-- Security Notice -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin: 0 0 24px;
                "
              >
                <tr>
                  <td style="
                    background-color: #f9fafb;
                    border-left: 4px solid #9ca3af;
                    padding: 14px 16px;
                  ">

                    <p style="
                      margin: 0;
                      color: #6b7280;
                      font-size: 13px;
                      line-height: 1.6;
                    ">
                      If you did not request this verification code,
                      you can safely ignore this email. Your account
                      will remain secure.
                    </p>

                  </td>
                </tr>
              </table>

              <p style="
                margin: 0;
                color: #374151;
                font-size: 15px;
                line-height: 1.6;
              ">
                Best regards,<br />
                <strong>Crab Taxi Team</strong>
              </p>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="
              padding: 0 32px;
            ">
              <div style="
                height: 1px;
                background-color: #e5e7eb;
              "></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              align="center"
              style="
                padding: 28px 32px;
              "
            >

              <p style="
                margin: 0 0 8px;
                color: #9ca3af;
                font-size: 12px;
                line-height: 1.5;
              ">
                This is an automated message from Crab Taxi.
                Please do not reply directly to this email.
              </p>

              <p style="
                margin: 0;
                color: #9ca3af;
                font-size: 12px;
                line-height: 1.5;
              ">
                © ${new Date().getFullYear()} Crab Taxi.
                All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `Verification email sent to ${email}`,
      info.messageId
    );

    return info;

  } catch (error) {
    console.error(
      `Failed to send verification email to ${email}:`,
      error
    );

    throw error;
  }
};


// --------- Welcome email ------------------------
export const sendWelcomeEmail = async (email) => {
  try {
    if (!email?.trim()) {
      throw new Error("Welcome email recipient is required");
    }

    console.log("WELCOME EMAIL RECEIVED:", email);

    const mailOptions = {
      from: `"Crab Taxi" <${process.env.MAIL_FROM}>`,
      to: email.trim(),
      subject: "Welcome to Crab Taxi",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Welcome to Crab Taxi</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
        ">

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="padding: 40px 16px; background-color: #f4f6f8;"
          >
            <tr>
              <td align="center">

                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    max-width: 600px;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                  "
                >

                  <!-- Header -->
                  <tr>
                    <td
                      align="center"
                      style="
                        padding: 32px 24px;
                        background-color: #111827;
                      "
                    >
                      <h1 style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 28px;
                      ">
                        Crab Taxi
                      </h1>

                      <p style="
                        margin: 8px 0 0;
                        color: #d1d5db;
                        font-size: 14px;
                      ">
                        Ride smarter. Travel better.
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 32px;">

                      <h2 style="
                        margin: 0 0 20px;
                        color: #111827;
                        font-size: 24px;
                      ">
                        Welcome to Crab Taxi! 👋
                      </h2>

                      <p style="
                        margin: 0 0 16px;
                        color: #374151;
                        font-size: 16px;
                        line-height: 1.6;
                      ">
                        Hello,
                      </p>

                      <p style="
                        margin: 0 0 16px;
                        color: #374151;
                        font-size: 16px;
                        line-height: 1.6;
                      ">
                        Your Crab Taxi account has been successfully created
                        and your email address has been verified.
                      </p>

                      <p style="
                        margin: 0 0 24px;
                        color: #374151;
                        font-size: 16px;
                        line-height: 1.6;
                      ">
                        You're all set! You can now start using Crab Taxi
                        and enjoy a convenient and reliable transportation
                        experience.
                      </p>

                      <!-- CTA -->
                      <table
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="margin: 0 auto 28px;"
                      >
                        <tr>
                          <td
                            align="center"
                            style="
                              background-color: #111827;
                              border-radius: 8px;
                            "
                          >
                            <a
                              href="https://your-app-domain.com"
                              target="_blank"
                              style="
                                display: inline-block;
                                padding: 14px 28px;
                                color: #ffffff;
                                text-decoration: none;
                                font-size: 15px;
                                font-weight: 600;
                              "
                            >
                              Get Started
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="
                        margin: 0;
                        color: #6b7280;
                        font-size: 14px;
                        line-height: 1.6;
                      ">
                        If you have any questions or need assistance,
                        our support team is here to help.
                      </p>

                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td style="padding: 0 32px;">
                      <div style="
                        height: 1px;
                        background-color: #e5e7eb;
                      "></div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td
                      align="center"
                      style="padding: 28px 32px;"
                    >

                      <p style="
                        margin: 0 0 8px;
                        color: #374151;
                        font-size: 14px;
                      ">
                        Best regards,
                      </p>

                      <p style="
                        margin: 0 0 16px;
                        color: #111827;
                        font-size: 15px;
                        font-weight: 600;
                      ">
                        Crab Taxi Team
                      </p>

                      <p style="
                        margin: 0;
                        color: #9ca3af;
                        font-size: 12px;
                      ">
                        This is an automated email.
                        Please do not reply directly to this message.
                      </p>

                      <p style="
                        margin: 12px 0 0;
                        color: #9ca3af;
                        font-size: 12px;
                      ">
                        © ${new Date().getFullYear()} Crab Taxi.
                        All rights reserved.
                      </p>

                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
      `,
    };

    // console.log("WELCOME MAIL OPTIONS:", mailOptions);

    const info = await transporter.sendMail(mailOptions);

    // console.log(
    //   "WELCOME EMAIL SENT:",
    //   info.messageId
    // );

    return info;

  } catch (error) {
    console.error("FAILED WELCOME EMAIL:", error);
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


