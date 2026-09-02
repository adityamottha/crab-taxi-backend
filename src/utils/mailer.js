import dotenv from "dotenv";
import path from "path";
import nodemailer from "nodemailer";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
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

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
};
