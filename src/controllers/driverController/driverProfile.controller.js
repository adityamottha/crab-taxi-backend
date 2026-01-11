import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const driverProfileController = AsyncHandler(async (req,res)=>{
    return res.status(200).json(new ApiResponse(200,null,"DriverProfile-OKAY"));
});

export { driverProfileController }