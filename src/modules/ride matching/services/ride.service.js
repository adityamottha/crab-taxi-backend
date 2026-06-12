import { Ride } from "../models/ride.model.js";
import { FareCalculator } from "../../../utils/fare.calculation.js";
import { ApiError } from "../../../utils/ApiError.js";

const createRideService = async ({
  passengerId,
  pickup,
  dropoff
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

  const otp =
    FareCalculator.generateOTP();

  const ride = await Ride.create({
    passengerId,

    pickup,

    dropoff,

    fare: {
      amount: fareDetails.amount,
      distance: fareDetails.distance,
      duration: fareDetails.duration
    },

    otp,

    status: "requested"
  });

  return ride;
};

export {
  createRideService
};