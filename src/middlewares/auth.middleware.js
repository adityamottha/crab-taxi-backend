import { AuthUser } from "../models/authModel/AuthUsers.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const verifyJWT = AsyncHandler(async (req, _, next)=>{
    try {
        const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token) throw new ApiError(401,"Unauthorized request!");

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

        const user = await AuthUser.findById(decodeToken?.userId).select("-password");

        if(!user) throw new ApiError(401,"Invalid Access token!");

        req.user = user;
        req.userRole = decoded.role;

        next();
    } catch (error) {
        console.log("verifyJWT ERROR:- ",error);
        throw new ApiError(500,error?.message || "INTERNAL SERVER ERROR:- ")
    }
});

export { verifyJWT }