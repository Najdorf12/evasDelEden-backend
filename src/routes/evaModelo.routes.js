import { Router } from "express";
import {
  getMyEva,
  createMyEva,
  updateMyEva,
  deleteMyEva,
} from "../controllers/evaModelo.controller.js";
import { modeloAuthRequired } from "../middlewares/validateModeloToken.js";

const router = Router();

router.get("/me", modeloAuthRequired, getMyEva);
router.post("/", modeloAuthRequired, createMyEva);
router.put("/", modeloAuthRequired, updateMyEva);
router.delete("/", modeloAuthRequired, deleteMyEva);

export default router;