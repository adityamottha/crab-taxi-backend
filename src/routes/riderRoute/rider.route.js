import { Router } from "express";
import { verifyJWT } from "../../middlewares/authMiddleware/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { authorizeRole } from "../../middlewares/authMiddleware/authorizeRole.middleware.js";
import { riderProfileController } from "../../controllers/riderController/riderProfile.controller.js";


const router = Router();

router.route("/rider-profile").post(
    verifyJWT,
    authorizeRole("USER"),
    upload.fields([
        {
            name:"userAvatar",
            maxCount:1

        }

    ]),
    riderProfileController
);

export default router; 