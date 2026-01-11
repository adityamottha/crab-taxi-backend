import { Router } from "express";
import { driverProfileController } from "../../controllers/driverController/driverProfile.controller.js";

const router = Router();

router.route("/driverProfile").post(driverProfileController);

export default router;