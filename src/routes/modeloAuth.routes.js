import { Router } from "express";
import {
  register,
  login,
  logout,
  profile,
  verifyToken,
} from "../controllers/modeloAuth.controller.js";
import { modeloAuthRequired } from "../middlewares/validateModeloToken.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/modeloAuth.controller.js";
import { passwordResetLimiter } from "../middlewares/passwordResetLimiter.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", verifyToken);
router.get("/profile", modeloAuthRequired, profile);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password/:token", passwordResetLimiter, resetPassword);

export default router;
