import jwt from "jsonwebtoken";
import { AuthUser } from "../../models/authModel/AuthUsers.model.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

const verifyJWT = AsyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    // console.log("TOKEN:", token);

    if (!token) throw new ApiError(401, "Unauthorized request!");

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    const user = await AuthUser.findById(decoded.userId).select("-password");

    if (!user) throw new ApiError(401, "Invalid Access token!");

    req.user = user;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    console.log("verifyJWT ERROR:- ", error.message);

    throw new ApiError(
      error.name === "JsonWebTokenError" ? 401 : 500,
      error.message
    );
  }
});


export { verifyJWT };
