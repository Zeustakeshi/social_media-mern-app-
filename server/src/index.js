import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import connectDB from "./configs/db.config.js";
import authRouter from "./routers/auth.js";
import postRouter from "./routers/post.js";
import userRouter from "./routers/user.js";
import chatRouter from "./routers/chat.js";
import messageRouter from "./routers/message.js";
import { Server } from "socket.io";
import http from "http";
import { initSocket } from "./socket/socket.js";

const app = express();
const server = http.createServer(app);
dotenv.config();
connectDB();

// middleware
app.use(cookieParser());
app.use(helmet());
app.use(cors({ credentials: true, origin: process.env.ORIGIN_URL }));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/user", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/chats", chatRouter);

// socket
initSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server is runing is port " + PORT);
});
