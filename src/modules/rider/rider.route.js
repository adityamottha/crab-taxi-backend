import { Router } from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { riderProfileController } from "./controllers/riderProfile.controller.js";


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