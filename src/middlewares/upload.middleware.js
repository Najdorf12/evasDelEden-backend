import multer from "multer";
import path from "path";
import { fileTypeFromBuffer, fileTypeFromFile } from "file-type";
import { promises as fs } from "fs";

// Configuración para almacenamiento temporal (crítico para Vercel)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp'); // Vercel solo permite escribir en /tmp
  },
  filename: async (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Función mejorada para manejo de tipos de archivo
const handleFileFilter = async (req, file, cb, expectedType) => {
  try {
    // Verificación inicial por mimetype
    if (!file.mimetype.startsWith(`${expectedType}/`)) {
      return cb(new Error(`El archivo debe ser de tipo ${expectedType}`), false);
    }

    // Verificación profunda del tipo de archivo
    let type;
    if (file.path) {
      // Cuando usamos diskStorage, verificamos el archivo temporal
      type = await fileTypeFromFile(file.path);
    } else if (file.buffer) {
      // Fallback para memoryStorage
      type = await fileTypeFromBuffer(file.buffer);
    }

    if (!type?.mime.startsWith(`${expectedType}/`)) {
      // Limpiar archivo temporal si existe
      if (file.path) await fs.unlink(file.path).catch(() => {});
      return cb(new Error(`El archivo no es un ${expectedType} válido`), false);
    }

    cb(null, true);
  } catch (error) {
    console.error(`Error en ${expectedType}Filter:`, error);
    if (file.path) await fs.unlink(file.path).catch(() => {});
    cb(new Error(`Error al verificar el tipo de archivo`), false);
  }
};

// Configuración mejorada para Multer
const createUploader = (options) => {
  const upload = multer({
    storage: storage, // Usamos diskStorage en lugar de memoryStorage
    limits: {
      fileSize: options.limits.fileSize,
      files: options.limits.files,
      fieldSize: options.limits.fileSize // Añadido para campos de formulario grandes
    },
    fileFilter: (req, file, cb) => handleFileFilter(req, file, cb, options.expectedType)
  });

  return async (req, res, next) => {
    const middleware = upload.single(options.fieldName);
    
    middleware(req, res, async (err) => {
      if (err) {
        // Limpieza de archivos temporales en caso de error
        if (req.file?.path) {
          await fs.unlink(req.file.path).catch(() => {});
        }

        const statusCode = err instanceof multer.MulterError ? 413 : 400;
        return res.status(statusCode).json({
          success: false,
          message: err.message,
          error: err.code || "FILE_VALIDATION_ERROR",
        });
      }
      next();
    });
  };
};

// Middlewares exportados con configuración optimizada
export const uploadSingleImage = createUploader({
  fieldName: "image",
  expectedType: "image",
  limits: {
    fileSize: 120 * 1024 * 1024, // Aumentado a 120MB
    files: 1 // Reducido a 1 archivo por vez para mejor manejo
  }
});

export const uploadSingleVideo = createUploader({
  fieldName: "video",
  expectedType: "video",
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
    files: 1
  }
});