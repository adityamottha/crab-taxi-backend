import { ApiResponse } from "../../../utils/ApiResponse.js";
import { AsyncHandler } from "../../../utils/AsyncHandler.js"
import { getAllDriversService, notApprovedDriverService } from "../services/adminDashboard.service.js";
import { driverProfileApprovedService } from "../services/driverProfileApproved.service.js"

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

// DOCUMENTS APPROVAL------------------------

const driverDocumentsApprovedController = AsyncHandler(async (req,res)=>{
  // call service function and pass req.body in parameter
  // send res 
  return res.status(200).json(
    new ApiResponse(200,{},"Driver profile Approved by admin")
  );
});

export { 
  getAllDriversController,
  notApprovedDriverController,
  approvedDriverProfileStatusController,
  driverDocumentsApprovedController
 }