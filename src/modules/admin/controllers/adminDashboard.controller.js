import { ApiResponse } from "../../../utils/ApiResponse.js";
import { AsyncHandler } from "../../../utils/AsyncHandler.js"
import { getAllDriversService } from "../services/adminDashboard.service.js";


const getAllDriversController = AsyncHandler(async (req, res) => {
  const drivers = await getAllDriversService();

  return res.status(200).json(
    new ApiResponse(
        200,
         drivers, 
         "All drivers fetched successfully"
        )
  );
}
);


export { getAllDriversController }