import { Router } from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { getAllDriversController, notApprovedDriverController } from "./controllers/adminDashboard.controller.js";

const router = Router();

// ALL DRIVERS ROUTE
router.route("/drivers").get(
    verifyJWT,
    authorizeRole("ADMIN"),
    getAllDriversController
);

// NOT-APPROVED-DRIVERS ROUTE
router.route("/not-approved").get(
    verifyJWT,
    authorizeRole("ADMIN"),
    notApprovedDriverController
)

export default router;