import { Router } from "express";
import {
  getEvas,
  createEva,
  deleteEva,
  getEva,
  updateEva,
  getEvasByCategory,
  getEvasByCategoryFilter,
  getEvaByLocation,
  deleteOneImage,
  deleteOneVideo,
} from "../controllers/evas.controller.js";

const router = Router();

router.get("/evas", getEvasByCategoryFilter);
router.get("/category/:categoryName", getEvasByCategory);
router.get("/location/:locationName", getEvaByLocation);

router.get("/", getEvas);
router.post("/", createEva);

router.get("/:id", getEva); 
router.delete("/:id", deleteEva);
router.put("/:id", updateEva);

router.delete("/delete-image/:img(*)", deleteOneImage);
router.delete("/delete-video/:video(*)", deleteOneVideo);

export default router;
