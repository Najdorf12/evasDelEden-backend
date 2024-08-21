import { Router } from "express";
import { getEvas, createEva, deleteEva } from "../controllers/evas.controller.js";

const router = Router();

router.get("/", getEvas);
router.post("/", createEva);
router.delete("/:id",deleteEva);

export default router; 