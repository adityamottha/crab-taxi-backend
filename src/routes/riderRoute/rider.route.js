import { Router } from "express";
import { riderProfile } from "../../controllers/riderController/riderProfile.controller";

const router = Router();

router.route("/rider-profile").post(riderProfile);

export default router;