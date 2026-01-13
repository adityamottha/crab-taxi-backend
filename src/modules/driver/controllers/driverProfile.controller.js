import { AsyncHandler } from "../../../utils/AsyncHandler.js";
// import { ApiResponse } from "../../../utils/ApiResponse.js";
// import { driverProfileService } from "../services/driverProfile.service.js";

const driverProfileController = AsyncHandler(async (req,res)=>{

    console.log("FULLNAME: ", req.body.fullname);
    
//     // check avatar in localPath 
//     const driverAvatar = req.files?.avatar?.[0]?.path;

//     // set driver service 
//     const  {driver} = await  driverProfileService({
//     fullname:req.body.fullName,
//     dateOfBirth:req.body.dateOfBirth,
//     address:req.body.addess,
//     driverAvatar,
//     user:req.user._id
//    });

// //    send response 

// return res
// .status(200)
// .json(
//     new ApiResponse(200,driver,"Driver profile completed!"

//     ));
});

export { driverProfileController }