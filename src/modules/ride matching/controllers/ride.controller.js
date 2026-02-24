import { createRideService } from "../services/ride.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { AsyncHandler } from "../../../utils/AsyncHandler.js";

export const createRideController = AsyncHandler(async (req, res) => {
  const { pickup, drop, distance } = req.body;

  const ride = await createRideService({
    user: req.user,
    pickup,
    drop,
    distance,
  });

  return res.status(200).json(
    new ApiResponse(200, ride, "Ride created successfully")
  );
});