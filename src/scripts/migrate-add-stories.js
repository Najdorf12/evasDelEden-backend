import mongoose from "mongoose";
import dotenv from "dotenv";
import Eva from "../models/eva.model.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO);

  const result = await Eva.updateMany(
    { stories: { $exists: false } },
    { $set: { stories: [] } },
  );

  console.log(`Evas actualizadas: ${result.modifiedCount}`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});