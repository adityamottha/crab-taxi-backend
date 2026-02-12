import { DriverDocuments } from "../../driver/models/driverDocuments.model.js";
import { ApiError } from "../../../utils/ApiError.js";

const driverDocumentsApprovedService = async ({userId})=>{
    // check userId is not empty
    if(!userId) throw new ApiError(404,"UserId is required!");

    // find documents by userId
    const driverDocuments = await DriverDocuments.findOne({driverProfileId:userId});
    if(!driverDocuments) throw new ApiError(400,"documents are not submitted!");

    // check if documents status already approved
    if(driverDocuments.documentsApprovalStatus = "APPROVED"){
        throw new ApiError(401,"documents already approved by admin!");
    }

    // update status
    driverDocuments.documentsApprovalStatus = "APPROVED";

    // update time
    driverDocuments.documentsApprovedAt = new Date();

    // save changes
    await driverDocuments.save();

    // return
    return driverDocuments;
};


const driverDocumentsRejectedService = async ({userId,reason})=>{
    // check userId is not empty
    // check reason is not empty
    // find driver documents by id 
    // check if driverDocuments already rejected
    // update status to reject
    // update reason
    // save changes
    // return
}

export {
    driverDocumentsApprovedService,
    driverDocumentsRejectedService
}