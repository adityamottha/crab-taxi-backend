import { DriverProfile } from "../../driver/models/driverProfile.model";
import { ApiError } from "../../../utils/ApiError.js";

const driverProfileApprovedService = async ({userId})=>{
    // check userId is required
    if(!userId) throw new ApiError(404,"UserId is required!");

    // find driver by id 
    const driverProfile = await DriverProfile.findById({authUserId:userId});

    // throw err if driver not existed
    if(driverProfile) throw new ApiError(400,"DriverProfile not existed from this userId!");

    // update driver profile 
    driverProfile.profileApprovalStatus = "APPROVED";
    
    //update time 
    driverProfile.profileApprovedAt = new Date();

    // return 
   return  driverProfile;

}

export {
    driverProfileApprovedService
}