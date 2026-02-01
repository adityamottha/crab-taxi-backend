// import { ApiError } from "../../../utils/ApiError.js";
// import { mongoose } from "mongoose"
import { DriverProfile } from "../../driver/models/driverProfile.model.js"



const getAllDriversService = async () => {
  return DriverProfile.aggregate([
    // Join Driver Documents
    {
      $lookup: {
        from: "driverdocuments",
        let: { driverId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$driverProfileId", "$$driverId"]
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
        let: { driverId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$driverProfileId", "$$driverId"]
              }
            }
          }
        ],
        as: "vehicle"
      }
    },

    // Convert arrays → object
    {
      $addFields: {
        documents: { $arrayElemAt: ["$documents", 0] },
        vehicle: { $arrayElemAt: ["$vehicle", 0] }
      }
    },

    // Optional: sort latest drivers first
    {
      $sort: { createdAt: -1 }
    }
  ]);
};


export { getAllDriversService }