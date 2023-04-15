import express from "express";
import {
    createNewMessage,
    getMessagesByChatId,
} from "../controllers/message.controller.js";
import { authenticationMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// create new message
router.post("/", authenticationMiddleware, createNewMessage);

// get messages by chat id
router.get("/:chatID", authenticationMiddleware, getMessagesByChatId);

export default router;
