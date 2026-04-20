import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { vehicleService, getDriverVehicleService } from "../services/vehicle.service.js";

const vehicleController = AsyncHandler(async (req,res)=>{
    console.log("BODY:", req.body);
console.log("FILES:", req.files);
  const {
    vehicleType,
    brand,
    registrationNumber,
    color,
    numberPlateNumber,
    model,
    modelManufacturingYear,
    modelExpiryDate,
    seatCapacity
  } = req.body;

  const images = await req.files?.images;

  const vehicle = await vehicleService({
     userId:req.user._id,
      vehicleType,
        brand,
        registrationNumber,
        color,
        numberPlateNumber,
        model,
        modelManufacturingYear,
        modelExpiryDate,
        seatCapacity,
        images,
  });

  return res.status(200).json(
    new ApiResponse(200,vehicle,"Vehicle detailes submitted successfully!")
  );
});

// GET DRIVER VEHICLE CONTROLLER---------------------------------

const getDriverVehiclesController = AsyncHandler(async (req, res) => {

  // get params from req.params 
  const userId  = req.user._id;

  // call service function and pass params
  const driver = await getDriverVehicleService({ userId });

  // return response 
  return res.status(200).json(
    new ApiResponse(200, driver, "Driver vehicle fetch successfully!")
  );
});

export { 
  vehicleController,
  getDriverVehiclesController
}