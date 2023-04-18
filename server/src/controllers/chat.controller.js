import chatModel from "../models/chat.model.js";
import ChatService from "../services/chat.service.js";
import messagesModel from "../models/messages.model.js";

const chatService = new ChatService(chatModel, messagesModel);

export const createNewChat = async (req, res) => {
    const { senderID, receiverID } = req.body;

    if (!senderID || !receiverID) {
        return res.status(400).json("Missing data for this action!");
    }
    try {
        const chat = await chatService.newChat(senderID, receiverID);
        return res.status(200).json(chat);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const removeChat = async (req, res) => {
    const { senderID, receiverID } = req.body;
    if (!senderID || !receiverID) {
        return res.status(400).json("Missing data for this action!");
    }
    try {
        const chatID = await chatService.getChatID(senderID, receiverID);
        await chatService.removeChat(chatID);
        return res.status(200).json("Chat has been deleted!");
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const getAllChatsByUser = async (req, res) => {
    const { userID } = req.user;

    try {
        const chat = await chatService.getAllChatByUser(userID);
        return res.status(200).json(chat);
    } catch (error) {
        return res.status(500).json(error);
    }
};
