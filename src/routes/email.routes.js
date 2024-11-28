import { Router } from "express";
import { sendEmail } from "../controllers/email.controller.js";

const router = Router();

// Rutas específicas para email
router.post("/", sendEmail); // No añadas más subrutas aquí si no es necesario

export default router;