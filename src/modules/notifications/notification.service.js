import { sendEmail } from "../../utils/mailer.js";

export const sendWelcomeEmail = async (user) => {
  const html = `
    <h2>Welcome to Crab Taxi 🚕</h2>
    <p>Hello ${user.email},</p>
    <p>Your account has been successfully created.</p>
    <p>We're happy to have you onboard!</p>
    <br/>
    <p>Thanks,</p>
    <p>Crab Taxi Team</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Welcome to Crab Taxi 🚕",
    html,
  });
};

export const sendPasswordResetEmail = async (user, resetUrl) => {

  const html = `
    <h2>Password Reset Request</h2>
    <p>Hello ${user.email},</p>
    <p>Click below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 10 minutes.</p>
    <br/>
    <p>If you did not request this, please ignore this email.</p>
    <p>Crab Taxi Security Team</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    html,
  });
};

export const sendPasswordChangedEmail = async (user) => {
  const html = `
    <h2>🔐 Password Updated Successfully</h2>
    <p>Hello ${user.email},</p>
    <p>Your password was changed successfully.</p>
    <p>If this was not you, please reset your password immediately.</p>
    <br/>
    <p>Time: ${new Date().toLocaleString()}</p>
    <p>Crab Taxi Security Team</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Your Password Has Been Updated",
    html,
  });
};
