import { Router } from "express";
import {
  getCommentsByEva,
  createComment,
  hideComment,
  deleteComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.get("/eva/:evaId", getCommentsByEva);
router.post("/eva/:evaId", createComment);

router.patch("/:id/hide", hideComment);
router.delete("/:id", deleteComment);

export default router;