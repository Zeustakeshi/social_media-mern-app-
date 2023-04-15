import mongoose from "mongoose";

const refeshTokenSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
        },
        refeshToken: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("refeshToken", refeshTokenSchema);
