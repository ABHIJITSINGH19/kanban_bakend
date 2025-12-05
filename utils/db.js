import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("DB connection successful👍");
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
