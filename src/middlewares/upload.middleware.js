import multer from "multer";
import path from "path";
import { fileTypeFromStream } from "file-type";
import { createWriteStream, unlinkSync } from "fs";
import { pipeline } from "stream/promises";

// Configuración para almacenamiento temporal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp'); // Vercel permite escribir en /tmp
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

// Verificación de tipo de archivo mejorada
const checkFileType = async (filePath, expectedType) => {
  const stream = createReadStream(filePath);
  const type = await fileTypeFromStream(stream);
  await stream.close();
  
  if (!type || !type.mime.startsWith(`${expectedType}/`)) {
    throw new Error(`El archivo no es un ${expectedType} válido`);
  }
};

// Middleware factory mejorado
const createUploader = (options) => {
  const upload = multer({
    storage: storage,
    limits: options.limits,
    fileFilter: async (req, file, cb) => {
      try {
        // Verificación inicial por mimetype
        if (!file.mimetype.startsWith(`${options.expectedType}/`)) {
          throw new Error(`Tipo MIME no válido para ${options.expectedType}`);
        }
        cb(null, true);
      } catch (error) {
        cb(error, false);
      }
    }
  });

  return async (req, res, next) => {
    try {
      // Procesar la subida
      await new Promise((resolve, reject) => {
        upload.single(options.fieldName)(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Verificación adicional del tipo de archivo
      if (req.file) {
        await checkFileType(req.file.path, options.expectedType);
      }

      next();
    } catch (error) {
      // Limpieza de archivos temporales en caso de error
      if (req.file?.path) {
        try {
          unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error('Error limpiando archivo temporal:', cleanupError);
        }
      }

      res.status(400).json({
        success: false,
        message: error.message,
        error: error instanceof multer.MulterError ? error.code : "FILE_VALIDATION_ERROR",
      });
    }
  };
};

export const uploadSingleImage = createUploader({
  fieldName: "image",
  expectedType: "image",
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10
  }
});

export const uploadSingleVideo = createUploader({
  fieldName: "video",
  expectedType: "video",
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
    files: 5
  }
});