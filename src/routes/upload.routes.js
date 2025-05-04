import { Router } from "express";
import { uploadSingleImage, uploadSingleVideo } from '../middlewares/upload.middleware.js';
import { uploadImage, deleteImage, uploadVideo, deleteVideo } from '../controllers/cloudflare.controller.js';

const router = Router();

router.post('/image', uploadSingleImage, uploadImage);
router.delete('/image/:public_id', deleteImage);

router.post('/video', uploadSingleVideo, uploadVideo);
router.delete('/video/:public_id', deleteVideo);

export default router;
