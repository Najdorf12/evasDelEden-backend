import mongoose from "mongoose";
import "dotenv/config.js";

const MONGO = `${process.env.MONGO}`;
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO)
    console.log("Conexion a mongo exitosa")
  } catch (error) {
    console.log(error);
  }
};