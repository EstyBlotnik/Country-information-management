import mongoose from "mongoose";

export async function connectDB() {
  const mongoURI =
    process.env.MONGOURI || "mongodb://localhost:27017";
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
    
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}
