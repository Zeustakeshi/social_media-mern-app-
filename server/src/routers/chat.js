import express from "express";
import {
    createNewChat,
    getAllChatsByUser,
} from "../controllers/chat.controller.js";
import { authenticationMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

// create new chat
router.post("/", authenticationMiddleware, createNewChat);
// get caht data by user id
router.get("/", authenticationMiddleware, getAllChatsByUser);
export default router;
