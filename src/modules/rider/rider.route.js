import { Router } from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { isProfileCompleted } from "../../middlewares/profileComplete.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { changeFullnameController, riderProfileController } from "./controllers/riderProfile.controller.js";


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

router.route("/change-fullname").patch(
    verifyJWT,
    authorizeRole("USER"),
    isProfileCompleted(),
    changeFullnameController
)

export default router; 