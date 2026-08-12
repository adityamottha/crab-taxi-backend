import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { createRideByAdminService, getRequestedRidesByAdminService } from "../services/adminRideBooking.service.js";
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


// get requested rides by user to admin dashboard
//===========================================================

const getRequestedRidesByAdminController =
  AsyncHandler(async (req, res) => {

    const rides =
      await getRequestedRidesByAdminService();

    return res.status(200).json(
      new ApiResponse(
        200,
        rides,
        "Requested rides fetched successfully"
      )
    );
  });

export {
  getRequestedRidesByAdminController,
};