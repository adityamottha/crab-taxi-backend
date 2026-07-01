import { Router } from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { calculateFareController } from "./controllers/calculateFare.controller.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { createRideController } from "./controllers/ride.controller.js";
import { addRatingController, getDriverRatingsController } from "./controllers/rating.controller.js";

const router = Router();

// fare calculator
router.post(
    "/calculate-fare",
    verifyJWT,
    authorizeRole("USER"),
    calculateFareController
);

// create ride
router.post(
    "/create",
    verifyJWT,
    authorizeRole("USER"),
    createRideController
);

// rating
router.post(
    "/:rideId/rating",
    verifyJWT,
    authorizeRole("USER"),
    addRatingController
);

// get rating
router.get(
    "/rating",
    verifyJWT,
    authorizeRole("DRIVER"),
    getDriverRatingsController
);
export default router;