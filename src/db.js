import mongoose from "mongoose";
import "dotenv/config.js";

const MONGO = `${process.env.MONGO}`;
export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://agustinmorro:SFSVAXT8fozVp8uO@cluster0.oay92.mongodb.net/?retryWrites=true&w=majority&appName=Evas")
    console.log("Conexion a mongo exitosa")
  } catch (error) {
    console.log(error);
  }
};