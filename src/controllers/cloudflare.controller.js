import { uploadImageToR2, deleteImageFromR2 } from "../libs/r2-service.js";
import { uploadVideoToR2, deleteVideoFromR2 } from "../libs/r2-service.js";
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Leer el archivo temporal como buffer para verificación adicional
    const fileBuffer = await fs.promises.readFile(req.file.path);
    
    // Verificación profunda del tipo de archivo
    const fileType = await fileTypeFromBuffer(fileBuffer);
    if (!fileType?.mime.startsWith('image/')) {
      await fs.promises.unlink(req.file.path); // Limpiar archivo temporal
      return res.status(400).json({ message: "El archivo no es una imagen válida" });
    }

    // Crear objeto file compatible con tu servicio R2
    const r2File = {
      originalname: req.file.originalname,
      buffer: fileBuffer,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path // Para limpieza posterior
    };

    const result = await uploadImageToR2(r2File);

    // Limpiar archivo temporal después de subir a R2
    try {
      await fs.promises.unlink(req.file.path);
    } catch (cleanupError) {
      console.error('Error cleaning temp file:', cleanupError);
    }

    res.status(200).json({
      public_id: result.public_id,
      secure_url: result.secure_url,
    });
  } catch (error) {
    // Limpieza en caso de error
    if (req.file?.path) {
      try {
        await fs.promises.unlink(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning temp file on error:', cleanupError);
      }
    }

    console.error("Error in uploadImage:", error);
    res.status(500).json({
      message: "Error uploading image",
      error: process.env.NODE_ENV === 'production' ? undefined : error.message,
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
