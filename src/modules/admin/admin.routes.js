import { Router } from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";
import { getAllDriversController } from "./controllers/adminDashboard.controller.js";

const router = Router();
router.route("/drivers").get(
    verifyJWT,
    authorizeRole("ADMIN"),
    getAllDriversController
);

export default router;