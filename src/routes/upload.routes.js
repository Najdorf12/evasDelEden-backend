import { Router } from "express";
import { 
  generatePresignedUrlController,
  saveFileReference,
  deleteImage, 
  deleteVideo 
} from '../controllers/cloudflare.controller.js';

const router = Router();

// Ruta para generar URLs firmadas
router.post('/generate-presigned-url', generatePresignedUrlController);

// Ruta para guardar referencias
router.post('/save-reference', saveFileReference);

// Rutas para eliminar
router.delete('/image/:public_id', deleteImage);
router.delete('/video/:public_id', deleteVideo);

export default router;