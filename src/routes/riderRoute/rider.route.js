import { Router } from "express";
import { riderProfile } from "../../controllers/riderController/riderProfile.controller";
import { verifyJWT } from "../../middlewares/authMiddleware/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

router.route("/rider-profile").post(verifyJWT,upload,riderProfile);

export default router;