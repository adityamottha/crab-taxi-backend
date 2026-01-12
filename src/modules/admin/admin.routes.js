import { Router } from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { adminDashboardController } from "./controllers/adminDashboard.controller.js";

const router = Router();

router.route("/dashboard").get(verifyJWT,authorizeRole("ADMIN"),adminDashboardController);

export default router;