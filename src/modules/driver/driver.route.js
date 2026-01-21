import { Router } from "express";
import { driverProfileController } from "./controllers/driverProfile.controller.js";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { driverDocumentController } from "./controllers/driverDocuments.controller.js";
import { isProfileCompleted } from "../../middlewares/profileComplete.middleware.js";
import { vehicleController } from "./controllers/vehicle.controller.js";
import { isDocumentSubmitted } from "../../middlewares/documentSubmitted.midddleware.js";

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
    upload.fields([
        {
        name:"driverLicense",
        maxCount:2
      },
      {
        name:"insurance",
        maxCount:2
      },
      {
        name:"vehicleRC",
        maxCount:2
      }
    ]),
    driverDocumentController
);

// Vehicle-Router

router.route("/vehicle").post(
isDocumentSubmitted,
vehicleController
);

export default router;