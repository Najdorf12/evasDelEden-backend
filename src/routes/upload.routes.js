import { Router } from "express";
import { uploadSingleImage, uploadSingleVideo } from '../middlewares/upload.middleware.js';
import { uploadImage, deleteImage, uploadVideo, deleteVideo } from '../controllers/cloudflare.controller.js';

const router = Router();

router.post('/image', uploadSingleImage, uploadImage);
router.post('/video', uploadSingleVideo, uploadVideo);
router.delete("/image", deleteImage);
router.delete("/video", deleteVideo);

export default router;