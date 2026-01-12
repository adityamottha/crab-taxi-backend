import { Router } from "express";
import { driverProfileController } from "./controllers/driverProfile.controller.js";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";

const router = Router();

router.route("/driver-profile").post(
    verifyJWT,
    authorizeRole("DRIVER"),
    driverProfileController
);

export default router;