import { AuthUser } from "../models/auth/AuthUsers.model";
import { ApiError } from "./ApiError.js";

const generateAccessAndRefreshToken = async (userId)=>{
   try {

     if(!userId) return null;
     
     const authUser = await AuthUser.findById(userId);
     if(!authUser) throw new ApiError(404,"User dont have an account! ");
 
     const accessToken = generateAccessToken();
     const refreshToken = generateRefreshToken();
 
     authUser.refreshToken = refreshToken;
     await authUser.save({validateBeforeSave:false});

     return { accessToken, refreshToken};

   } catch (error) {

    console.log("TOKENS ERROR:- ", error);
    ApiError(500,error?.message || "FAILED TO GENERATE TOKENS!");
    
   }
}

export { generateAccessAndRefreshToken }