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
            error
          );
        })
    );

    const deleteVideoPromises =
      eva.videos?.map((video) =>
        deleteVideoFromR2(video.public_id)
          .then(() => console.log(`Video ${video.public_id} eliminado de R2`))
          .catch((error) => {
            console.error(
              `Error eliminando video ${video.public_id} de R2:`,
              error
            );
          })
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

export const getEva = async (req, res) => {
  const eva = await Eva.findById(req.params.id);
  try {
    if (!eva) return res.status(404).json({ message: "Eva not found" });
    res.json(eva);
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
    });
    res.json(evas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

/* export const deleteOneImage = async (req, res) => {
  const { img: public_id } = req.params;

  try {
    if (!public_id) {
      return res
        .status(400)
        .json({ message: "Falta el public_id de la imagen" });
    }

    await deleteImage(public_id);

    await Eva.updateMany(
      { "images.public_id": public_id },
      { $pull: { images: { public_id: public_id } } }
    );

    return res.status(200).json({ message: "Imagen eliminada correctamente" });
  } catch (error) {
    console.error("Error al procesar la eliminación de la imagen:", error);
    return res.status(500).json({ message: "Error al eliminar la imagen" });
  }
};

export const deleteOneVideo = async (req, res) => {
  const { video: public_id } = req.params;

  try {
    if (!public_id) {
      return res.status(400).json({ message: "Falta el public_id del video" });
    }

    await deleteVideo(public_id);

    await Eva.updateMany(
      { "videos.public_id": public_id },
      { $pull: { videos: { public_id: public_id } } }
    );

    return res.status(200).json({ message: "Video eliminado correctamente" });
  } catch (error) {
    console.error("Error al procesar la eliminación del video:", error);
    return res.status(500).json({ message: "Error al eliminar el video" });
  }
};
 */
