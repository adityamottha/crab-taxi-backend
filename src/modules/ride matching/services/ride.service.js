import { Ride } from "../models/ride.model.js";
import { FareCalculator } from "../../../utils/fare.calculation.js";
import { ApiError } from "../../../utils/ApiError.js";
import { getNearbyDriversService } from "../../rider/services/riderDashboard.service.js";
import { onlineDrivers } from "../../../utils/onlineDrivers.js";
import { DriverProfile } from "../../driver/models/driverProfile.model.js";

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

// ACCEPT RIDE SERVICE

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

// REJECT RIDE SERVICE ...........
const rejectRideService = async ({
    rideId,
    driverId
}) => {

    const ride =
        await Ride.findByIdAndUpdate(
            rideId,
            {
                $addToSet: {
                    rejectedDrivers: driverId
                }
            },
            {
                new: true
            }
        );

    if (!ride) {
        throw new ApiError(
            404,
            "Ride not found"
        );
    }

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

const completeRideService = async ({ rideId,driverId} ) => {

  console.log("Ride ID:", rideId);
  console.log("Driver ID:", driverId);

  // Check rideId is avaialable
  if(!rideId){
    throw new ApiError(
      400,
      "rideId is required!"
    )
  }

    // Check driverId is avaialable
  if(!driverId){
    throw new ApiError(
      400,
      "driverId is required!"
    )
  }

  // find ride by Ride schema fields will be => (rideId, driverId, status->"started")
  const ride = await Ride.findOne({
    _id: rideId,
    driverId,
    status: "started"
  });

  // check ride available
  if (!ride) {
    throw new ApiError(
      400,
      "Ride not started"
    );
  }

  // marks status to completed and date to current date
  ride.status = "completed";
  ride.completedAt = new Date();

  // save the ride
  await ride.save();

  // Increase drivers total trips
  await DriverProfile.findOneAndUpdate(
    {
      authUserId: ride.driverId
    },
    {
      $inc: {
        totalTrips: 1
      }
    },
    {
      returnDocument: "after"
    }
  );

  console.log("Ride Completed Successfully");
  console.log("Completed At:", ride.completedAt);
  console.log("Status:", ride.status);

  // return ride
  return ride;
};


// ============================ CANCEL RIDE ===============

import { Ride } from "../models/ride.model.js";
import { DriverProfile } from "../../driver/models/driverProfile.model.js";
import { ApiError } from "../../../utils/ApiError.js";

const cancelRideService = async ({
  rideId,
  driverId,
  cancellationReason
}) => {

  if (!rideId) {
    throw new ApiError(
      400,
      "RideId is required"
    );
  }

  if (!driverId) {
    throw new ApiError(
      400,
      "DriverId is required"
    );
  }

  if (!cancellationReason || !cancellationReason.trim()) {
    throw new ApiError(
      400,
      "Cancellation reason is required"
    );
  }

  // Find ride
  const ride = await Ride.findOne({
    _id: rideId,
    driverId,
    $or: [
      { status: "accepted" },
      { status: "started" }
    ]
  });

  if (!ride) {
    throw new ApiError(
      404,
      "Ride not found or cannot be cancelled"
    );
  }

  // Update ride
  ride.status = "cancelled";
  ride.cancellationReason = cancellationReason;
  ride.cancelledAt = new Date();

  await ride.save();

  // Driver becomes online again
  await DriverProfile.findOneAndUpdate(
    {
      authUserId: driverId
    },
    {
      driverStatus: "ONLINE"
    },
    {
      returnDocument: "after"
    }
  );

  return ride;
};


export {
  createRideService,
  acceptRideService,
  rejectRideService,
  startRideService,
  completeRideService,
  canceleRideService
};