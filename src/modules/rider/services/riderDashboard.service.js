import { DriverProfile } from "../../driver/models/driverProfile.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { AuthUser } from "../../auth/authUsers.models.js";
import { mongoose } from "mongoose";
import { Vehicle } from "../../driver/models/Vehicle.model.js";


const getNearbyDriversService = async ({
  lng,
  lat,
  vehicleCategory,
}) => {

  // validate the data
  if (lng === undefined || lat === undefined) {
    throw new ApiError(
      400,
      "lat and lng are required"
    );
  }

  if (!vehicleCategory) {
    throw new ApiError(
      400,
      "vehicleCategory is required"
    );
  }

// find nearby online drivers 
  const drivers = await DriverProfile.find({
    driverStatus: "ONLINE",

    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [
            Number(lng),
            Number(lat)
          ]
        },

        // 5 KM
        $maxDistance: 5000
      }
    }

  }).lean();


  // get driver profiles id 
  const driverProfileIds = drivers.map(
    driver => driver._id
  );



  // find matching vehicle category 
  const vehicles = await Vehicle.find({
    driverProfileId: {
      $in: driverProfileIds
    },

    vehicleCategory: vehicleCategory,

    vehicleApproved: "APPROVED",

    // isActive: true,

  }).lean();


   
  // get drivers who has matching vehicle 

  const matchingDriverIds = new Set(
    vehicles.map(
      vehicle =>
        vehicle.driverProfileId.toString()
    )
  );


  

//  filter drivers 
  const matchingDrivers = drivers.filter(
    driver =>
      matchingDriverIds.has(
        driver._id.toString()
      )
  );


  // return 
  return matchingDrivers;
};


// GET DRIVERS PROFILE ==============================================
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