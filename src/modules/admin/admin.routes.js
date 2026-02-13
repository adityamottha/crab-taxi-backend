import { Router } from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import 
    {
     approvedDriverProfileStatusController, 
     getAllDriversController,
     notApprovedDriverController,
     driverProfileRejectController,
     driverDocumentsRejectController,
     driverDocumentsApprovedController, 
     driverVehicleApprovedController,
     driverVehicleRejectController
    } 
    from "./controllers/adminDashboard.controller.js";

const router = Router();

// ALL DRIVERS ROUTE
router.route("/drivers").get(
    verifyJWT,
    authorizeRole("ADMIN"),
    getAllDriversController
);

// NOT-APPROVED-DRIVERS ROUTE
router.route("/not-approved-drivers").get(
    verifyJWT,
    authorizeRole("ADMIN"),
    notApprovedDriverController
)

// UPDATE TO APPROVED DRIVER PROFILE STATUS ROUTE. 
router.route("/driver-profile-approved").patch(
    verifyJWT,
    authorizeRole("ADMIN"),
    approvedDriverProfileStatusController
);

// UPDATE TO REJECT DRIVER STATUS ROUTE.
router.route("/driver-profile-reject").patch(
    verifyJWT,
    authorizeRole("ADMIN"),
    driverProfileRejectController
);

// DRIVER_DOCUMENTS APPROVED  ROUTE.
router.route("/driver-documents-approved").patch(
    verifyJWT,
    authorizeRole("ADMIN"),
    driverDocumentsApprovedController
);

// DRIVER-DOCUMENTS REJETCTED ROUTE.
router.route("/driver-documents-rejected").patch(
    verifyJWT,
    authorizeRole("ADMIN"),
    driverDocumentsRejectController
);

// DRIVER-VEHICLE APPROVED ROUTE.
router.route("/driver-vehicle-approved").patch(
    verifyJWT,
    authorizeRole("ADMIN"),
    driverVehicleApprovedController
)


export default router;