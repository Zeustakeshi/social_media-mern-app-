import jwt from "jsonwebtoken";
import refeshTokenModel from "../models/refeshToken.model.js";

export const authenticationMiddleware = (req, res, next) => {
    const { access_token: token, refresh_token } = req.cookies;

    if (!token) return res.status(401).json("Unauthorized !");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return jwt.verify(
                    refresh_token,
                    process.env.REFRESH_TOKEN_SECRET,
                    async (err, data) => {
                        if (err) return res.status(401).json("Unauthorized !");

                        const refeshTokenData = await refeshTokenModel.findOne({
                            userID: data._id,
                            refeshToken: refresh_token,
                        });

                        if (refeshTokenData) {
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

                            await refeshTokenData.updateOne({
                                refeshToken: refresh_token,
                            });
                            res.cookie("access_token", access_token, {
                                httpOnly: true,
                            });
                            res.cookie("refresh_token", refresh_token, {
                                httpOnly: true,
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
