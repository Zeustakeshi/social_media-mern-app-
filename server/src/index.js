import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./configs/db.config.js";
import { socketAuthMiddleware } from "./middlewares/auth.middleware.js";
import authRouter from "./routers/auth.js";
import chatRouter from "./routers/chat.js";
import messageRouter from "./routers/message.js";
import postRouter from "./routers/post.js";
import userRouter from "./routers/user.js";
import { SocketService } from "./services/chat.service.js";

const app = express();
const server = http.createServer(app);
dotenv.config();
connectDB();

const io = new Server(server, {
    cors: {
        origin: process.env.ORIGIN_URL,
        credentials: true,
    },
});
global._io = io;

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
global._io.use(socketAuthMiddleware);

const socketService = new SocketService();
global._io.on("connection", socketService.connection.bind(socketService));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server is runing is port " + PORT);
});
