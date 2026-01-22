import { ApiError } from "../../../utils/ApiError.js";
import { uploadMultipleFilesWithUrl } from "../../../utils/uploadMultipleFiles.js";
import { Vehicle } from "../models/Vehicle.model.js";
import { DriverProfile } from "../models/driverProfile.model.js";

const vehicleService = async ({
    userId,
    vehicleType,
    brand,
    registrationNumber,
    color,
    numberPlateNumber,
    model,
    modelManufacturingYear,
    modelExpiryDate,
    seatCapacity,
    images
})=>{

    // check fields are not empty 
    if([vehicleType,brand,registrationNumber,color,numberPlateNumber,model].some(fields=>!fields?.trim())){
        throw new ApiError(404,"All fields are required!");
    };

    // check fields of none string
    if(!modelManufacturingYear || !modelExpiryDate || !seatCapacity || !images){
        throw new ApiError(404,"Please fill the all fields!");
    }

    // check driver profile is available 
    const driverProfile = await DriverProfile.findOne({authUserId:userId});
    if(!driverProfile) throw new ApiError(400,"First complete driver profile!");

    // not available before 
    const existedVehicle = await Vehicle.findOne({driverProfileId:driverProfile._id});
    if(existedVehicle) throw new ApiError(403,"You already have a vehicle!");

    // upload images 
    const uploadedImages = await uploadMultipleFilesWithUrl(images);

    // insert data in db
    const vehicle = await Vehicle.create({
        driverProfileId: driverProfile._id,

        vehicleType,
        brand,
        registrationNumber,
        color,
        numberPlateNumber,
        model,
        modelManufacturingYear,
        modelExpiryDate,
        seatCapacity,
        images:uploadedImages

    });

    // return 
    return vehicle;
}

export { vehicleService }