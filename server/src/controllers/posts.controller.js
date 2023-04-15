import { v4 as uuidv4 } from "uuid";
import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";
import commentModel from "../models/comment.model.js";
import moment from "moment";

export const createPost = async (req, res) => {
    const { userID, desc, img } = req.body;
    const newPost = new postModel({
        userID: userID,
        desc: desc,
        img: img,
    });

    try {
        const post = await newPost.save();

        const newComments = new commentModel({
            postID: post._id,
            comments: [],
        });

        await newComments.save();

        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const updatePost = async (req, res) => {
    const postID = req.params.id;
    const { userID, desc, img } = req.body;
    const user = req.user;
    if (userID !== user.userID) {
        return res.status(403).json("Cant update this post!");
    }

    try {
        // update post image
        if (img) {
            await postModel.findByIdAndUpdate(postID, {
                img: img,
            });
            return res.status(200).json("This post has been updated!");
        }

        // update post description
        if (desc) {
            await postModel.findOneAndUpdate(postID, {
                desc: desc,
            });
            return res.status(200).json("This post has been updated!");
        }
    } catch (error) {
        return res.status(500).json(error);
    }

    return res.status(400).json("Missing data for this action!");
};

export const deletePost = async (req, res) => {
    const postID = req.params.id;
    const user = req.user;
    try {
        const post = await postModel.findById(postID);
        if (post.userID !== user.userID) {
            return res.json("Cant delete this post!");
        }

        await commentModel.findOneAndDelete({
            postID: post._id,
        });
        await post.deleteOne();

        return res.status(200).json("This post has been deleted!");
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const likePost = async (req, res) => {
    const postID = req.params.id;
    const user = req.user;
    try {
        const post = await postModel.findById(postID);

        if (post.likes.includes(user.userID)) {
            // user has been liked
            return res.status(400).json("You has been liked this post");
        } else {
            await post.updateOne({ $push: { likes: user.userID } });
            return res.status(200).json("Like post success!");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const unlikePost = async (req, res) => {
    const postID = req.params.id;
    const user = req.user;
    try {
        const post = await postModel.findById(postID);
        if (!post.likes.includes(user.userID)) {
            // user has been liked
            return res.status(400).json("you are not liked this post");
        } else {
            await post.updateOne({ $pull: { likes: user.userID } });
            return res.status(200).json("unlike post success!");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const addComment = async (req, res) => {
    const userID = req.user.userID;
    const { comment } = req.body;
    const postID = req.params.id;

    try {
        const newComment = {
            _id: uuidv4(),
            userID: userID,
            comment: comment,
            createdAt: moment().format(),
        };

        await commentModel.findOneAndUpdate(
            { postID: postID },
            { $push: { comments: newComment } }
        );

        return res
            .status(200)
            .json({ mess: "Comment has been added!", data: newComment });
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const getComments = async (req, res) => {
    const postID = req.params.postid;
    try {
        const commentData = await commentModel.findOne(
            { postID: postID },
            { comments: 1 }
        );

        const comments = await Promise.all(
            commentData.comments.map(async (comment) => {
                const commentAuthor = await userModel.findOne(
                    { _id: comment.userID },
                    {
                        userName: 1,
                        avatar: 1,
                    }
                );

                return {
                    ...comment,
                    userName: commentAuthor.userName,
                    avatar: commentAuthor.avatar,
                };
            })
        );

        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const deleteComment = async (req, res) => {
    return res.status(500).json("Cant delete comment");
    // const postID = req.params.id;
    // const { commentID } = req.body;
    // try {
    //     await postModel.findOneAndUpdate(
    //         { _id: postID },
    //         { $pull: { comments: { _id: commentID, userID: req.user.userID } } }
    //     );
    //     return res.status(200).json("Comment has been deleted!");
    // } catch (error) {
    //     return res.status(500).json(error);
    // }
};

export const getTimelinePost = async (req, res) => {
    const user = req.user;
    try {
        const currentUser = await userModel.findById(user.userID);
        const userPosts = await postModel
            .find({ userID: currentUser._id })
            .sort({ createdAt: 1 });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendID) => {
                return postModel.find({ userID: friendID });
            })
        );
        return res.status(200).json([...userPosts, ...friendPosts]);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

export const getTimelineUserPost = async (req, res) => {
    const { uid } = req.params;
    try {
        const currentUser = await userModel.findById(uid);
        const userPosts = await postModel
            .find({ userID: currentUser._id })
            .sort({ createdAt: "desc" });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendID) => {
                return postModel
                    .find({ userID: friendID })
                    .sort({ createdAt: "desc" });
            })
        );

        return res.status(200).json(userPosts.concat(friendPosts.flat()));
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
