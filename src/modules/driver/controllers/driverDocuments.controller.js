import { ApiResponse } from "../../../utils/ApiResponse.js";
import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiError } from "../../../utils/ApiError.js";
import { driverDocumentService, getDriverDocumentsService } from "../services/driverDocuments.service.js";

const driverDocumentController = AsyncHandler(async (req,res)=>{

   if (!req.files || Object.keys(req.files).length === 0) {
    throw new ApiError(400, "No files uploaded");
  }

   const driverLicenseFiles = req.files?.driverLicense;
   const insuranceFiles = req.files?.insurance;
   const vehicleRCFiles = req.files?.vehicleRC;

  let driverLicenseCredentials, insuranceCredentials, vehicleRCCredentials;

   try {
      driverLicenseCredentials = JSON.parse(req.body.driverLicenseCredentials);
      insuranceCredentials = JSON.parse(req.body.insuranceCredentials);
      vehicleRCCredentials = JSON.parse(req.body.vehicleRCCredentials);
   } catch (error) {
      throw new ApiError(400, error?.message || "Invalid credentials JSON format");
   }

//    console.log("BODY: ",req.body)

   const documents = await driverDocumentService({
    userId:req.user._id,
    driverLicenseFiles,
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

const getDriverDocumentsController = AsyncHandler(async (req, res) => {

  // get params from req.params 
  const  userId  = req.user._id;

  // call service function and pass params
  const driver = await getDriverDocumentsService({ userId });

  // return response 
  return res.status(200).json(
    new ApiResponse(200, driver, "Driver documents fetch successfully!")
  );
});


export { 
   driverDocumentController,
   getDriverDocumentsController
 }