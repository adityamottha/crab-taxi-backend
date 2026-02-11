import { DriverProfile } from "../../driver/models/driverProfile.model.js";
import { ApiError } from "../../../utils/ApiError.js";

const driverProfileApprovedService = async ({userId})=>{
    // check userId is required
    if(!userId) throw new ApiError(404,"UserId is required!");

    // find driver by id 
    const driverProfile = await DriverProfile.findOne({authUserId:userId});

    // throw err if driver not existed
    if(!driverProfile) throw new ApiError(400,"DriverProfile not existed from this userId!");

    // update driver profile 
    driverProfile.profileApprovalStatus = "APPROVED";
    
    //update time 
    driverProfile.profileApprovedAt = new Date();

    // save changes 
    await driverProfile.save();

    // return 
   return  driverProfile;

}

// DRIVER_PROFILE REJECT------------------------

const driverProfileRejectService = async ({userId,reason})=>{
    // check userId and reason is required
    if(!userId?.trim()){
        throw new ApiError(404,"UserId is required!");
    }

    if(!reason?.trim()){
        throw new ApiError(404,"Reason is required");
    }

    // find driver-profile by userId
    const driverProfile = await DriverProfile.findOne({userId});
    if(!driverProfile) throw new ApiError(400,"Not a valid user");

    // update status to reject
    driverProfile.profileApprovalStatus = "REJECTED";

    // update reason
    driverProfile.rejectionReason = reason;

    // save changed
    await driverProfile.save();

    // return
   return driverProfile
}

export {
    driverProfileApprovedService,
    driverProfileRejectService
}