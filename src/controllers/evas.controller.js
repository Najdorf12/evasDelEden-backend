import Eva from "../models/eva.model.js";

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
  const { name, location, age, isActive, category, wttp, description, images } =
    req.body;

  try {
    const newEva = new Eva({
      name,
      location,
      age,
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

export const getEvaByCategory = async (req, res) => {
  const category = req.params.categoryName;
  try {
    const evas = await Eva.find();
    const evasFilter = evas.filter((eva) => eva.category === category);
    if (!evasFilter) return res.status(404).json({ message: "Evas not found" });

    res.json(evasFilter);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
