import { DriverProfile } from "../../driver/models/driverProfile.model.js";
import { ApiError } from "../../../utils/ApiError.js";

const getNearbyDriversService = async ({ lng, lat }) => {

  // validation
  if (!lng || !lat) {
    throw new ApiError(400, "lat and lng are required");
  }

  // find nearby ONLINE drivers
  const drivers = await DriverProfile.find({

    driverStatus: "ONLINE",

    location: {
      $near: {
        $geometry: {
          type: "Point",

          // MongoDB format
          coordinates: [Number(lng), Number(lat)]
        },

        // 5km radius
        $maxDistance: 5000
      }
    }

  });

  return drivers;
};

export {
  getNearbyDriversService
};