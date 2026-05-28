import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

import { getNearbyDriversService } from "../services/riderDashboard.service.js";

const getNearbyDrivers = AsyncHandler(async (req, res) => {

  const { lng, lat } = req.query;

  const drivers = await getNearbyDriversService({
    lng,
    lat
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalDrivers: drivers.length,
        drivers
      },
      "Nearby drivers fetched successfully"
    )
  );

});

export {
  getNearbyDrivers
};