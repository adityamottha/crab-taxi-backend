import { Ride } from "../../ride matching/models/ride.model.js";
import { AuthUser } from "../../auth/authUsers.models.js";
import { FareCalculator } from "../../../utils/fare.calculation.js";
import { ApiError } from "../../../utils/ApiError.js";
import { getNearbyDriversService } from "../../rider/services/riderDashboard.service.js";
import { onlineDrivers } from "../../../utils/onlineDrivers.js";

export const createRideByAdminService = async ({
  passengerId,
  pickup,
  dropoff,
}) => {

  if (!passengerId) {
    throw new ApiError(
      400,
      "Passenger ID is required"
    );
  }

  if (!pickup || !dropoff) {
    throw new ApiError(
      400,
      "Pickup and dropoff are required"
    );
  }

  // Optional but recommended:
  // Check that passenger actually exists
  const passenger = await AuthUser.findById(passengerId);

  if (!passenger) {
    throw new ApiError(
      404,
      "Passenger not found"
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

  console.log("Ride ID:", ride._id);
  console.log("Passenger ID:", passengerId);
  console.log("Status:", ride.status);

  const nearbyDrivers =
    await getNearbyDriversService({
      lat: pickup.lat,
      lng: pickup.lng,
    });

  console.log(
    "Nearby Drivers Found:",
    nearbyDrivers.length
  );

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