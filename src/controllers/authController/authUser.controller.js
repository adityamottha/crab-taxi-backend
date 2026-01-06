import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { registerService } from "../../services/authServices/authUser.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js"

const registerController = AsyncHandler(async (req,res)=>{
    // get a service here 
   const {insertUser} = registerService({
    phoneNumber:req.body,
    email:req.body,
    password:req.body,
    role:req.body
   });

//    send response 
   return res.status(200).json(
    new ApiResponse(200,insertUser,"User register successfully!")
   );
});

export { registerController }
