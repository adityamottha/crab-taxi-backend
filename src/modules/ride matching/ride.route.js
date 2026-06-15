import { Router } from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { calculateFareController } from "./controllers/calculateFare.controller.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { acceptRideController, createRideController } from "./controllers/ride.controller.js";

const router = Router();

// fare calculator
router.post("/calculate-fare",verifyJWT,authorizeRole("USER"),calculateFareController);


// create ride
router.post("/create", verifyJWT,authorizeRole("USER"),createRideController);


// accept ride
router.post("/accept-ride/:rideId", verifyJWT,authorizeRole("DRIVER"), acceptRideController);

export default router;
