import { Router } from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
// import { createRideController,acceptRideController } from "./controllers/ride.controller.js";
import { calculateFareController } from "./controllers/calculateFare.controller.js";

const router = Router();

// fare calculator
router.post("/calculate-fare",verifyJWT,calculateFareController);


// router.post("/create", verifyJWT, createRideController);
// router.post("/accept", verifyJWT, acceptRideController);

export default router;
