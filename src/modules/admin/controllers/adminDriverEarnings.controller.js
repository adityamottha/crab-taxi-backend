import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { getDriverEarningsService } from "../../driver/services/driverEarnings.service.js";
import { ApiResponse } from "../../../utils/ApiResponse";
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

export {
    getDriverEarningsByAdminController
}