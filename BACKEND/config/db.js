import mongoose from "mongoose";

export const connectDB = async () => {
    console.log("Connection string: "+ process.env.MONGO_URL);
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};
