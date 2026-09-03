import dotenv from "dotenv";
import path from "path";
import nodemailer from "nodemailer";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

console.log({
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS ? "DEFINED" : "MISSING",
  MAIL_FROM: process.env.MAIL_FROM,
});

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
export const sendVerificationEmail = async (
  email,
  verifyCode
) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Verify your email | TanvixTechnologies",
    html: `
      <div>
        <h2>Email Verification</h2>

        <p>Your verification code is:</p>

        <h1>${verifyCode}</h1>

        <p>This code will expire in 10 minutes.</p>

        <p>If you did not request this code, ignore this email.</p>
      </div>
    `,
  });
};

// --------- Welcome email ------------------------
export const sendWelcomeEmail = async (email) => {
  try {
    await transporter.sendMail({
      from: `"Crab Taxi" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: "Welcome to Crab Taxi ",

      html:  `
      <div style="font-family: Arial, sans-serif;">
        <h2>Welcome to Crab Taxi!</h2>

        <p>Hello,</p>

        <p>
          Your account has been successfully created.
          We're happy to have you with us!
        </p>

        <p>
          You can now start using Crab Taxi.
        </p>

        <br />

        <p>
          Best regards,<br />
          <strong>Crab Taxi Team</strong>
        </p>
      </div>
    `,
    });

    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    throw error;
  }
};

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
};


