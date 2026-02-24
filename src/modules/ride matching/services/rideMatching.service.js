import { AuthUser } from "../../auth/authUsers.models.js";
import { Ride } from "../models/ride.model.js";
import { getDistanceInKm } from "../../../utils/distance.helper.js";

export const matchDriversService = async (ride, io) => {
  const drivers = await AuthUser.find({
    role: "DRIVER",
    isOnline: true,
  });

  const nearbyDrivers = drivers.filter((driver) => {
    if (!driver.location) return false;

    const distance = getDistanceInKm(
      ride.pickup.lat,
      ride.pickup.lng,
      driver.location.lat,
      driver.location.lng
    );

    return distance <= 5;
  });

  if (!nearbyDrivers.length) {
    console.log("No drivers within 5km");
    return;
  }

  nearbyDrivers.forEach((driver) => {
    io.to(driver._id.toString()).emit("rideRequest", ride);
  });
};