import jwt from "jsonwebtoken";
import refeshTokenModel from "../models/refeshToken.model.js";

export const authenticationMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json("Unauthorized !");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json("TokenExpiredError !");
            } else return res.status(403).json("Invalid token!");
        }

        req.user = { userID: data._id };
        next();
    });
};

export const socketAuthMiddleware = (socket, next) => {
    const authToken = socket.handshake?.auth?.authorization;
    console.log(authToken);
    const token = authToken?.split(" ")[1];
    if (!token) return next(new Error("Unauthorized !"));

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err) return next(new Error("Invalid token!"));
        return next();
    });
};
