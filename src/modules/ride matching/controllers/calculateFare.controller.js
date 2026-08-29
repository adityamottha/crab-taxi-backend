import { AsyncHandler } from "../../../utils/AsyncHandler.js"
import { ApiResponse } from "../../../utils/ApiResponse.js"
import { calculateFareService } from "../services/calculateFare.service.js";

const calculateFareController = AsyncHandler(async (req,res)=>{
    const { pickup, dropoff , vehicleCategory} = req.body;

    const fareDetails = await calculateFareService({
      pickup,
      dropoff,
      vehicleCategory
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        fareDetails,
        "fare calculated successfully"
      )
    );
});

export {
  calculateFareController
}