import { ApiError } from "../../../utils/ApiError.js";
import { DriverProfile } from "../../driver/models/driverProfile.model.js";
import { AuthUser } from "../../auth/authUsers.models.js";

// GET ALL DRIVERS-------------------------------------------------
const getAllDriversService = async () => {
  
 const allDrivers = await AuthUser.aggregate([

  // Only get users with role DRIVER
  {
    $match: {
      role: "DRIVER"
    }
  },

  // Join DriverProfile
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

  // Join Driver Documents
  {
    $lookup: {
      from: "driverdocuments",
      let: { driverProfileId: "$driverProfile._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$driverProfileId", "$$driverProfileId"]
            }
          }
        }
      ],
      as: "documents"
    }
  },

  // Join Vehicle
  {
    $lookup: {
      from: "vehicles",
      let: { driverProfileId: "$driverProfile._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$driverProfileId", "$$driverProfileId"]
            }
          }
        }
      ],
      as: "vehicle"
    }
  },

  {
    $addFields: {
      documents: { $arrayElemAt: ["$documents", 0] },
      vehicle: { $arrayElemAt: ["$vehicle", 0] }
    }
  },

  {
    $project: {
      password: 0,
      __v: 0
    }
  },

  {
    $sort: { createdAt: -1 }
  }

]);
// return 
return allDrivers;
};



// GET SINGLE DRIVER -----------------
const getSingleDriverService = async ({userId}) =>{

  // check userId is not empty 
  if(!userId.trim()) throw new ApiError(400,"userId is required!");
  
  // find driver by userId 
  const driver = await DriverProfile.findById({_id: userId})
  if(!driver) throw new ApiError(409,"Driver is not availbale from this UserId!");

  // return driver 
  return driver
}

// GET ALL DRIVERS WHO'RE NOT APPROVED!--------------------------------

const notApprovedDriverService = async ()=>{
const notApprovedDriver = await DriverProfile.aggregate([

  {
    $match: {
      profileApprovalStatus: "PENDING"
    }
  },

  // Join documents (NO filter)
  {
    $lookup: {
      from: "driverdocuments",
      localField: "_id",
      foreignField: "driverProfileId",
      as: "documents"
    }
  },

  // Join vehicle (NO filter)
  {
    $lookup: {
      from: "vehicles",
      localField: "_id",
      foreignField: "driverProfileId",
      as: "vehicle"
    }
  },

  {
    $addFields: {
      documents: { $arrayElemAt: ["$documents", 0] },
      vehicle: { $arrayElemAt: ["$vehicle", 0] }
    }
  },

  // 🔥 NOW filter (safe)
  {
    $match: {
      $or: [
        { "documents.documentsApprovalStatus": "PENDING" },
        { "vehicle.vehicleApproved": "PENDING" }
      ]
    }
  },

  {
    $sort: { createdAt: -1 }
  }

]);
return notApprovedDriver
};


// GET ALL USERS -----------------------------------
const getAllUsersService = async () =>{

const allUsers = await AuthUser.aggregate([

  //Only USER role
  {
    $match: {
      role: "USER"
    }
  },

  // Join RiderProfile
  {
    $lookup: {
      from: "riderprofiles",
      localField: "_id",
      foreignField: "authUserId",
      as: "riderProfile"
    }
  },

  // convert array to object
  {
    $unwind: {
      path: "$riderProfile",
      preserveNullAndEmptyArrays: true
    }
  },

  //  clean response
  {
    $project: {
      password: 0,
      __v: 0
    }
  },

  // Sort
  {
    $sort: { createdAt: -1 }
  }

]);

// Return 
return allUsers;

}
export { 
  getAllDriversService,
  notApprovedDriverService,
  getSingleDriverService,
  getAllUsersService
 }