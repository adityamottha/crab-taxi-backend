import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

import { getDriverProfileForUserService, getNearbyDriversService } from "../services/riderDashboard.service.js";

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

// Get driver profile for user
const getDriverProfileForUserController = AsyncHandler(async (req,res)=>{

  // get userId from req.body  
  const driverId = req.body.driverId;

  // call the service function 
  const driver = await getDriverProfileForUserService(driverId);

  // send response 
  return res.status(200).json(
    new ApiResponse(200,driver,"Single driver fetched successfully!")
  )
});

export {
  getNearbyDrivers,
  getDriverProfileForUserController
};