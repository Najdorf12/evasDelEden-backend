import { Router } from "express";
import {
  getMyEva,
  createMyEva,
  updateMyEva,
  deleteMyEva,
  deleteMyEvaImage,
  deleteMyEvaVideo,
  setMyEvaCoverImage,
  addMyEvaStory,
  deleteMyEvaStory,
} from "../controllers/evaModelo.controller.js";
import { modeloAuthRequired } from "../middlewares/validateModeloToken.js";

const router = Router();

router.get("/me", modeloAuthRequired, getMyEva);
router.post("/", modeloAuthRequired, createMyEva);
router.put("/", modeloAuthRequired, updateMyEva);
router.delete("/", modeloAuthRequired, deleteMyEva);
router.delete("/image", modeloAuthRequired, deleteMyEvaImage);
router.delete("/video", modeloAuthRequired, deleteMyEvaVideo);
router.patch("/cover-image", modeloAuthRequired, setMyEvaCoverImage);
router.post("/story", modeloAuthRequired, addMyEvaStory);
router.delete("/story", modeloAuthRequired, deleteMyEvaStory);

export default router;
