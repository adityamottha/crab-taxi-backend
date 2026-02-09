import { DriverProfile } from "../../driver/models/driverProfile.model.js";



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

// UPDATE TO APPROVED DRIVER STATUS....
const approvedDriverStatusService = async ({userId}) =>{
// get userId from req.body
// find use by id
// approved status
// update Date
// return 

}

export { 
  getAllDriversService,
  notApprovedDriverService,
  approvedDriverStatusService
 }