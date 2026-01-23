import { Router } from "express";
import {
    changePasswordController,
    loginController,
    logoutController, 
    refreshAccessTokenController,
    registerController 

    } from "./authUsers.controller.js";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";

const router = Router();

//REGISTER ROUTE
router.route("/register").post(registerController);

//LOGIN ROUTE
router.route("/login").post(loginController);

//LOGOUT ROUTE
router.route("/logout").post(verifyJWT,logoutController);

//GENERATE NEW ACCESS TOKEN ACCESS-TOKEN
router.route("/refresh-token").post(refreshAccessTokenController)

//CHANGE PASSWORD 
router.route("/change-password").post(verifyJWT,changePasswordController)

export default router;

