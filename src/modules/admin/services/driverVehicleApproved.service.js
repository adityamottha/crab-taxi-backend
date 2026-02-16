import { ApiError } from "../../../utils/ApiError.js";
import { Vehicle } from "../../driver/models/vehicle.model.js";
 
const driverVehicleApprovedService = async ({userId})=>{
    // check userId is not empty
    if(!userId) throw new ApiError(404,"userId is required!");

    // find user by userId
    const vehicle = await Vehicle.findOne({driverProfileId:userId});
    if(!vehicle) throw new ApiError(409,"Driver don't have vehicle yet!");

    // check if status already approved if not next
    if(vehicle.vehicleApproved === "APPROVED"){
        throw new ApiError(400, "Vehicle already approved by admin!");
    };

    // approved status
    vehicle.vehicleApproved = "APPROVED";

    // update time of approval
    vehicle.vehicleApprovedAt = new Date();

    // save changes
    await vehicle.save();

    // return
    return vehicle
};


// DRIVER VEHICLE REJECTED----------------------
const driverVehicleRejectService = async ({userId, reason})=>{
    // check userId is not empty
    if(!userId) throw new ApiError(404,"UserId is required");

    // check reason is not empty
    if(!reason) throw new ApiError(404,"reason for rejection is required!");

    // find vehicle by userId
    const vehicle = await Vehicle.findOne({driverProfileId:userId});

    // check user has vehicle details
    if(!vehicle) throw new ApiError(400,"Driver don't have any vehicle!");

    // check if vehicle already rejected
    if(vehicle.vehicleApproved === "REJECTED"){
        throw new ApiError(409,"Vehicle already rejected by admin!");
    };

    // reject vehicle status
    vehicle.vehicleApproved = "REJECTED";

    // update rejection reason
    vehicle.vehicleRejectedReason = reason;

    //save changes
    await vehicle.save();

    // return
    return vehicle;
}

export { 
    driverVehicleApprovedService,
    driverVehicleRejectService
}