const DB_NAME = "crab_taxi_app";
const ONE_DAY = 24*60*60*1000;


 const OTP_CONFIG = {
  EXPIRY_MS: 10 * 60 * 1000, // 10 minutes
  RESEND_COOLDOWN_MS: 30 * 1000, // 30 seconds
  MAX_RESEND_ATTEMPTS: 5,
  BLOCK_DURATION_MS: 60 * 60 * 1000, // 1 hour
}

export {
    DB_NAME,
    ONE_DAY,
    OTP_CONFIG
}
