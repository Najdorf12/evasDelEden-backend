import mongoose from "mongoose";
import "dotenv/config.js";

export const connectDB = async () => {
const MONGO = `${process.env.MONGO}`;
  try {
    await mongoose.connect(MONGO)
    console.log("Conexion a mongo exitosa")
  } catch (error) {
    console.log(error);
  }
};