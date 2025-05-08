import { Router } from "express";
import { 
  generatePresignedUrlController,
  saveFileReference,
  deleteImage, 
  deleteVideo 
} from '../controllers/cloudflare.controller.js';

const router = Router();

// Prefija todas las rutas con /upload
router.post('/upload/generate-presigned-url', generatePresignedUrlController);
router.post('/upload/save-reference', saveFileReference);
router.delete('/upload/image/:public_id', deleteImage);
router.delete('/upload/video/:public_id', deleteVideo);

export default router;