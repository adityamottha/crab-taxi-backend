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

const driverDocumentsApprovedService = async ({userId})=>{
    // check userId is required
    // find driver-documents by userId
    // check driver submitted a documents
    // update status to approved
    // update time of approved
    // save changed
    // return

}

export {
    driverProfileApprovedService,
    driverDocumentsApprovedService
}