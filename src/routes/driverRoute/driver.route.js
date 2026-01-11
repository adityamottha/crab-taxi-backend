import { Router } from "express";
import { driverProfileController } from "../../controllers/driverController/driverProfile.controller.js";
import { verifyJWT } from "../../middlewares/authMiddleware/auth.middleware.js";
import { authorizeRole } from "../../middlewares/authMiddleware/authorizeRole.middleware.js";

const router = Router();

router.route("/driver-profile").post(
    verifyJWT,
    authorizeRole("DRIVER"),
    driverProfileController
);

export default router;