import Eva from "../models/eva.model.js";
import Modelo from "../models/modelo.model.js";
import { deleteImageFromR2, deleteVideoFromR2 } from "../libs/r2-service.js";

export const getMyEva = async (req, res) => {
  try {
    const eva = await Eva.findOne({ owner: req.modelo.id });
    res.json(eva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const createMyEva = async (req, res) => {
  const {
    name,
    detailLocation,
    category,
    wttp,
    description,
    images,
    videos,
    isActive,
  } = req.body;
  try {
    const existing = await Eva.findOne({ owner: req.modelo.id });
    if (existing) {
      return res
        .status(400)
        .json({
          message:
            "Ya tenés un perfil cargado. Usá editar en vez de crear uno nuevo.",
        });
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
      status: "pending",
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
      return res
        .status(404)
        .json({ message: "Todavía no tenés un perfil cargado" });
    }
    const {
      name,
      detailLocation,
      category,
      wttp,
      description,
      images,
      videos,
      isActive,
    } = req.body;
    const updated = await Eva.findByIdAndUpdate(
      eva._id,
      {
        name,
        detailLocation,
        category,
        wttp,
        description,
        images,
        videos,
        isActive,
        status: "pending",
      },
      { new: true },
    );
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteMyEva = async (req, res) => {
  try {
    const eva = await Eva.findOne({ owner: req.modelo.id });
    if (!eva) {
      return res
        .status(404)
        .json({ message: "No tenés un perfil para eliminar" });
    }

    const deleteImagePromises = (eva.images || []).map((img) =>
      deleteImageFromR2(img.public_id).catch((error) =>
        console.error(`Error eliminando imagen ${img.public_id} de R2:`, error),
      ),
    );
    const deleteVideoPromises = (eva.videos || []).map((video) =>
      deleteVideoFromR2(video.public_id).catch((error) =>
        console.error(
          `Error eliminando video ${video.public_id} de R2:`,
          error,
        ),
      ),
    );
    await Promise.all([...deleteImagePromises, ...deleteVideoPromises]);

    await Eva.findByIdAndDelete(eva._id);
    await Modelo.findByIdAndUpdate(req.modelo.id, { eva: null });

    res.json({ message: "Perfil eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
