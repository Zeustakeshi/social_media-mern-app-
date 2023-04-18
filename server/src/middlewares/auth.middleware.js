import jwt from "jsonwebtoken";
import refeshTokenModel from "../models/refeshToken.model.js";

export const authenticationMiddleware = (req, res, next) => {
    const { access_token: token, refresh_token } = req.cookies;

    if (!token) return res.status(401).json("Unauthorized !");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                if (!refresh_token)
                    return res.status(401).json("Unauthorized !");
                return jwt.verify(
                    refresh_token,
                    process.env.REFRESH_TOKEN_SECRET,
                    async (err, data) => {
                        if (err) return res.status(401).json("Invalid token!");
                        // find refesh token from database
                        const refeshTokenData = await refeshTokenModel.findOne({
                            userID: data._id,
                            refeshToken: refresh_token,
                        });

                        if (refeshTokenData) {
                            // create new token and refesh token

                            const access_token = jwt.sign(
                                { _id: data._id },
                                process.env.ACCESS_TOKEN_SECRET,
                                { expiresIn: process.env.ACCESS_TOKEN_TIME }
                            );
                            const refresh_token = jwt.sign(
                                { _id: data._id },
                                process.env.REFRESH_TOKEN_SECRET,
                                { expiresIn: process.env.REFRESH_TOKEN_TIME }
                            );
                            // update refesh token to database
                            await refeshTokenData.updateOne({
                                refeshToken: refresh_token,
                            });
                            // set client cookie
                            res.cookie("access_token", access_token, {
                                httpOnly: true,
                                // maxAge: process.env.ACCESS_TOKEN_TIME * 1000,
                            });
                            res.cookie("refresh_token", refresh_token, {
                                httpOnly: true,
                                // maxAge: process.env.REFRESH_TOKEN_TIME * 1000,
                            });

                            req.user = { userID: data._id };
                            next();
                        } else {
                            res.status(403).json("Invalid refeshToken");
                        }
                    }
                );
            } else return res.status(403).json("Invalid token!");
        }

        req.user = { userID: data._id };
        next();
    });
};

export const socketAuthMiddleware = (socket, next) => {
    let token = socket.handshake?.headers?.cookie?.split(" ")[0]?.split("=")[1];
    token = token?.slice(0, token.length - 1);

    if (!token) return next(new Error("Unauthorized !"));

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err) return next(new Error("Invalid token!"));
        return next();
    });
};
