import Eva from "../models/eva.model.js";
import { deleteImageFromR2, deleteVideoFromR2 } from "../libs/r2-service.js";

export const getEvas = async (req, res) => {
  try {
    const evas = await Eva.find();
    res.json(evas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const createEva = async (req, res) => {
  const {
    name,
    detailLocation,
    isActive,
    category,
    wttp,
    description,
    images,
    videos,
  } = req.body;

  try {
    const newEva = new Eva({
      name,
      detailLocation,
      isActive,
      category,
      wttp,
      description,
      images,
      videos,
    });

    const savedEva = await newEva.save();
    res.json(savedEva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteEva = async (req, res) => {
  try {
    const eva = await Eva.findById(req.params.id);

    if (!eva) {
      return res.status(404).json({ message: "Eva no encontrado" });
    }

    const deleteImagePromises = eva.images.map((img) =>
      deleteImageFromR2(img.public_id)
        .then(() => console.log(`Imagen ${img.public_id} eliminada de R2`))
        .catch((error) => {
          console.error(
            `Error eliminando imagen ${img.public_id} de R2:`,
            error,
          );
        }),
    );

    const deleteVideoPromises =
      eva.videos?.map((video) =>
        deleteVideoFromR2(video.public_id)
          .then(() => console.log(`Video ${video.public_id} eliminado de R2`))
          .catch((error) => {
            console.error(
              `Error eliminando video ${video.public_id} de R2:`,
              error,
            );
          }),
      ) || [];

    await Promise.all([...deleteImagePromises, ...deleteVideoPromises]);

    const deletedEva = await Eva.findByIdAndDelete(req.params.id);

    res.json({
      message: "Eva, imágenes y videos eliminados correctamente de R2",
      event: deletedEva,
    });
  } catch (error) {
    console.error("Error en deleteEva:", error);
    res.status(500).json({
      message: "Error al eliminar el eva de R2",
      error: error.message,
    });
  }
};
const filterPublicStories = (eva) => {
  if (!eva) return eva;
  const obj = eva.toObject ? eva.toObject() : eva;
  obj.stories = (obj.stories || []).filter(
    (s) =>
      s.status === "approved" &&
      (!s.expiresAt || new Date(s.expiresAt) > new Date()),
  );
  return obj;
};

export const getEva = async (req, res) => {
  try {
    const eva = await Eva.findById(req.params.id);
    if (!eva) return res.status(404).json({ message: "Eva not found" });
    res.json(filterPublicStories(eva));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateEva = async (req, res) => {
  try {
    const eva = await Eva.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!eva) return res.status(404).json({ message: "Eva not found" });
    res.json(eva);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getEvasByProvince = async (req, res) => {
  try {
    const { province } = req.params;
    const evas = await Eva.find({
      "detailLocation.province": province,
      isActive: true,
      status: "approved",
    });
    res.json(evas.map(filterPublicStories));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const approveEva = async (req, res) => {
  try {
    const eva = await Eva.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true },
    );
    if (!eva) return res.status(404).json({ message: "Eva not found" });
    res.json(eva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvaImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { public_id } = req.query;
    if (!public_id) {
      return res.status(400).json({ message: "Falta public_id" });
    }

    const eva = await Eva.findById(id);
    if (!eva) {
      return res.status(404).json({ message: "Eva no encontrada" });
    }

    const exists = eva.images.some((img) => img.public_id === public_id);
    if (!exists) {
      return res
        .status(404)
        .json({ message: "Esa imagen no pertenece a esta Eva" });
    }

    await deleteImageFromR2(public_id);

    const updated = await Eva.findByIdAndUpdate(
      id,
      { $pull: { images: { public_id } } },
      { new: true },
    );

    res.json(updated);
  } catch (error) {
    console.error("Error eliminando imagen de eva:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvaVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { public_id } = req.query;
    if (!public_id) {
      return res.status(400).json({ message: "Falta public_id" });
    }

    const eva = await Eva.findById(id);
    if (!eva) {
      return res.status(404).json({ message: "Eva no encontrada" });
    }

    const exists = eva.videos.some((v) => v.public_id === public_id);
    if (!exists) {
      return res
        .status(404)
        .json({ message: "Ese video no pertenece a esta Eva" });
    }

    await deleteVideoFromR2(public_id);

    const updated = await Eva.findByIdAndUpdate(
      id,
      { $pull: { videos: { public_id } } },
      { new: true },
    );

    res.json(updated);
  } catch (error) {
    console.error("Error eliminando video de eva:", error);
    res.status(500).json({ message: error.message });
  }
};

export const setEvaCoverImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ message: "Falta public_id" });
    }

    const eva = await Eva.findById(id);
    if (!eva) {
      return res.status(404).json({ message: "Eva no encontrada" });
    }

    const index = eva.images.findIndex((img) => img.public_id === public_id);
    if (index === -1) {
      return res
        .status(404)
        .json({ message: "Esa imagen no pertenece a esta Eva" });
    }

    if (index === 0) {
      return res.json(eva);
    }

    const [cover] = eva.images.splice(index, 1);
    eva.images.unshift(cover);
    await eva.save();

    res.json(eva);
  } catch (error) {
    console.error("Error seteando portada:", error);
    res.status(500).json({ message: error.message });
  }
};

export const approveEvaStory = async (req, res) => {
  try {
    const { id, storyId } = req.params;
    const eva = await Eva.findById(id);
    if (!eva) return res.status(404).json({ message: "Eva no encontrada" });

    const story = eva.stories.id(storyId);
    if (!story) {
      return res.status(404).json({ message: "Historia no encontrada" });
    }

    story.status = "approved";
    await eva.save();

    res.json(eva);
  } catch (error) {
    console.error("Error aprobando historia:", error);
    res.status(500).json({ message: error.message });
  }
};

export const rejectEvaStory = async (req, res) => {
  try {
    const { id, storyId } = req.params;
    const eva = await Eva.findById(id);
    if (!eva) return res.status(404).json({ message: "Eva no encontrada" });

    const story = eva.stories.id(storyId);
    if (!story) {
      return res.status(404).json({ message: "Historia no encontrada" });
    }

    if (story.type === "video") {
      await deleteVideoFromR2(story.public_id);
    } else {
      await deleteImageFromR2(story.public_id);
    }

    story.deleteOne();
    await eva.save();

    res.json(eva);
  } catch (error) {
    console.error("Error rechazando historia:", error);
    res.status(500).json({ message: error.message });
  }
};
