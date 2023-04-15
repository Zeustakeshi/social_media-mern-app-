import { Server } from "socket.io";

let userOnline = [];

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.ORIGIN_URL,
            credentials: true,
        },
    });

    const newUser = (userID, socketID) => {
        if (!userOnline.some((user) => user.userID === userID)) {
            userOnline.push({
                userID,
                socketID,
            });
        }
    };

    const deleteUser = (socketID) => {
        userOnline = userOnline.filter((user) => user.socketID !== socketID);
    };

    const getFriendOnlines = (friendIDs) => {
        console.log(friendIDs);
        const friends = userOnline.filter((user) => {
            return friendIDs.some((id) => id === user.userID);
        });
        return friends;
    };

    io.on("connection", (socket) => {
        // add new user
        socket.on("newUser", (userID) => {
            newUser(userID, socket.id);
            // io.emit("getUsers", userOnline);
        });

        // get friends online for current user
        socket.on("friends-online", (friendIDs) => {
            const friends = getFriendOnlines(friendIDs);
            console.log(friends);
            socket.emit("getFriendOnlines", friends);
        });

        console.log("a user connected");
        socket.on("disconnect", () => {
            console.log("a user disconnect");
            deleteUser(socket.id);
            io.emit("getUsers", userOnline);
        });
    });
};
