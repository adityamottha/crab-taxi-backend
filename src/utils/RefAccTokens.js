import { AuthUser } from "../models/authModel/AuthUsers.model.js";
import { ApiError } from "./ApiError.js";

const generateAccessAndRefreshToken = async (userId)=>{
   try {

     if(!userId) throw new ApiError(400, "UserId is required to generate tokens");
     
     const authUser = await AuthUser.findById(userId);
     if(!authUser) throw new ApiError(404,"User dont have an account! ");
 
     const accessToken = authUser.generateAccessToken();
     const refreshToken = authUser.generateRefreshToken();


     return { accessToken, refreshToken};

   } catch (error) {

    console.log("TOKENS ERROR:- ", error);
    throw new ApiError(500,error?.message || "FAILED TO GENERATE TOKENS!");

   }
}

export { generateAccessAndRefreshToken }