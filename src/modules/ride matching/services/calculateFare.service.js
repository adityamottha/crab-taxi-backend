import { FareCalculator } from "../../../utils/fare.calculation.js";
import { ApiError } from "../../../utils/ApiError.js";

const calculateFareService = async ({ pickup, dropoff }) => {

  if (!pickup || !dropoff) {
    throw new ApiError(400, "Pickup and dropoff locations required");
  }

  const fareDetails = FareCalculator.calculateFare(
    pickup,
    dropoff
  );

  return {
    fare: fareDetails.amount,
    distance: fareDetails.distance,
    duration: fareDetails.duration,
    currency: "INR"
  };
};

export {
  calculateFareService
};