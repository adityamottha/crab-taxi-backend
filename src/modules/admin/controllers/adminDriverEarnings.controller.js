import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

import { 
     getDriverEarningHistoryService,
     getDriverEarningsService, 
     getDriverWeeklyEarningHistoryService
     } 
     from "../../driver/services/driverEarnings.service.js";

// DRIVER EARNINGS
const getDriverEarningsByAdminController = AsyncHandler( async (req, res) => {

    const driverId = req.params.driverId;

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
const getDriverEarningHistoryByAdminController = AsyncHandler(async (req,res) => {

  // get driver id
  const driverId = req.params.driverId;

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
 const getDriverWeeklyEarningHistoryByAdminController = AsyncHandler(async (req, res) => {

    // driver id from user
      const driverId = req.params.driverId;

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
    getDriverEarningsByAdminController,
    getDriverEarningHistoryByAdminController,
    getDriverWeeklyEarningHistoryByAdminController
}