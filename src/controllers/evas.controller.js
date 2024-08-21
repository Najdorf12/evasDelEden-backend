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

    const savedProduct = await newEva.save();
    res.json(savedProduct);
  
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
   
    res.json(eva);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
