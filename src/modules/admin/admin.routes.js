import { Router } from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { approvedDriverProfileStatusController, getAllDriversController, notApprovedDriverController, driverDocumentsApprovedController } from "./controllers/adminDashboard.controller.js";

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
router.route("/driver-approved").patch(
    verifyJWT,
    authorizeRole("ADMIN"),
    approvedDriverProfileStatusController
);

// UPDATE TO APPROVED DRIVER DOCUMENTS STATUS ROUTE.
router.route("/driver-documents-approved").patch(
    verifyJWT,
    authorizeRole("ADMIN"),
    driverDocumentsApprovedController
)
export default router;