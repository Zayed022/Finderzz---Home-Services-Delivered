import Service from "../models/service.models.js";
import Category from "../models/category.models.js";
import SubService from "../models/subService.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createService = async (req, res, next) => {
  try {

    const { categoryId, name, description, isPopular } = req.body;

    const category = await Category.findById(categoryId);

    if (!category || !category.active) {
      return res.status(400).json({
        success:false,
        message:"Invalid category"
      });
    }

    /* ---------------- BANNER ---------------- */

    const bannerPath = req.files?.bannerImage?.[0]?.path;

    if (!bannerPath) {
      return res.status(400).json({
        success:false,
        message:"Banner image is required"
      });
    }

    const bannerUploaded = await uploadOnCloudinary(bannerPath);

    if (!bannerUploaded) {
      return res.status(500).json({
        success:false,
        message:"Banner upload failed"
      });
    }

    /* ---------------- ICON ---------------- */

    const iconPath = req.files?.icon?.[0]?.path;

    if (!iconPath) {
      return res.status(400).json({
        success:false,
        message:"Icon image is required"
      });
    }

    const iconUploaded = await uploadOnCloudinary(iconPath);

    if (!iconUploaded) {
      return res.status(500).json({
        success:false,
        message:"Icon upload failed"
      });
    }

    /* ---------------- CREATE SERVICE ---------------- */

    const service = await Service.create({
      categoryId,
      name,
      bannerImage: bannerUploaded.secure_url,
      description,
      icon: iconUploaded.secure_url,
      isPopular
    });

    res.status(201).json({
      success:true,
      data:service
    });

  } catch (error) {
    console.error("Create service error:", error);
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

export const getServices = async (req, res, next) => {
    try {
      const services = await Service.find({  })
        .sort({ order: 1 })
        .lean();
  
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

export const getServiceWithSubServices = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId).lean();

    if (!service || !service.active) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const subServices = await SubService.find({
      serviceId,
      active: true,
    })
      .sort({ createdAt: 1 })
      .lean();

    res.json({
      success: true,
      data: {
        service,
        subServices,
      },
    });
  } catch (error) {
    next(error);
  }
};