import { Router } from "express";
import { verifyJWT } from "../../middlewares/authMiddleware/auth.middleware.js";
import { authorizeRole } from "../../middlewares/authMiddleware/authorizeRole.middleware.js";
import { adminDashboardController } from "../../controllers/adminController/adminDashboard.controller.js";

const router = Router();

router.route("/dashboard").get(verifyJWT,authorizeRole("ADMIN"),adminDashboardController);

export default router;