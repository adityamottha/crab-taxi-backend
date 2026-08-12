import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { createRideByAdminService } from "../services/adminRideBooking.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

const createRideByAdminController =
  AsyncHandler(async (req, res) => {

    const {
      passengerId,
      pickup,
      dropoff
    } = req.body;

    const result =
      await createRideByAdminService({
        passengerId,
        pickup,
        dropoff,
      });

    return res.status(201).json(
      new ApiResponse(
        201,
        result,
        "Ride created successfully by admin"
      )
    );
  });

export {
  createRideByAdminController
};