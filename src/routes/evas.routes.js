import { Router } from "express";
import {
  getEvas,
  createEva,
  deleteEva,
  getEva,
  updateEva,
  getEvaByCategory,
  getEvaByLocation
} from "../controllers/evas.controller.js";

const router = Router();

router.get("/", getEvas);
router.post("/", createEva);

router.get("/:id", getEva);
router.delete("/:id", deleteEva);
router.put("/:id", updateEva);

router.get("/category/:categoryName", getEvaByCategory)
router.get("/location/:locationName", getEvaByLocation)

export default router;
