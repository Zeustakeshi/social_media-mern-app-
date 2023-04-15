import express from "express";
import {
    getUser,
    searchUser,
    update,
    updateUserFollow,
    updateUserUnFollow,
} from "../controllers/user.controller.js";
import { authenticationMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/search", searchUser);
router.get("/:id", authenticationMiddleware, getUser);
router.patch("/:id", authenticationMiddleware, update);
router.patch("/:id/follow", authenticationMiddleware, updateUserFollow);
router.patch("/:id/unfollow", authenticationMiddleware, updateUserUnFollow);

export default router;
