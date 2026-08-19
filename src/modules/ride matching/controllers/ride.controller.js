import { AsyncHandler } from "../../../utils/AsyncHandler.js";
import { createRideService, getDriverRideHistoryService, getUserRideHistoryService } from "../services/ride.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

const createRideController =
  AsyncHandler(async (req, res) => {

    const { pickup, dropoff } =
      req.body;

    const ride =
      await createRideService({
        passengerId: req.user._id,
        pickup,
        dropoff,
      });

    return res.status(201).json(
      new ApiResponse(
        201,
        ride,
        "Ride created successfully"
      )
    );

  });



// ==================== USER RIDE HISTORY ====================

const getUserRideHistoryController = AsyncHandler(async (req, res) => {

    const userId = req.user._id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status;

    const history = await getUserRideHistoryService({
      userId,
      page,
      limit,
      status,
    });

    return res.status(200).json(
      new ApiResponse(
      200,
      history,
      "User ride history fetched successfully",
      )
    );

});


// ==================== DRIVER RIDE HISTORY ====================

const getDriverRideHistoryController = AsyncHandler(async (req, res) => {
    const driverId = req.user._id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status;

    const history = await getDriverRideHistoryService({
      driverId,
      page,
      limit,
      status,
    });


    return res.status(200).json(
      new ApiResponse(
       200,
       history,
      "Driver ride history fetched successfully"
      )
    );
});

// GET DRIVER RIDE HISTORY TO ADMIN =================================
const getAdminDriverRideHistoryController = AsyncHandler(
  async (req, res) => {

    const { driverId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status;

    const history = await getDriverRideHistoryService({
      driverId,
      page,
      limit,
      status,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        history,
        "Driver ride history fetched successfully"
      )
    );
  }
);
export {
  createRideController,
  getUserRideHistoryController,
  getDriverRideHistoryController
};