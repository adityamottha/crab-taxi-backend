import { Router } from "express";
import { driverProfileController } from "./controllers/driverProfile.controller.js";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

router.route("/driver-profile").post(
    verifyJWT,
    authorizeRole("DRIVER"),
    upload.fields([{
        name:"avatar",
        maxCount:1 
    }]),
    driverProfileController
);

export default router;