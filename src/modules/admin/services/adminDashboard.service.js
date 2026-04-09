import { DriverProfile } from "../../driver/models/driverProfile.model.js";
import { ApiError } from "../../../utils/ApiError.js";


const getAllDriversService = async () => {

  const allDrivers = await DriverProfile.aggregate([
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
      $lookup:{
        from:"driverdocuments",
        let:{driverId:"$_id"},
        pipeline:[
          {
            $match:{
              status:"PENDING",
              $expr:{
                $eq:["$driverProfileId" , "$$driverId"]
              }
            }
          }
        ],
        as:"documents"
      }
    },
    {
      $lookup:{
        from: "vehicles",
        let:{driverId:"$_id"},
        pipeline:[
          {
            $match:{
              $expr:{
                $eq:["$driverProfileId","$$driverId"]
              }
            }
          }
        ],
        as:"vehicle"
      }
    },
    {
      $addFields:{
        documents:{  $ifNull: [{ $arrayElemAt: ["$documents", 0] }, null] },
        vehicle:{  $ifNull: [{$arrayElemAt: ["$vehicle", 0]}, null] }
      }
    },

    {
      $sort: { createdAt: -1 }
    }

  ])
  return notApprovedDriver;
};

export { 
  getAllDriversService,
  notApprovedDriverService,
  getSingleDriverService
 }