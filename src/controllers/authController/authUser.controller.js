import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { registerService } from "../../services/authServices/authUser.service.js";
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

export { registerController }
