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

<<<<<<< HEAD

// ================================= ACCEPT RIDE SERVICE ========================
=======
// ACCEPT RIDE SERVICE

>>>>>>> 9f32cab15e32abec2b2c3fb8bd48d7e818976cd0
const acceptRideService = async ({
  rideId,
  driverId,
}) => {

  console.log("Ride ID:", rideId);
  console.log("Driver ID:", driverId);

  if (!rideId) {
    throw new ApiError(
      400,
      "Ride ID is required"
    );
  }
<<<<<<< HEAD
  const otp = FareCalculator.generateOTP();
=======

  const otp =
    FareCalculator.generateOTP();
>>>>>>> 9f32cab15e32abec2b2c3fb8bd48d7e818976cd0

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
<<<<<<< HEAD

  const existingRide = await Ride.findById(rideId);
  console.log("Existing Ride:", existingRide);

  // find ride and update requested to accept 
   const ride = await Ride.findOneAndUpdate(
    {
      _id: rideId,
      status: "requested"
    },
    {
      driverId,
      status: "accepted"
    },
    {
      new: true
    }
  );
=======
>>>>>>> 9f32cab15e32abec2b2c3fb8bd48d7e818976cd0

  if (!ride) {
    throw new ApiError(
      400,
      "Ride already accepted or not found"
    );
  }

  console.log(
    "Ride Accepted Successfully"
  );

  console.log(
    "Generated OTP:",
    ride.otp
  );

  console.log(
    "Status:",
    ride.status
  );

  return ride;
};

// START RIDE SERVICE ...........

const startRideService = async ({
  rideId,
  otp
}) => {

  console.log("Ride ID:", rideId);
  console.log("OTP:", otp);

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

  console.log(
    "Ride Started Successfully"
  );

  console.log(
    "Status:",
    ride.status
  );

  console.log(
    "Started At:",
    ride.startedAt
  );

  return ride;
};

// COMPLETE RIDE SERVICE ...........

const completeRideService = async ({
  rideId,
  driverId
}) => {

  console.log("Ride ID:", rideId);
  console.log("Driver ID:", driverId);

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

  console.log(
    "Ride Completed Successfully"
  );

  console.log(
    "Completed At:",
    ride.completedAt
  );

  console.log(
    "Status:",
    ride.status
  );

  return ride;
};

export {
  createRideService,
  acceptRideService,
  startRideService,
  completeRideService
};