import multer from "multer";
import path from "path";
import { fileTypeFromFile } from "file-type";
import { promises as fs } from "fs";

// Configuración de almacenamiento temporal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `upload-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

// Verificación de tipo de archivo optimizada
const verifyFileType = async (file, expectedType) => {
  try {
    if (!file.mimetype.startsWith(`${expectedType}/`)) {
      return false;
    }
    
    const type = await fileTypeFromFile(file.path);
    return type?.mime.startsWith(`${expectedType}/`);
  } catch (error) {
    console.error('File verification error:', error);
    return false;
  }
};

// Middleware factory actualizado
const createUploader = (options) => {
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: options.limits.fileSize,
      files: options.limits.files
    }
  });

  return async (req, res, next) => {
    upload.single(options.fieldName)(req, res, async (err) => {
      if (err) {
        if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
        
        const statusCode = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
        return res.status(statusCode).json({
          success: false,
          message: err.code === 'LIMIT_FILE_SIZE' 
            ? `El archivo excede el límite de ${options.limits.fileSize/1024/1024}MB` 
            : err.message
        });
      }

      if (!(await verifyFileType(req.file, options.expectedType))) {
        await fs.unlink(req.file.path).catch(() => {});
        return res.status(400).json({
          success: false,
          message: `Tipo de archivo no válido. Se esperaba ${options.expectedType}`
        });
      }

      next();
    });
  };
};

export const uploadSingleImage = createUploader({
  fieldName: "image",
  expectedType: "image",
  limits: {
    fileSize: 120 * 1024 * 1024, // 120MB
    files: 1
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