import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { vehicleService } from "../services/vehicle.service.js";

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

export { vehicleController }