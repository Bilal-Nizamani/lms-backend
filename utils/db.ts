import mongoose from "mongoose";
require("dotenv").config();

const dbURL: string = process.env.DATABASE_URL || "";

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL).then((data: any) => {
      console.log(`mongodb is connected`);
    });
  } catch (err: any) {
    console.log(err.message);
    setTimeout(connectDB, 5000);
  }
};
export default connectDB;
