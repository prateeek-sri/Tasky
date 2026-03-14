import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error :", error.message);
  }
}

export default connectDB;
