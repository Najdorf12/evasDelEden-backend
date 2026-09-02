import { Router } from "express";
import {
  getEvas,
  getEvasByProvince,
  createEva,
  deleteEva,
  getEva,
  updateEva,
  approveEva
} from "../controllers/evas.controller.js";

const router = Router();

router.get("/", getEvas);
router.post("/", createEva);
router.get("/:id", getEva); 
router.delete("/:id", deleteEva);
router.put("/:id", updateEva);
router.get("/by-province/:province", getEvasByProvince);
router.patch("/:id/approve", approveEva);

export default router;