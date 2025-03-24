import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
        throw new Error("❌ MONGO_URI is not defined in the environment variables.");
    }

    try {
        await mongoose.connect(mongoURI);
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
};
