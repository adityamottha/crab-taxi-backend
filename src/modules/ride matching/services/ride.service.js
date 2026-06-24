import { Ride } from "../models/ride.model.js";
import { FareCalculator } from "../../../utils/fare.calculation.js";
import { ApiError } from "../../../utils/ApiError.js";
import { getNearbyDriversService } from "../../rider/services/riderDashboard.service.js";
import { onlineDrivers } from "../../../utils/onlineDrivers.js";

const createRideService = async ({
  passengerId,
  pickup,
  dropoff,
}) => {

  if (!pickup || !dropoff) {
    throw new ApiError(
      400,
      "Pickup and dropoff are required"
    );
  }

  const fareDetails =
    FareCalculator.calculateFare(
      pickup,
      dropoff
    );

  const ride = await Ride.create({
    passengerId,
    pickup,
    dropoff,
    fare: {
      amount: fareDetails.amount,
      distance: fareDetails.distance,
      duration: fareDetails.duration,
    },
    status: "requested",
  });

  const nearbyDrivers =
    await getNearbyDriversService({
      lat: pickup.lat,
      lng: pickup.lng,
    });

  for (const driver of nearbyDrivers) {

    const driverId =
      driver.authUserId.toString();

    const socketId =
      onlineDrivers.get(driverId);

    if (!socketId) {

      console.log(
        "NO SOCKET FOUND FOR DRIVER"
      );

      continue;
    }

    global.io
      .to(socketId)
      .emit(
        "new-ride",
        {
          rideId: ride._id,
          pickup: ride.pickup,
          dropoff: ride.dropoff,
          fare: ride.fare,
        }
      );

    console.log(
      "NEW RIDE EMITTED"
    );
  }

  return {
    ride,
    nearbyDrivers,
  };
};

// ACCEPT RIDE SERVICE

const acceptRideService = async ({
  rideId,
  driverId,
}) => {
  if (!rideId) {
    throw new ApiError(
      400,
      "Ride ID is required"
    );
  }

  const otp =
    FareCalculator.generateOTP();

  const ride =
    await Ride.findOneAndUpdate(
      {
        _id: rideId,
        status: "requested",
      },
      {
        driverId,
        status: "accepted",
        otp,
      },
      {
        new: true,
      }
    );

  if (!ride) {
    throw new ApiError(
      400,
      "Ride already accepted or not found"
    );
  }

  return ride;
};

const startRideService = async ({
  rideId,
  otp
}) => {

  const ride =
    await Ride.findOne({
      _id: rideId,
      status: "accepted"
    });

  if (!ride) {
    throw new ApiError(
      400,
      "Ride not accepted"
    );
  }

  if (ride.otp !== otp) {
    throw new ApiError(
      400,
      "Invalid OTP"
    );
  }

  ride.status = "started";
  ride.startedAt = new Date();

  await ride.save();

  return ride;
};

const completeRideService = async ({
  rideId,
  driverId
}) => {

  const ride =
    await Ride.findOne({
      _id: rideId,
      driverId,
      status: "started"
    });

  if (!ride) {
    throw new ApiError(
      400,
      "Ride not started"
    );
  }

  ride.status =
    "completed";

  ride.completedAt =
    new Date();

  await ride.save();

  return ride;
};

export {
  createRideService,
  acceptRideService,
  startRideService,
  completeRideService
};