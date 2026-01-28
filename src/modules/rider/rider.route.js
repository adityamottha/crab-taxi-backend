import { Router } from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { isProfileCompleted } from "../../middlewares/profileComplete.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { changeAvatarController, changeFullnameController, changeGenderController, riderProfileController } from "./controllers/riderProfile.controller.js";


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

// FULL-NAME CHANGE-----------------
router.route("/change-fullname").patch(
    verifyJWT,
    authorizeRole("USER"),
    isProfileCompleted(),
    changeFullnameController
);

// GENDER CHANGE------------------
router.route("/change-gender").patch(
    verifyJWT,
    authorizeRole("USER"),
    isProfileCompleted(),
    changeGenderController
);

// AVATAR CHANGED-------------------
router.route("/change-avatar").patch(
    verifyJWT,
    authorizeRole("USER"),
    isProfileCompleted(),
    upload.fields([
        {
            name:"newAvatar",
            maxCount:1,
        }
    ])
    changeAvatarController
)

export default router; 