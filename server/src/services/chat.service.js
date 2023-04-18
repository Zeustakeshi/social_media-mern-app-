class ChatService {
    constructor(chatModel, messagesModel) {
        this.chatModel = chatModel;
        this.messagesModel = messagesModel;
    }

    async newChat(senderID, receiverID) {
        const newChat = new this.chatModel({
            members: [senderID, receiverID],
        });
        return await newChat.save();
    }

    async getChatID(senderID, receiverID) {
        return await this.chatModel.findOne({
            members: [senderID, receiverID],
        });
    }

    async removeChat(chatID) {
        await this.messagesModel.deleteMany({ chatID: chatID._id });
        await this.chatModel.findByIdAndDelete(chatID._id);
    }

    async getAllChatByUser(userID) {
        return await this.chatModel.find({
            members: { $in: [userID] },
        });
    }
}

export class SocketService {
    constructor() {
        this.userOnlines = new Map();
    }

    addOnlineUsers(userID, socketID) {
        if (!this.userOnlines.get(userID)) {
            this.userOnlines.set(userID, socketID);
        }
    }

    notifyForFriendOnline(socket, message, friendID) {
        const friendSocketID = this.userOnlines.get(friendID);
        if (friendSocketID) {
            socket.to(friendSocketID).emit("notifyFromFriend", message);
        }
    }

    getOnlineFriend(socket, friendID) {
        if (this.userOnlines.has(friendID)) {
            socket.emit("getOnlineFriend", friendID);
        }
    }

    sendMessagesToFriendID(socket, friendID, messageDetails) {
        const friendSocketID = this.userOnlines.get(friendID);
        if (friendSocketID) {
            socket.broadcast
                .to(friendSocketID)
                .emit("getMessages", messageDetails);
        }
    }

    connection(socket) {
        const userID = socket.handshake.query.userID;
        socket.on("newUser", () => {
            this.addOnlineUsers(userID, socket.id);
        });

        socket.on("notifyForFriendOnline", (friendID, message) => {
            this.notifyForFriendOnline(socket, message, friendID);
        });

        socket.on("onlineFriend", (friendID) => {
            this.getOnlineFriend(socket, friendID);
        });

        socket.on("sendMessages", (friendID, messageDetails) => {
            this.sendMessagesToFriendID(socket, friendID, messageDetails);
        });

        socket.on("disconnect", () => {
            this.userOnlines.delete(userID);
        });
    }
}

export default ChatService;
