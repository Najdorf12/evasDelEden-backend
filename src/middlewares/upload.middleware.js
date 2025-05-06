import multer from "multer";
import { fileTypeFromBuffer } from "file-type";

const storage = multer.memoryStorage();

// Versión más robusta del filtro de imágenes
const imageFilter = async (req, file, cb) => {
  try {
    // Permitir si el mimetype ya indica que es imagen
    if (file.mimetype.startsWith("image/")) {
      return cb(null, true);
    }

    // Verificación adicional del buffer solo si es necesario
    if (file.buffer && file.buffer.length > 0) {
      const type = await fileTypeFromBuffer(file.buffer);
      if (type && type.mime.startsWith("image/")) {
        return cb(null, true);
      }
    }

    cb(
      new Error("Solo se permiten archivos de imagen (JPEG, PNG, etc.)"),
      false
    );
  } catch (error) {
    console.error("Error en imageFilter:", error);
    cb(new Error("Error al verificar el tipo de imagen"), false);
  }
};

// Versión más robusta del filtro de videos
const videoFilter = async (req, file, cb) => {
  try {
    // Permitir si el mimetype ya indica que es video
    if (file.mimetype.startsWith("video/")) {
      return cb(null, true);
    }

    // Verificación adicional del buffer solo si es necesario
    if (file.buffer && file.buffer.length > 0) {
      const type = await fileTypeFromBuffer(file.buffer);
      if (type && type.mime.startsWith("video/")) {
        return cb(null, true);
      }
    }

    cb(new Error("Solo se permiten archivos de video (MP4, MOV, etc.)"), false);
  } catch (error) {
    console.error("Error en videoFilter:", error);
    cb(new Error("Error al verificar el tipo de video"), false);
  }
};

// Configuración para imágenes
const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB para imágenes
    files: 10,
  },
  fileFilter: imageFilter,
});

// Configuración para videos
const uploadVideo = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB para videos
    files: 5,
  },
  fileFilter: videoFilter,
});

// Middlewares exportados
export const uploadSingleImage = (req, res, next) => {
  uploadImage.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
        error:
          err instanceof multer.MulterError
            ? err.code
            : "FILE_VALIDATION_ERROR",
      });
    }
    next();
  });
};

export const uploadSingleVideo = (req, res, next) => {
  uploadVideo.single("video")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
        error:
          err instanceof multer.MulterError
            ? err.code
            : "FILE_VALIDATION_ERROR",
      });
    }
    next();
  });
};
