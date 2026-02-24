import Service from "../models/service.models.js";
import Category from "../models/category.models.js";

export const createService = async (req, res, next) => {
  try {
    const { categoryId, name, bannerImage, description } = req.body;

    const category = await Category.findById(categoryId);
    if (!category || !category.active) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const service = await Service.create({
      categoryId,
      name,
      bannerImage,
      description,
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

export const getServicesByCategory = async (req, res, next) => {
    try {
      const { categoryId } = req.params;
  
      const services = await Service.find({
        categoryId,
        active: true,
      }).lean();
  
      res.json({ success: true, data: services });
    } catch (error) {
      next(error);
    }
};

export const updateService = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const service = await Service.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
  
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
  
      res.json({ success: true, data: service });
    } catch (error) {
      next(error);
    }
};

export const deleteService = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      await Service.findByIdAndUpdate(id, { active: false });
  
      res.json({ success: true, message: "Service disabled" });
    } catch (error) {
      next(error);
    }
};