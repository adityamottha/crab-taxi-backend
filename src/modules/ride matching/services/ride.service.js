import { Ride } from "../models/ride.model.js";
import { matchDriversService } from "./rideMatching.service.js";
import { ApiError } from "../../../utils/ApiError.js";

const PRICE_PER_KM = 9;

export const createRideService = async ({ user, pickup, drop, distance, io }) => {
  if (!pickup || !drop || !distance) {
    throw new ApiError(400, "Pickup, drop & distance required");
  }

  const price = distance * PRICE_PER_KM;

  const ride = await Ride.create({
    userId: user._id,
    pickup,
    drop,
    distance,
    price,
  });

  await matchDriversService(ride, io);

  return ride;
};
