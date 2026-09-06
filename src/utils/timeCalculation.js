
// FUNCTION FOR RE_REQUEST OTP AFTER SECOND's
const getRemainingSeconds = (lastRequestedAt,cooldownMs) => {
  const elapsed =
    Date.now() - lastRequestedAt.getTime();

  return Math.ceil(
    (cooldownMs - elapsed) / 1000
  );
};

// FUNCTION FOR RE_REQUEST OTP AFTER MINUTE's

const getRemainingMinutes = (blockedUntil) => {
  const remainingMs =
    blockedUntil.getTime() - Date.now();

  return Math.ceil(
    remainingMs / (60 * 1000)
  );
};

export{
    getRemainingSeconds,
    getRemainingMinutes
}