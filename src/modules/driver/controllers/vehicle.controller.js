import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { vehicleService } from "../services/vehicle.service.js";

const vehicleController = AsyncHandler(async (req,res)=>{
    await vehicleService();
    res.status(200).json(
        new ApiResponse(200,{},"Vehicle Api working well!")
    )
});

export { vehicleController }