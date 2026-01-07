import { Router } from "express";
import { loginController, registerController } from "../../controllers/authController/authUser.controller.js";

const router = Router();

//REGISTER ROUTE
router.route("/register").post(registerController);

//LOGIN ROUTE
router.route("/login").post(loginController)
export default router;

