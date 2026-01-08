import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { registerService, loginService, logoutService } from "../../services/authServices/authUser.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js"

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

   await logoutService(userId)

   const options ={
      httpOnly:true,
      secure:false
   }

   // response send 

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json( new ApiResponse(200, {}, "User Logged out!"))
})

export { 
   registerController,
   loginController,
   logoutController
}
