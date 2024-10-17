import { Router } from 'express';
import { sendEmail } from '../controllers/email.controller.js';

const router = Router();

// Ruta para enviar correo
router.post('/send-email', sendEmail);

export default router;
