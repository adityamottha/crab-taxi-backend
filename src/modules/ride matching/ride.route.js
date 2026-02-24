import { Router } from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { createRideController,acceptRideController } from "./controllers/ride.controller.js";

const router = Router();

router.post("/create", verifyJWT, createRideController);
router.post("/accept", verifyJWT, acceptRideController);

export default router;
