import { uploadImageToR2, deleteImageFromR2 } from "../libs/r2-service.js";
import { uploadVideoToR2, deleteVideoFromR2 } from "../libs/r2-service.js";
import { promises as fs } from 'fs';
import { fileTypeFromBuffer } from 'file-type';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se proporcionó archivo" });
    }

    const result = await uploadImageToR2({
      ...req.file,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    // Limpieza del archivo temporal
    await fs.unlink(req.file.path).catch(console.error);

    res.status(200).json({
      public_id: result.public_id,
      secure_url: result.secure_url
    });

  } catch (error) {
    console.error("Error al subir imagen:", error);
    
    // Limpieza en caso de error
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(console.error);
    }

    res.status(500).json({
      message: "Error al subir imagen",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.params;

    await deleteImageFromR2(public_id);

    res.status(200).json({
      message: "Image deleted successfully",
      public_id: public_id,
    });
  } catch (error) {
    console.error("Error in deleteImage:", error);
    res.status(500).json({
      message: "Error deleting image",
      error: error.message,
    });
  }
};

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video uploaded" });
    }

    const result = await uploadVideoToR2(req.file);

    res.status(200).json({
      public_id: result.public_id,
      secure_url: result.secure_url,
    });
  } catch (error) {
    console.error("Error in uploadVideo:", error);
    res.status(500).json({
      message: "Error uploading video",
      error: error.message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { public_id } = req.params;

    await deleteVideoFromR2(public_id);

    res.status(200).json({
      message: "Video deleted successfully",
      public_id: public_id,
    });
  } catch (error) {
    console.error("Error in deleteVideo:", error);
    res.status(500).json({
      message: "Error deleting video",
      error: error.message,
    });
  }
};
