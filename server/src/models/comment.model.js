import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        postID: {
            type: String,
            required: true,
        },
        comments: { type: Array, default: [] },
    },
    { timestamps: true }
);

export default mongoose.model("comment", commentSchema);
