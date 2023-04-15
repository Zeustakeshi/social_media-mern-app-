import express from "express";
import {
    createPost,
    deletePost,
    likePost,
    getTimelinePost,
    unlikePost,
    updatePost,
    getTimelineUserPost,
    addComment,
    deleteComment,
    getComments,
} from "../controllers/posts.controller.js";
import { authenticationMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authenticationMiddleware, getTimelinePost);
router.get("/:uid", authenticationMiddleware, getTimelineUserPost);
router.post("/", authenticationMiddleware, createPost);
router.patch("/:id", authenticationMiddleware, updatePost);
router.delete("/:id", authenticationMiddleware, deletePost);

// like
router.patch("/:id/like", authenticationMiddleware, likePost);
router.patch("/:id/unlike", authenticationMiddleware, unlikePost);
// comment
router.post("/:id/comment", authenticationMiddleware, addComment);
router.get("/:postid/comment", authenticationMiddleware, getComments);
router.delete("/:id/comment", authenticationMiddleware, deleteComment);

export default router;
