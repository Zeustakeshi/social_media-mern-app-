import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        chatID: {
            type: String,
            required: true,
        },
        senderID: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("message", messageSchema);
