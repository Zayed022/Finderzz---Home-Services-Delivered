import Category from "../models/category.models.js";

export const createCategory = async (req, res, next) => {
  try {
    const { name, icon, description, order } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name required" });
    }

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      icon,
      description,
      order,
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
    try {
      const categories = await Category.find({ active: true })
        .sort({ order: 1 })
        .lean();
  
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const category = await Category.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
  
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      await Category.findByIdAndUpdate(id, { active: false });
  
      res.json({ success: true, message: "Category disabled" });
    } catch (error) {
      next(error);
    }
};