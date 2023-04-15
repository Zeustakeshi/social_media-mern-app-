import mongoose, { connect } from "mongoose";

// const uri = process.env.MONGOOSE_URI;

const connectDB = async () => {
    try {
        const res = await mongoose.connect(process.env.MONGOOSE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        if (res) console.log("connected database!");
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;
