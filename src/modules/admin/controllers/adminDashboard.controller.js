import { ApiResponse } from "../../../utils/ApiResponse.js";
import { AsyncHandler } from "../../../utils/AsyncHandler.js"
import { getAllDriversService, notApprovedDriverService } from "../services/adminDashboard.service.js";
import { driverProfileApprovedService, driverProfileRejectService } from "../services/driverProfileApproved.service.js"

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

export { 
  getAllDriversController,
  notApprovedDriverController,
  approvedDriverProfileStatusController,
  driverProfileRejectController
 }