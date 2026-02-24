import Area from "../models/area.models.js";

export const createArea = async (req, res, next) => {
  try {
    const { name, extraCharge } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Area name required" });
    }

    const exists = await Area.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Area already exists" });
    }

    const area = await Area.create({
      name,
      extraCharge: extraCharge || 0,
    });

    res.status(201).json({
      success: true,
      data: area,
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveAreas = async (req, res, next) => {
    try {
      const areas = await Area.find({ active: true })
        .sort({ name: 1 })
        .lean();
  
      res.json({
        success: true,
        data: areas,
      });
    } catch (error) {
      next(error);
    }
};

export const getAllAreas = async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
  
      const skip = (page - 1) * limit;
  
      const areas = await Area.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));
  
      const total = await Area.countDocuments();
  
      res.json({
        success: true,
        data: areas,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
};

export const updateArea = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const area = await Area.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
  
      if (!area) {
        return res.status(404).json({ message: "Area not found" });
      }
  
      res.json({
        success: true,
        data: area,
      });
    } catch (error) {
      next(error);
    }
};

export const deleteArea = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const area = await Area.findByIdAndUpdate(
        id,
        { active: false },
        { new: true }
      );
  
      if (!area) {
        return res.status(404).json({ message: "Area not found" });
      }
  
      res.json({
        success: true,
        message: "Area disabled successfully",
      });
    } catch (error) {
      next(error);
    }
};