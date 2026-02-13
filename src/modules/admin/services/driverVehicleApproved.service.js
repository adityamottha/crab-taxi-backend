import { ApiError } from "../../../utils/ApiError.js";
import { Vehicle } from "../../driver/models/vehicle.model.js";
 
const driverVehicleApprovedService = async ({userId})=>{
    // check userId is not empty
    if(!userId) throw new ApiError(404,"userId is required!");

    // find user by userId
    const vehicle = await Vehicle.findOne({driverProfileId:userId});
    if(!vehicle) throw new ApiError(409,"Driver don't have vehicle yet!");

    // check if status already approved if not next
    if(vehicle.vehicleApproved = "APPROVED"){
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


const driverVehicleRejectService = async ({userId, reason})=>{
    // check userId is not empty
    // check reason is not empty
    // find vehicle by userId
    // check user has vehicle details
    // check if vehicle already rejected
    // reject vehicle status
    // update rejection reason
    //save changes
    // return
}

export { 
    driverVehicleApprovedService,
    driverVehicleRejectService
}