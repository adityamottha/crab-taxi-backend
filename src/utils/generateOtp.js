import { randomInt } from "node:crypto";

// GENERATE OTP
export const generateOTP = () => {
  return randomInt(100000, 1000000).toString();
};

// HASH OTP
export const hashOTP = (otp) => {
  return createHash("sha256")
    .update(otp)
    .digest("hex");
};