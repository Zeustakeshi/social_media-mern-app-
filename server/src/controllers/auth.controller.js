import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import refeshTokenModel from "../models/refeshToken.model.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { userName, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const newUser = new userModel({
        userName: userName,
        email: email,
        password: hashPassword,
    });
    try {
        const user = await newUser.save();
        const access_token = jwt.sign(
            { _id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_TIME }
        );
        const refresh_token = jwt.sign(
            { _id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_TIME }
        );

        const newRefeshToken = new refeshTokenModel({
            userID: user._id,
            refeshToken: refresh_token,
        });

        await newRefeshToken.save();

        res.cookie("access_token", access_token, {
            httpOnly: true,
        });
        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
        });
        return res.status(200).json({
            id: user._id,
            userName: user.userName,
            coverImage: user.coverImage,
            email: user.email,
            followers: user.followers,
            followings: user.followings,
            desc: user.desc,
            avatar: user.avatar,
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        if (!user) return res.status(404).json("Not found!");
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(403).json("Invalid password!");
        const access_token = jwt.sign(
            { _id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_TIME }
        );
        const refresh_token = jwt.sign(
            { _id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_TIME }
        );

        const refeshTokenData = await refeshTokenModel.findOne({
            userID: user._id,
        });

        await refeshTokenData.updateOne({
            refeshToken: refresh_token,
        });

        res.cookie("access_token", access_token, {
            httpOnly: true,
        });
        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
        });

        return res.status(200).json({
            id: user._id,
            userName: user.userName,
            coverImage: user.coverImage,
            email: user.email,
            followers: user.followers,
            followings: user.followings,
            desc: user.desc,
            avatar: user.avatar,
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const logout = async (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true,
    });
    res.clearCookie("refresh_token", {
        sameSite: "none",
        secure: true,
    });

    return res.status(200).json("Logout success!");
};
