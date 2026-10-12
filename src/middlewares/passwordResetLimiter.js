import rateLimit from "express-rate-limit";

/* Ubicación sugerida: backend/middlewares/passwordResetLimiter.js
   Limita los pedidos de recuperación por IP (5 cada 15 minutos). */
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    res
      .status(429)
      .json(["Demasiados intentos. Probá de nuevo en unos minutos."]),
});
