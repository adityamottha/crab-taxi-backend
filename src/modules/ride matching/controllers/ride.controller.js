import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import {
  createRideService,
  acceptRideService,
} from "../services/ride.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

const createRideController =
  AsyncHandler(async (req, res) => {
    const { pickup, dropoff } =
      req.body;

    const ride =
      await createRideService({
        passengerId: req.user._id,
        pickup,
        dropoff,
      });

    return res.status(201).json(
      new ApiResponse(
        201,
        ride,
        "Ride created successfully"
      )
    );
  });

const acceptRideController =
  AsyncHandler(async (req, res) => {
    const { rideId } = req.body;

    const ride =
      await acceptRideService({
        rideId,
        driverId: req.user._id,
      });

    return res.status(200).json(
      new ApiResponse(
        200,
        ride,
        "Ride accepted successfully"
      )
    );
  });

export {
  createRideController,
  acceptRideController,
};