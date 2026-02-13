import { ApiResponse } from "../../../utils/ApiResponse.js";
import { AsyncHandler } from "../../../utils/AsyncHandler.js"
import { getAllDriversService, notApprovedDriverService } from "../services/adminDashboard.service.js";
import { driverDocumentsApprovedService } from "../services/driverDocumentsApproved.service.js";
import { driverProfileApprovedService, driverProfileRejectService } from "../services/driverProfileApproved.service.js"
import { driverVehicleApprovedService } from "../services/driverVehicleApproved.service.js";

const getAllDriversController = AsyncHandler(async (req, res) => {
  const drivers = await getAllDriversService();

  return res.status(200).json(
    new ApiResponse(
        200,
         drivers, 
         "All drivers fetched successfully"
        )
  );
}
);

const notApprovedDriverController = AsyncHandler(async (req,res)=>{
  const  notApproved = await notApprovedDriverService();

  return res.status(200).json(
    new ApiResponse(200,notApproved,"Fetch all not-approved driver")
  );
})


// UPDATE TO APPROVED DRIVER STATUS....
const approvedDriverProfileStatusController = AsyncHandler(async (req,res)=>{

  // call the service function 
  const approvedDriverStatus = await driverProfileApprovedService({userId:req.body.userId});

  return res.status(200).json(
    new ApiResponse(200,{approvedDriverStatus},"Driver status approved by admin")
  )
});

// DRIVER PROFILE REJECT------------------------

const driverProfileRejectController = AsyncHandler(async (req,res)=>{
  // call service function and pass req.body in parameter
  const rejection = await driverProfileRejectService({
    userId:req.body.userId,
    reason:req.body.rejection_reason
  })
  // send res 
  return res.status(200).json(
    new ApiResponse(200,{rejection},"Driver profile Rejected by admin")
  );
});

// DRIVER DOCUMENTS APPROVED 

const driverDocumentsApprovedController = AsyncHandler(async (req,res)=>{
  // call service function
  const approvedDocuments = await driverDocumentsApprovedService({
    userId:req.body.userId
  });

  // return response 
  return res.status(200).json(
    new ApiResponse(200,{approvedDocuments}, "Documents approved by admin.")
  );
});

// DRIVER-DOCUMENTS-REJECTED------------------------
const driverDocumentsRejectController = AsyncHandler(async (req,res)=>{
  // call the service and pass the parameter from req.body
  const rejected = await driverDocumentsRejectController({
    userId:req.body.userId,
    reason:req.body.rejection_reason
  });

  // return response
  return res.status(200).json(
    new ApiResponse(200,{rejected},"Driver rejected by admin.")
  );
});


// DRIVER VEHICLE APPROVED ----------------------------------
const driverVehicleApprovedController = AsyncHandler(async (req,res)=>{
  // Call the service function and pass the parameter from req.body
  const approvedVehicle = await driverVehicleApprovedService({
    userId:req.body.userId
  });

  // return response
  return res.status(200).json(
    new ApiResponse(
      200,
      {status:approvedVehicle.vehicleApproved, updateTime:approvedVehicle.vehicleApprovedAt},
      "Vehicle approved by admin!"
    )
  );
});


// DRIVER VEHICLE REJECTED-----------------------------
const driverVehicleRejectController = AsyncHandler(async ()=>{
  // call service function and pass parameter from req.body
  // send response
  return res.status(200).json(
    new ApiResponse(200,{},"Vehicle rejected by admin.")
  );
});

export { 
  getAllDriversController,
  notApprovedDriverController,
  approvedDriverProfileStatusController,
  driverProfileRejectController,
  driverDocumentsApprovedController,
  driverDocumentsRejectController,
  driverVehicleApprovedController,
  driverVehicleRejectController
 }