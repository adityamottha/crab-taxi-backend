import { ApiResponse } from "../../../utils/ApiResponse.js";
import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { driverDocumentService } from "../services/driverDocuments.service.js";

const driverDocumentController = AsyncHandler(async (req,res)=>{
   const driverLicenceFiles = req.files?.driverLicense?.[0].path;
   const insuranceFiles = req.files?.insurance?.[0]?.path;
   const vehicleRCFiles = req.files?.vehicleRC?.[0]?.path;

   const driverLicenseCredentials = JSON.parse(req.body.driverLicenseCredentials);
   const insuranceCredentials = JSON.parse(req.body.insuranceCredentials);
   const vehicleRCCredentials = JSON.parse(req.body.vehicleRCCredentials);

   const documents = await driverDocumentService({
    userId:req.body._id,
    driverLicenceFiles,
    insuranceFiles,
    vehicleRCFiles,
    driverLicenseCredentials,
    insuranceCredentials,
    vehicleRCCredentials
   });
   return res.status(200).json(
    new ApiResponse(
        200,
        documents,
        "Driver Submitted Documentes."
    )
   )

});

export { driverDocumentController }