import { DriverProfile } from "../../driver/models/driverProfile.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { AuthUser } from "../../auth/authUsers.models.js";
import { mongoose } from "mongoose";

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

// get driver profile 
const getDriverProfileForUserService = async (driverId) => {
// console.log("driverId:", driverId);

  const driverProfile = await AuthUser.aggregate([

    {
      $match: {
        _id: new mongoose.Types.ObjectId(driverId)
      }
    },

    {
      $lookup: {
        from: "driverprofiles",
        localField: "_id",
        foreignField: "authUserId",
        as: "driverProfile"
      }
    },

    {
      $unwind: {
        path: "$driverProfile",
        preserveNullAndEmptyArrays: true
      }
    },

    {
      $project: {
        password: 0,
        __v: 0
      }
    }

  ]);

  // console.log("result:", driverProfile);

  return driverProfile[0] || null;
};

export {
  getNearbyDriversService,
  getDriverProfileForUserService
};