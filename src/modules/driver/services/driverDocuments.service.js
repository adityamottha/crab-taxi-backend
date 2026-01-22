import { ApiError } from "../../../utils/ApiError.js";
import { DriverProfile } from ".././models/driverProfile.model.js";
import { DriverDocuments } from ".././models/driverDocuments.model.js";
import { uploadMultipleFiles } from "../../../utils/uploadMultipleFiles.js";
import { AuthUser } from "../../auth/authUsers.models.js";

const driverDocumentService = async ({
    userId,
    driverLicenceFiles,
    insuranceFiles,
    vehicleRCFiles,
    driverLicenseCredentials,
    insuranceCredentials,
    vehicleRCCredentials
})=>{

    // check files fields are available 
    if(!driverLicenceFiles?.length || !insuranceFiles?.length || !vehicleRCFiles?.length ){
        throw new ApiError(404,"All files fields are required!");
    };

    // check credentials fields are available
    if(!driverLicenseCredentials || !insuranceCredentials || !vehicleRCCredentials){
        throw new ApiError(404,"All credentials are required!");
    }

    // check driver profile  existed 
    //  console.log("USER ID:", userId);
    //  console.log("TYPE:", typeof userId);

    const driverprofile = await DriverProfile.findOne({authUserId:userId});
    if(!driverprofile) throw new ApiError(401,"First complete your Profile!");
   
    // check driver documents ? submitted? or not ?
    const existedDocs = await DriverDocuments.findOne({driverProfileId:driverprofile._id});
    if(existedDocs) throw new ApiError(409,"Documents already submitted!");

    // upload files
    const driverLicence = await uploadMultipleFiles(driverLicenceFiles);
    const insurance = await uploadMultipleFiles(insuranceFiles);
    const vehicleRc = await uploadMultipleFiles(vehicleRCFiles);

    //inserts documents in db
    const documents = await DriverDocuments.create({

        driverProfileId: driverprofile._id,

        driverLicense:{
            urls:driverLicence,
            credentials:driverLicenseCredentials
        },

        insurance:{
            urls:insurance,
            credentials:insuranceCredentials
        },

        vehicleRC:{
            urls:vehicleRc,
            credentials:vehicleRCCredentials
        }
    });

    //check submitted or not 
    if(!documents) throw new ApiError(500,"Failed to submit documents!");

    // update field
    await AuthUser.findByIdAndUpdate(userId,{isDocumentSubmitted:true},{new:true});

    //return
    return documents;
}

export { driverDocumentService }