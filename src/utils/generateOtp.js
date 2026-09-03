import { randomInt , createHash} from "node:crypto";

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


export const verifyOTP = (otp, hashedOtp) => {
  if (!otp || !hashedOtp) {
    return false;
  }

  const hashedInput = createHash("sha256")
    .update(otp.toString())
    .digest("hex");

  return hashedInput === hashedOtp;
};