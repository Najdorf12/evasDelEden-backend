import multer from 'multer';

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, etc.)!'), false);
  }
};

const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de video (MP4, MOV, etc.)!'), false);
  }
};

const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB para imágenes
  },
  fileFilter: imageFilter
});

// Configuración para videos
const uploadVideo = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB para videos 
  },
  fileFilter: videoFilter
});

export const uploadSingleImage = uploadImage.single('image');
export const uploadSingleVideo = uploadVideo.single('video');