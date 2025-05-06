import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';

const storage = multer.memoryStorage();

// Validación mejorada de tipos de archivo
const validateFileType = async (buffer, mimeType, expectedTypes) => {
  const type = await fileTypeFromBuffer(buffer);
  return type && expectedTypes.some(t => mimeType.startsWith(t) || type.mime.startsWith(t));
};

// Filtro mejorado para imágenes
const imageFilter = async (req, file, cb) => {
  try {
    const isValid = await validateFileType(file.buffer, file.mimetype, ['image/']);
    cb(null, isValid);
  } catch (error) {
    cb(new Error('Error verifying image file type'), false);
  }
};

// Filtro mejorado para videos
const videoFilter = async (req, file, cb) => {
  try {
    const isValid = await validateFileType(file.buffer, file.mimetype, ['video/']);
    cb(null, isValid);
  } catch (error) {
    cb(new Error('Error verifying video file type'), false);
  }
};

// Configuración optimizada para imágenes
const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // Aumentado a 50MB para imágenes
    files: 10 // Máximo de archivos
  },
  fileFilter: imageFilter
});

// Configuración optimizada para videos
const uploadVideo = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // Aumentado a 500MB para videos
    files: 5
  },
  fileFilter: videoFilter
});

// Middlewares exportados
export const uploadSingleImage = uploadImage.single('image');
export const uploadMultipleImages = uploadImage.array('images', 10);
export const uploadSingleVideo = uploadVideo.single('video');
export const uploadMultipleVideos = uploadVideo.array('videos', 5);