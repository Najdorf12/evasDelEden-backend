import Eva from "../models/eva.model.js";
import Modelo from "../models/modelo.model.js";

export const getMyEva = async (req, res) => {
  try {
    const eva = await Eva.findOne({ owner: req.modelo.id });
    res.json(eva); // null si todavía no cargó nada
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const createMyEva = async (req, res) => {
  const { name, detailLocation, category, wttp, description, images, videos, isActive } =
    req.body;

  try {
    const existing = await Eva.findOne({ owner: req.modelo.id });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Ya tenés un perfil cargado. Usá editar en vez de crear uno nuevo." });
    }

    const newEva = new Eva({
      name,
      detailLocation,
      category,
      wttp,
      description,
      images,
      videos,
      owner: req.modelo.id,
      isActive: isActive ?? true,
    });

    const savedEva = await newEva.save();
    await Modelo.findByIdAndUpdate(req.modelo.id, { eva: savedEva._id });

    res.json(savedEva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateMyEva = async (req, res) => {
  try {
    const eva = await Eva.findOne({ owner: req.modelo.id });
    if (!eva) {
      return res.status(404).json({ message: "Todavía no tenés un perfil cargado" });
    }

    const { name, detailLocation, category, wttp, description, images, videos, isActive } =
      req.body;

    const updated = await Eva.findByIdAndUpdate(
      eva._id,
      { name, detailLocation, category, wttp, description, images, videos, isActive },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};