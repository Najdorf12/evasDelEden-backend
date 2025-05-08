import multer from "multer";
import { fileTypeFromBuffer } from "file-type";

// Configuración optimizada de almacenamiento
const storage = multer.memoryStorage();

// Función mejorada para manejo de streams
const handleFileFilter = async (req, file, cb, expectedType) => {
  try {
    // Verificación rápida por mimetype
    if (file.mimetype.startsWith(`${expectedType}/`)) {
      return cb(null, true);
    }

    // Verificación profunda del buffer
    if (file.buffer && file.buffer.length > 0) {
      const type = await fileTypeFromBuffer(file.buffer);
      if (type?.mime.startsWith(`${expectedType}/`)) {
        return cb(null, true);
      }
    }

    cb(new Error(`Solo se permiten archivos de ${expectedType}`), false);
  } catch (error) {
    console.error(`Error en ${expectedType}Filter:`, error);
    cb(new Error(`Error al verificar el tipo de ${expectedType}`), false);
  }
};

// Configuración para Multer
const createUploader = (options) => {
  const upload = multer({
    storage: storage,
    limits: options.limits,
    fileFilter: (req, file, cb) => handleFileFilter(req, file, cb, options.expectedType)
  });

  return (req, res, next) => {
    const middleware = upload.single(options.fieldName);
    middleware(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
          error: err instanceof multer.MulterError ? err.code : "FILE_VALIDATION_ERROR",
        });
      }
      next();
    });
  };
};

// Middlewares exportados
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