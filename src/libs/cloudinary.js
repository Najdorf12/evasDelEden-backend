import { v2 as cloudinary } from "cloudinary";
import "dotenv/config.js";

const cloudinaryName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryKey = process.env.CLOUDINARY_API_KEY;
const cloudinarySecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudinaryName,
  api_key: cloudinaryKey,
  api_secret: cloudinarySecret,
  secure: true,
});

export const uploadImage = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "evasDelEden",
  });
};

export const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};
