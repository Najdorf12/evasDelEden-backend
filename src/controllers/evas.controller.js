import Eva from "../models/eva.model.js";
import { deleteImage } from "../libs/cloudinary.js";

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
  const { name, location, isActive, category, wttp, description, images } =
    req.body;

  try {
    const newEva = new Eva({
      name,
      location,
      isActive,
      category,
      wttp,
      description,
      images,
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
    const eva = await Eva.findByIdAndDelete(req.params.id);

    if (!eva) {
      return res.status(404).json({ message: error.message });
    }

    if (eva.images.length > 0) {
      for (const img of eva.images) {
        try {
          await deleteImage(img.public_id); // Delete each image one by one
          console.log(`Deleted image with id: ${img.public_id}`);
        } catch (error) {
          console.error(
            `Failed to delete image ${img.public_id}: ${error.message}`
          );
        }
      }
    }

    res.json(eva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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

export const getEvasByCategory = async (req, res) => {
  const category = req.params.categoryName;
  try {
    // Filtrar directamente en la consulta de MongoDB
    const evas = await Eva.find({ category });
    
    if (!evas.length) {
      return res.status(404).json({ message: "GetEvasByCategory not found" });
    }
    res.json(evas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getEvaByLocation = async (req, res) => {
  const location = req.params.locationName;
  try {
    // Filtrar directamente en la consulta de MongoDB
    const evas = await Eva.find({ location });
    
    if (!evas.length) {
      return res.status(404).json({ message: "GetEvasByLocation not found" });
    }
    res.json(evas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getEvasByCategoryFilter = async (req, res) => {
  try {
    // Agrupamos las evas por categoría con aggregate
    const evasByCategory = await Eva.aggregate([
      {
        $match: {
          category: { $in: ["Platinum", "Gold", "Silver"] } // Filtra por estas categorías
        }
      },
      {
        $group: {
          _id: "$category", // Agrupa por el campo "category"
          evas: { $push: "$$ROOT" } // Inserta todas las evas de esa categoría
        }
      }
    ]);

    if (!evasByCategory.length) {
      return res.status(404).json({ message: "No evas found" });
    }

    res.json(evasByCategory); // Devolvemos las evas agrupadas por categoría
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};