import { Router } from "express";
import { driverProfileController } from "./controllers/driverProfile.controller.js";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { driverDocumentController } from "./controllers/driverDocuments.controller.js";
import { isProfileCompleted } from "../../middlewares/profileComplete.middleware.js";

const router = Router();

// Driver-Profile Router
router.route("/driver-profile").post(
    verifyJWT,
    authorizeRole("DRIVER"),
    upload.fields([{
        name:"avatar",
        maxCount:1 
    }]),
    driverProfileController
);

// Driver-Documents Router

router.route("/driver-documents").post(
     verifyJWT,
    authorizeRole("DRIVER"),
    isProfileCompleted(),
    driverDocumentController
);

export default router;