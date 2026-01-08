import { Router } from "express";
import {
    loginController,
    logoutController, 
    refreshAccessTokenController,
    registerController 

    } from "../../controllers/authController/authUser.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

//REGISTER ROUTE
router.route("/register").post(registerController);

//LOGIN ROUTE
router.route("/login").post(loginController);

//LOGOUT ROUTE
router.route("/logout").post(verifyJWT,logoutController);

//GENERATE NEW ACCESS TOKEN ACCESS-TOKEN
router.route("/refresh-token").post(refreshAccessTokenController)

export default router;

