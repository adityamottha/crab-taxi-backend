import { Router } from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { approvedDriverProfileStatusController, getAllDriversController, notApprovedDriverController, driverProfileRejectController, driverDocumentsApprovedController } from "./controllers/adminDashboard.controller.js";

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

// DRIVER_DOCUMENTS APPROVED -------------------------
router.route("/driver-documents-approved").patch(
    verifyJWT,
    authorizeRole("ADMIN"),
    driverDocumentsApprovedController
);

export default router;