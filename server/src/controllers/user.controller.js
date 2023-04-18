import bcrypt from "bcrypt";
import queryString from "query-string";
import userModel from "../models/user.model.js";

export const getUser = async (req, res) => {
    const profileID = req.params.id;
    const { userID } = req.user;
    try {
        const otherUser = await userModel.findById(profileID);
        let isFollowWithCurrentUser = false;
        if (otherUser.followers.includes(userID)) {
            isFollowWithCurrentUser = true;
        }
        const userInfoRes = {
            id: otherUser._id,
            userName: otherUser.userName,
            avatar: otherUser.avatar,
            coverImage: otherUser.coverImage,
            desc: otherUser.desc,
            isFollowWithCurrentUser: isFollowWithCurrentUser,
        };
        return res.status(200).json(userInfoRes);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const searchUser = async (req, res) => {
    const searchValue = queryString.parse(req.url.split("?")[1]).q;
    const searchRegex = new RegExp(searchValue, "i");
    try {
        const users = await userModel.find(
            { userName: { $regex: searchRegex } },
            { _id: 1, userName: 1, avatar: 1, desc: 1 }
        );
        return res.status(200).json(
            users.map((user) => {
                return {
                    userName: user.userName,
                    avatar: user.avatar,
                    id: user.id,
                    desc: user.desc,
                };
            })
        );
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const update = async (req, res) => {
    const userID = req.params.id;
    const { userName, newPassword, password, email, desc, avatar } = req.body;

    if (req.user.userID !== userID) {
        return res.status(403).json("You can't update this user!");
    }

    try {
        // update userName
        if (userName) {
            await userModel.findByIdAndUpdate(userID, {
                userName: userName,
            });
            return res.status(200).json("Update userName success!");
        }
        // update password
        if (newPassword && password) {
            const currentUser = await userModel.findById(userID, {
                password: 1,
            });

            if (bcrypt.compareSync(password, currentUser.password)) {
                const salt = bcrypt.genSaltSync(10);
                const hashPassword = bcrypt.hashSync(newPassword, salt);
                await userModel.findByIdAndUpdate(userID, {
                    password: hashPassword,
                });
                return res.status(200).json("Update password success!");
            } else {
                return res.status(403).json("Invalid password!");
            }
        }
        //update email
        if (email) {
            await userModel.findByIdAndUpdate(userID, {
                email: email,
            });
            return res.status(200).json("Update email success!");
        }

        // update desciption
        if (desc) {
            await userModel.findByIdAndUpdate(userID, {
                desc: desc,
            });
            return res.status(200).json("Update description success!");
        }

        //update avatar
        if (avatar) {
            await userModel.findByIdAndUpdate(userID, {
                avatar: avatar,
            });
            return res.status(200).json("Update avatar success!");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
    return res.status(400).json("Missing update data!");
};

export const updateUserFollow = async (req, res) => {
    const { userID } = req.user;
    const otherUserID = req.params.id;

    if (userID !== otherUserID) {
        try {
            const otherUser = await userModel.findById(otherUserID);
            const currentUser = await userModel.findById(userID);

            if (otherUser.followers.includes(userID)) {
                // user allready followed
                return res.status(400).json("This user allready followed!");
            } else {
                // follow user
                await otherUser.updateOne({ $push: { followers: userID } });
                await currentUser.updateOne({
                    $push: { followings: otherUserID },
                });
                return res.status(200).json("User has been followed!");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        return res.status(400).json("Can't follow yourself!");
    }
};

export const updateUserUnFollow = async (req, res) => {
    const { userID } = req.user;
    const otherUserID = req.params.id;

    if (userID !== otherUserID) {
        try {
            const otherUser = await userModel.findById(otherUserID);
            const currentUser = await userModel.findById(userID);

            if (!otherUser.followers.includes(userID)) {
                //not following
                return res.status(400).json("You are not following this user!");
            } else {
                // unfollow user
                await otherUser.updateOne({ $pull: { followers: userID } });
                await currentUser.updateOne({
                    $pull: { followings: otherUserID },
                });
                return res.status(200).json("User has been unfollowed!");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        return res.status(400).json("Can't unfollow yourself!");
    }
};
