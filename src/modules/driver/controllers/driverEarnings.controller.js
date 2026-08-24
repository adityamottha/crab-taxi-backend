import { getDriverEarningHistoryService, getDriverEarningsService, getDriverWeeklyEarningHistoryService } from "../services/driverEarnings.service.js";
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
  const driverId = req.user._id || req.params.driverId;

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
});


// =============== WEEKLY EARNINGS CONTROLLER =============
export const getDriverWeeklyEarningHistoryController = AsyncHandler(async (req, res) => {

    // driver id from user
      const driverId = req.user._id || req.params.driverId;

      // get service and pass driver id
    const history = await getDriverWeeklyEarningHistoryService(
        driverId
      );

      // return response
    return res.status(200).json(
      new ApiResponse(
        200,
        history,
        "Weekly earning history fetched successfully"
      )
    );
  })

export {
    getDriverEarningsController,
    getDriverEarningHistoryController
}

