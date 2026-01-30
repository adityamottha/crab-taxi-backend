import { Router } from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { allowDriverController } from "./controllers/adminDashboard.controller.js";

const router = Router();

router.route("/allow-driver").get(
    verifyJWT,
    authorizeRole("ADMIN"),
    allowDriverController
);

export default router;