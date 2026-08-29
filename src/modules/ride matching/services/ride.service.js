import { Ride } from "../models/ride.model.js";
import { FareCalculator } from "../../../utils/fare.calculation.js";
import { ApiError } from "../../../utils/ApiError.js";
import { getNearbyDriversService } from "../../rider/services/riderDashboard.service.js";
import { onlineDrivers } from "../../../utils/onlineDrivers.js";
import { DriverProfile } from "../../driver/models/driverProfile.model.js";
import { AuthUser } from "../../auth/authUsers.models.js";
import mongoose from "mongoose";
import { updateDriverDailyEarningService } from "../../driver/services/driverEarnings.service.js";

// CREATE RIDE SERVICE ========================================================
const createRideService = async ({
  passengerId,
  pickup,
  dropoff,
  vehicleCategory,
}) => {


  // validate the data 
  if (!pickup || !dropoff) {
    throw new ApiError(
      400,
      "Pickup and dropoff are required"
    );
  }

  if (
    !mongoose.Types.ObjectId.isValid(passengerId)
  ) {
    throw new ApiError(
      400,
      "Valid passengerId is required!"
    );
  }

  if (!vehicleCategory) {
    throw new ApiError(
      400,
      "Vehicle category is required!"
    );
  }



  // fare calculate according to vehicle type 
  const fareDetails =
    FareCalculator.calculateFare(
      pickup,
      dropoff,
      vehicleCategory
    );

//  create ride 
  const ride = await Ride.create({

    passengerId,

    pickup,

    dropoff,

    vehicleCategory,

    fare: {
      amount: fareDetails.amount,
      currency: "INR",
      distance: fareDetails.distance,
      duration: fareDetails.duration,
    },

    status: "requested",

  });


  console.log("Ride ID:", ride._id);
  console.log("Passenger ID:", passengerId);
  console.log("Vehicle Category:", vehicleCategory);
  console.log("Status:", ride.status);


  // find nearby drivers 
  const nearbyDrivers =
    await getNearbyDriversService({
      lat: pickup.lat,
      lng: pickup.lng,
      vehicleCategory
    });


  console.log(
    "Nearby Drivers Found:",
    nearbyDrivers.length
  );


  // send ride to matching drivers 
  for (const driver of nearbyDrivers) {

    const driverId =
      driver.authUserId.toString();


    // Get driver's socket
    const socketId =
      onlineDrivers.get(driverId);


    if (!socketId) {

      console.log(
        "NO SOCKET FOUND FOR DRIVER:",
        driverId
      );

      continue;
    }


// send ride 
    global.io
      .to(socketId)
      .emit(
        "new-ride",
        {
          rideId: ride._id,

          pickup: ride.pickup,

          dropoff: ride.dropoff,

          fare: ride.fare,

          vehicleCategory:
            ride.vehicleCategory,

          status: ride.status,
        }
      );


    console.log(
      "NEW RIDE EMITTED TO DRIVER:",
      driverId
    );

  }

  // return 
  return {
    ride,
    nearbyDrivers,
  };

};


// ACCEPT RIDE SERVICE =================================

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

  // RIDE STARTED AT 
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

// =====================COMPLETE RIDE SERVICE ====================================9

const completeRideService = async ({ rideId, driverId }) => {
  console.log("Ride ID:", rideId);
  console.log("Driver ID:", driverId);

  // check ride id existed

  if (!rideId) {
    throw new ApiError(
      400,
      "rideId is required!"
    );
  }

  // check driver id existed

  if (!driverId) {
    throw new ApiError(
      400,
      "driverId is required!"
    );
  }

  //  find ride if started

  const ride = await Ride.findOne({
    _id: rideId,
    driverId,
    status: "started",
  });

  // check ride existed

  if (!ride) {
    throw new ApiError(
      400,
      "Ride not started"
    );
  }

  //mark complete ride
  ride.status = "completed";
  ride.completedAt = new Date();

  await ride.save();

  //update driver trips

  await DriverProfile.findOneAndUpdate(
    {
      authUserId: ride.driverId,
    },
    {
      $inc: {
        totalTrips: 1,
      },
    },
    {
      returnDocument: "after",
    }
  );

  // Update driver earnings

  await updateDriverDailyEarningService({
    driverId: ride.driverId,
    amount: ride.fare.amount,
    currency: ride.fare.currency,
    completedAt: ride.completedAt,
  });

  console.log("Ride Completed Successfully");
  console.log("Completed At:", ride.completedAt);
  console.log("Status:", ride.status);

  return ride;
};


// ============================ CANCEL RIDE ===============

const cancelRideService = async ({
  rideId,
  userId,
  userRole, // "driver" or "passenger"
  cancellationReason
}) => {

  if (!rideId) {
    throw new ApiError(400, "RideId is required");
  }

  if (!userId) {
    throw new ApiError(400, "UserId is required");
  }

  if (!userRole || !["driver", "passenger"].includes(userRole)) {
    throw new ApiError(400, "Valid user role is required (driver or passenger)");
  }

  if (!cancellationReason || !cancellationReason.trim()) {
    throw new ApiError(400, "Cancellation reason is required");
  }

  // Verify user exists and has the correct role
  const user = await AuthUser.findOne({
    _id: userId,
    isDeleted: false,
    accountStatus: "ACTIVE"
  });

  if (!user) {
    throw new ApiError(404, "User not found or inactive");
  }

  // Validate user role matches the requested role
  const expectedRole = userRole === "driver" ? "DRIVER" : "USER";
  if (user.role !== expectedRole) {
    throw new ApiError(403, `User is not a ${userRole}`);
  }

  // Build query based on user role
  let query = { _id: rideId };
  
  if (userRole === "driver") {
    query.driverId = userId;
    // Driver can only cancel if ride is accepted or started
    query.status = { $in: ["accepted", "started"] };
  } else if (userRole === "passenger") {
    query.passengerId = userId;
    // Passenger can cancel in multiple statuses
    query.status = { $in: ["requested", "accepted", "started"] };
  }

  // Find ride
  const ride = await Ride.findOne(query);

  if (!ride) {
    throw new ApiError(404, "Ride not found or cannot be cancelled");
  }

  // Check if ride is already completed or cancelled
  if (["completed", "cancelled"].includes(ride.status)) {
    throw new ApiError(400, "Ride is already completed or cancelled");
  }

  // Update ride
  ride.status = "cancelled";
  ride.cancellationReason = cancellationReason;
  ride.cancelledAt = new Date();

  await ride.save();

  // If driver cancels, make them online again
  if (userRole === "driver") {
    await DriverProfile.findOneAndUpdate(
      { authUserId: userId },
      { driverStatus: "ONLINE" },
      { returnDocument: "after" }
    );
  }

  // Populate the ride with user details
  const populatedRide = await Ride.findById(ride._id)
    .populate('passengerId', 'phoneNumber email role userProfileId')
    .populate('driverId', 'phoneNumber email role driverProfileId');

  return {
    ride: populatedRide,
    cancelledBy: userRole,
    cancelledByUser: {
      id: user._id,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role
    }
  };
};
export {
  createRideService,
  acceptRideService,
  rejectRideService,
  startRideService,
  completeRideService,
  cancelRideService
};



// ==================== USER / PASSENGER RIDE HISTORY ====================

export const getUserRideHistoryService = async ({
  userId,
  page = 1,
  limit = 10,
  status,
}) => {

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "User ID is required");
  }

  const skip = (page - 1) * limit;

  const filter = {
    passengerId: userId,
  };

  // Optional status filter
  if (status) {
    filter.status = status;
  }

  const [rides, totalRides] = await Promise.all([
    Ride.find(filter)
      .populate("driverId", "fullname phoneNumber")
      .populate("passengerId", "fullname phoneNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Ride.countDocuments(filter),
  ]);

  return {
    rides,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRides / limit),
      totalRides,
      limit,
    },
  };
};


// ==================== DRIVER RIDE HISTORY ====================

export const getDriverRideHistoryService = async ({
  driverId,
  page = 1,
  limit = 10,
  status,
}) => {

  if (!mongoose.isValidObjectId(driverId)) {
    throw new ApiError(400, "Driver ID is required");
  }

  const skip = (page - 1) * limit;

  const filter = {
    driverId,
  };

  // Optional status filter
  if (status) {
    filter.status = status;
  }

  const [rides, totalRides] = await Promise.all([
    Ride.find(filter)
      .populate("driverId", "fullname phoneNumber")
      .populate("passengerId", "fullname phoneNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Ride.countDocuments(filter),
  ]);

  return {
    rides,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalRides / limit),
      totalRides,
      limit,
    },
  };
};
