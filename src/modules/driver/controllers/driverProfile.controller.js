import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { driverProfileService } from "../services/driverProfile.service.js";

const driverProfileController = AsyncHandler(async (req,res)=>{

    // check avatar in localPath 
    const driverAvatar = req.files?.avatar?.[0]?.path;

    // convert address = string to object
    const address = req.body.address? JSON.parse(req.body.address) : [];

    // set driver service 
    const driver = await  driverProfileService({
    fullname:req.body.fullname,
    dateOfBirth:req.body.dateOfBirth,
    address,
    driverAvatar,
    user:req.user._id
   });

//    send response 

return res
.status(200)
.json(
    new ApiResponse(200,driver,"Driver profile completed!"

    ));
});

export { driverProfileController }