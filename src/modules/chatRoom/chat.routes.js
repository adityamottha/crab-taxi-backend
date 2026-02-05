import express from "express";
import { verifyJWT } from "../../middlewares/authVerifyJwt.middleware.js";
import { createRoom, createMessage, fetchMessages } from "./controllers/chat.controller.js";

const router = express.Router();

router.post("/room", verifyJWT, createRoom);
router.post("/message", verifyJWT, createMessage);
router.get("/messages/:roomId", verifyJWT, fetchMessages);

export default router;
