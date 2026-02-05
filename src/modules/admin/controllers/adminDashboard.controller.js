import { ApiResponse } from "../../../utils/ApiResponse.js";
import { AsyncHandler } from "../../../utils/AsyncHandler.js"
import { getAllDriversService, notApprovedDriverService } from "../services/adminDashboard.service.js";


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


export { 
  getAllDriversController,
  notApprovedDriverController
 }