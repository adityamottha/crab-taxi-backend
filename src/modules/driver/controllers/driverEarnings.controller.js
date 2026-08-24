import { getDriverEarningHistoryService, getDriverEarningsService } from "../services/driverEarnings.service.js";
import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

 // ================= GET-DRIVER-WEEK-DAY-TODAY's EARNINGS ==============
const getDriverEarningsController = AsyncHandler( async (req, res) => {

    const driverId = req.user._id;

    const earnings = await getDriverEarningsService(driverId);

    return res.status(200).json(
      new ApiResponse(
        200,
        earnings,
        "Driver earnings fetched successfully"
      )
    );
  }
);

// ============== DAILY EARNINGS HISTORY ===================
const getDriverEarningHistoryController = AsyncHandler(async (req,res) => {

  // get driver id
  const driverId = req.user._id;

  // call service function 
  const history = await getDriverEarningHistoryService(driverId);

  // send response 
  return res.status(200).json(
    new ApiResponse(
      200,
      history,
      "Driver earning history fetched successfully"
    )
  );
})

export {
    getDriverEarningsController,
    getDriverEarningHistoryController
}