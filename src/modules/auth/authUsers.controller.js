import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { registerService, loginService, logoutService, refreshAccessTokenService, changePasswordService } from "./authUsers.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js"
// import { ApiError } from "../../utils/ApiError.js";

const registerController = AsyncHandler(async (req,res)=>{

    // get data from req body 
    const {phoneNumber,email,password,role} = req.body;

    // get a service here 
   const createdUser = await registerService({phoneNumber,email,password,role});

//    send response 
   return res.status(200).json(
    new ApiResponse(200,createdUser,"User register successfully!")
   );
});

// LOGIN CONTROLLER--------------
const loginController = AsyncHandler(async (req,res)=>{
   //GET DATA
   const {loggedInUser,refreshToken,accessToken} = await loginService(
      {
         email:req.body.email,
         password:req.body.password
      }
   )

   //COOKIE OPTIONS
   const options={
      httpOnly:true,
      secure:false,
      sameSite:"lax"
   };

   // send the response with cookies 
   return res.status(200)
   .cookie("refreshToken",refreshToken,options)
   .cookie("accessToken",accessToken,options)
   .json(
      new ApiResponse(200,
         {
            user:loggedInUser,refreshToken,accessToken
         },
         "User logged in Successfully!"
     )
   )
})


// Logout controller------------------

const logoutController = AsyncHandler(async (req,res)=>{

   // req comes from verifyJWT middleware 
   const userId = req.user._id;

   // call the logoutService and pass th userId from req 
   await logoutService(userId)

   // set cookies options 
   const options ={
      httpOnly:true,
      secure:false
   }

   // response send and clear the cookies for logout (clear ref and acc tokens)
   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json( new ApiResponse(200, {}, "User Logged out!"))
});


// Refresh-AccessToken Controller--------------------------------

const refreshAccessTokenController = AsyncHandler(async (req, res) => {

   // get a refresh token from cookies (from body for mobile app)
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

//   call the service function and pass the token
  const { accessToken, refreshToken } =
   await refreshAccessTokenService(incomingRefreshToken);

   // set the cookies 
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  };

//   send refreshToken as request and get the new access toke behalf of that
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken },
        "Access token refreshed successfully"
      )
    );
});

// forget password 
const changePasswordController = AsyncHandler(async (req,res)=>{
   console.log("BODY: ", req.body);
   console.log("USER-ID: ",req.user._id)
   // get user id 
   const userId = await req.user._id;

    // get data from body 
    const { oldPassword, newPassword } = req.body;

   //  call the service function 
   await changePasswordService(userId,oldPassword,newPassword);

   // send response 
   res.status(200).json(
      new ApiResponse(200,{oldPassword,newPassword},"Password has been changed successfully.")
   );
});



export { 
   registerController,
   loginController,
   logoutController,
   refreshAccessTokenController,
   changePasswordController
}
