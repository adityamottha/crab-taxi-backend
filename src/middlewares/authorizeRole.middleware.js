import { ApiError } from "../utils/ApiError.js";

const authorizeRole = (role) => {
    return (req, _, next) => {
        if (!req.userRole) {
            return next(new ApiError(401, "Unauthorized request!"));
        }

        if (req.userRole !== role) {
            return next(
                new ApiError(403, `${req.userRole} is not allowed to access this API!`)
            );
        }

        next();
    };
};

export { authorizeRole };
