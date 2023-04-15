import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        members: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

export default mongoose.model("chat", chatSchema);
