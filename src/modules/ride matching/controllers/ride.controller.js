import { Ride } from "../models/ride.model.js";
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
    io: req.app.get("io"),
  });

  return res.status(200).json(
    new ApiResponse(200, ride, "Ride created successfully")
  );
});

export const acceptRideController = AsyncHandler(async (req, res) => {
  const { rideId, driverId } = req.body;

  const ride = await Ride.findOneAndUpdate(
    { _id: rideId, status: "SEARCHING" },
    { status: "ACCEPTED", driverId },
    { new: true }
  );

  if (!ride) {
    throw new ApiError(400, "Ride already accepted or not found");
  }

  return res.status(200).json(
    new ApiResponse(200, ride, "Ride accepted successfully")
  );
});