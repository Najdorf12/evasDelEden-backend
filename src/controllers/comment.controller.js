import Comment from "../models/comment.model.js";
import Eva from "../models/eva.model.js";

export const getCommentsByEva = async (req, res) => {
  try {
    const { evaId } = req.params;
    const comments = await Comment.find({ eva: evaId, hidden: false })
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { evaId } = req.params;
    const { name, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "El comentario no puede estar vacío" });
    }
    if (text.length > 500) {
      return res.status(400).json({ message: "Comentario demasiado largo" });
    }

    const eva = await Eva.findById(evaId);
    if (!eva) {
      return res.status(404).json({ message: "Eva no encontrada" });
    }

    const comment = await Comment.create({
      eva: evaId,
      name: name?.trim().slice(0, 60) || "Anónimo",
      text: text.trim(),
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Para el admin, opcional: ocultar sin borrar
export const hideComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { hidden: true },
      { new: true },
    );
    if (!comment) return res.status(404).json({ message: "Comentario no encontrado" });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const deleted = await Comment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Comentario no encontrado" });
    res.json({ message: "Comentario eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};