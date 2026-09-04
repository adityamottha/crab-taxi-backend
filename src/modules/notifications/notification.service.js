import { sendEmail } from "../../utils/mailer.js";


// SEND PASSOWRD RESET EMAIL
export const sendPasswordResetEmail = async (user, resetUrl) => {
  try {
    if (!user?.email) {
      throw new Error("Password reset email recipient is required");
    }

    if (!resetUrl) {
      throw new Error("Password reset URL is required");
    }

    const mailOptions = {
      to: user.email.trim(),
      subject: "Reset your Crab Taxi password",

      text: `
Password Reset Request

Hello,

We received a request to reset your Crab Taxi account password.

Use the link below to create a new password:

${resetUrl}

This password reset link will expire in 10 minutes.

If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.

For your security, never share your password reset link with anyone.

Best regards,
Crab Taxi Security Team
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

  <title>Reset your password | Crab Taxi</title>
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
                Account Security
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
              ">
                Reset your password
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
                We received a request to reset the password for your
                Crab Taxi account.
              </p>

              <!-- CTA -->
              <table
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin: 0 auto 28px;
                "
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
                      href="${resetUrl}"
                      target="_blank"
                      style="
                        display: inline-block;
                        padding: 14px 28px;
                        color: #ffffff;
                        text-decoration: none;
                        font-size: 15px;
                        font-weight: 600;
                        border-radius: 8px;
                      "
                    >
                      Reset My Password
                    </a>
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
                <strong>This password reset link will expire in
                10 minutes.</strong>
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
                      If you did not request a password reset, you can
                      safely ignore this email. Your password will remain
                      unchanged.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="
                margin: 0;
                color: #6b7280;
                font-size: 13px;
                line-height: 1.6;
              ">
                For your security, never share your password or
                password reset link with anyone.
              </p>

              <br />

              <p style="
                margin: 0;
                color: #374151;
                font-size: 15px;
                line-height: 1.6;
              ">
                Best regards,<br />
                <strong>Crab Taxi Security Team</strong>
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
                color: #9ca3af;
                font-size: 12px;
                line-height: 1.5;
              ">
                This is an automated security message from Crab Taxi.
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

    const info = await sendEmail(mailOptions);

    console.log(
      `Password reset email sent to ${user.email}`,
      info?.messageId
    );

    return info;
  } catch (error) {
    console.error(
      `Failed to send password reset email to ${user?.email}:`,
      error
    );

    throw error;
  }
};


// SEND CHANGE PASSWORD EMAIL -----------------------------
export const sendPasswordChangedEmail = async (user) => {
  try {
    if (!user?.email) {
      throw new Error("Password changed email recipient is required");
    }

    const changedAt = new Date().toUTCString();

    const mailOptions = {
      to: user.email.trim(),
      subject: "Your Crab Taxi password was changed",

      text: `
Password Changed Successfully

Hello,

Your Crab Taxi account password was successfully changed.

Date and time:
${changedAt}

If you made this change, no further action is required.

If you did not change your password, your account may be at risk. Please reset your password immediately and contact Crab Taxi Support.

For your security, never share your password with anyone.

Crab Taxi Security Team
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

  <title>Password changed | Crab Taxi</title>
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
              ">
                Crab Taxi
              </h1>

              <p style="
                margin: 8px 0 0;
                color: #d1d5db;
                font-size: 14px;
              ">
                Account Security
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
                line-height: 1.3;
              ">
                Password changed successfully
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
                Your Crab Taxi account password was successfully
                changed.
              </p>

              <!-- Status Box -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="margin: 0 0 24px;"
              >
                <tr>
                  <td style="
                    background-color: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 18px;
                  ">

                    <p style="
                      margin: 0 0 6px;
                      color: #6b7280;
                      font-size: 13px;
                    ">
                      Password changed
                    </p>

                    <p style="
                      margin: 0;
                      color: #111827;
                      font-size: 14px;
                      font-weight: 600;
                    ">
                      ${changedAt}
                    </p>

                  </td>
                </tr>
              </table>

              <p style="
                margin: 0 0 20px;
                color: #374151;
                font-size: 14px;
                line-height: 1.6;
              ">
                If you made this change, no further action is required.
              </p>

              <!-- Security Warning -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="margin-bottom: 24px;"
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
                      <strong>If you did not make this change,</strong>
                      your account may be at risk. Reset your password
                      immediately and contact Crab Taxi Support.
                    </p>

                  </td>
                </tr>
              </table>

              <p style="
                margin: 0;
                color: #6b7280;
                font-size: 13px;
                line-height: 1.6;
              ">
                For your security, never share your password with
                anyone, including Crab Taxi staff.
              </p>

              <br />

              <p style="
                margin: 0;
                color: #374151;
                font-size: 15px;
                line-height: 1.6;
              ">
                Best regards,<br />
                <strong>Crab Taxi Security Team</strong>
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
                color: #9ca3af;
                font-size: 12px;
                line-height: 1.5;
              ">
                This is an automated security message from Crab Taxi.
                Please do not reply directly to this email.
              </p>

              <p style="
                margin: 0;
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

    const info = await sendEmail(mailOptions);

    console.log(
      `Password changed email sent to ${user.email}`,
      info?.messageId
    );

    return info;
  } catch (error) {
    console.error(
      `Failed to send password changed email to ${user?.email}:`,
      error
    );

    throw error;
  }
};

