import { ApiError } from "../utils/ApiError.js";

const authorizeRole = (...roles) => {
  return (req, res, next) => {

    if (!req.user?.role) {
      throw new ApiError(401, "Unauthorized request!");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `${req.user.role} is not allowed to access this API!`
      );
    }

    next();
  };
};

export { authorizeRole };