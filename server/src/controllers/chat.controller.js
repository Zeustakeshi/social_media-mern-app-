import chatModel from "../models/chat.model.js";

export const createNewChat = async (req, res) => {
    const { senderID, receiverID } = req.body;
    if (!senderID || !receiverID) {
        return res.status(400).json("Missing data for this action!");
    }

    const newChat = new chatModel({
        members: [senderID, receiverID],
    });

    try {
        const chat = await newChat.save();
        return res.status(200).json(chat);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const getAllChatsByUser = async (req, res) => {
    const { userID } = req.user;

    try {
        const chat = await chatModel.find({
            members: { $in: [userID] },
        });

        return res.status(200).json(chat);
    } catch (error) {
        return res.status(500).json(error);
    }
};
