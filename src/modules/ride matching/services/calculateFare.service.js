import { FareCalculator } from "../../../utils/fare.calculation.js";
import { ApiError } from "../../../utils/ApiError.js";

const calculateFareService = async ({ pickup, dropoff , vehicleCategory}) => {

  if (!pickup || !dropoff) {
    throw new ApiError(400, "Pickup and dropoff locations required");
  }

  if(!vehicleCategory){
    throw new ApiError(400,"VehicleCategory is required!")
  }

  const fareDetails = FareCalculator.calculateFare(
    pickup,
    dropoff,
    vehicleCategory
  );

  return {
    fare: fareDetails.amount,
    distance: fareDetails.distance,
    duration: fareDetails.duration,
    currency: "INR",
    vehicleCategory: fareDetails.vehicleCategory
  };
};

export {
  calculateFareService
};