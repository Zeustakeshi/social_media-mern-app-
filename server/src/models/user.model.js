import mongoose, { model } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            min: 3,
            max: 20,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50,
        },
        password: {
            type: String,
            required: true,
            min: 6,
        },
        avatar: {
            type: String,
            default: "https://source.unsplash.com/featured/user",
        },
        coverImage: {
            type: String,
            default: "",
        },
        followers: {
            type: Array,
            default: [],
        },
        followings: {
            type: Array,
            default: [],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        desc: {
            type: String,
            max: 50,
            default: "",
        },
    },
    { timestamps: true }
);

export default mongoose.model("user", userSchema);
