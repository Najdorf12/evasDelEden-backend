import mongoose from "mongoose";
import "dotenv/config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO)
    console.log("Conexion a mongo exitosa")
  } catch (error) {
    console.log(error);
  }
};