import messagesModel from "../models/messages.model.js";
import chatModel from "../models/chat.model.js";

export const createNewMessage = async (req, res) => {
    const { chatID, message } = req.body;
    const { userID } = req.user;

    const newMessage = new messagesModel({
        chatID: chatID,
        message: message,
        senderID: userID,
    });
    try {
        const chat = await chatModel.findOne({
            _id: chatID,
            members: { $in: [userID] },
        });

        if (!chat) {
            return res.status(403).json("You are not a member of this room!");
        }

        const message = await newMessage.save();
        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const getMessagesByChatId = async (req, res) => {
    const chatID = req.params.chatID;
    const { userID } = req.user;

    try {
        const chat = await chatModel.findOne({
            _id: chatID,
            members: { $in: [userID] },
        });

        if (!chat) {
            return res.status(403).json("You are not a member of this room!");
        }

        const messages = await messagesModel.find({
            chatID: chatID,
        });

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const getTestMessages = async (req, res) => {
    console.log(global._io);
    res.json("ok");
};
