import { Router } from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { createRideController } from "./controllers/ride.controller.js";

const router = Router();

router.post("/create", verifyJWT, createRideController);

export default router;
