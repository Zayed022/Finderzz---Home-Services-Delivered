import SubService from "../models/subService.models.js";
import Service from "../models/service.models.js";
import mongoose from "mongoose";

export const createSubService = async (req, res, next) => {
  try {
    const {
      serviceId,
      name,
      description,
      workerPrice,
      platformFee,
      durationEstimate,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    if (!name || workerPrice == null || platformFee == null) {
      return res.status(400).json({
        message: "Name, workerPrice and platformFee are required",
      });
    }

    if (workerPrice < 0 || platformFee < 0) {
      return res.status(400).json({
        message: "Prices cannot be negative",
      });
    }

    const service = await Service.findById(serviceId).lean();
    if (!service || !service.active) {
      return res.status(400).json({ message: "Invalid service" });
    }

    const customerPrice = workerPrice + platformFee;

    const subService = await SubService.create({
      serviceId,
      name,
      description,
      workerPrice,
      platformFee,
      customerPrice,
      durationEstimate,
    });

    res.status(201).json({
      success: true,
      data: subService,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubServicesByService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const subServices = await SubService.find({
      serviceId,
      active: true,
    })
      .select("name description customerPrice durationEstimate")
      .lean();

    res.json({
      success: true,
      data: subServices,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      workerPrice,
      platformFee,
      durationEstimate,
      active,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid subservice ID" });
    }

    const subService = await SubService.findById(id);

    if (!subService) {
      return res.status(404).json({ message: "SubService not found" });
    }

    if (name !== undefined) subService.name = name;
    if (description !== undefined) subService.description = description;
    if (durationEstimate !== undefined)
      subService.durationEstimate = durationEstimate;
    if (active !== undefined) subService.active = active;

    if (workerPrice !== undefined) {
      if (workerPrice < 0) {
        return res.status(400).json({ message: "Invalid worker price" });
      }
      subService.workerPrice = workerPrice;
    }

    if (platformFee !== undefined) {
      if (platformFee < 0) {
        return res.status(400).json({ message: "Invalid platform fee" });
      }
      subService.platformFee = platformFee;
    }

    // Always recalculate
    subService.customerPrice =
      subService.workerPrice + subService.platformFee;

    await subService.save();

    res.json({
      success: true,
      data: subService,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubService = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid subservice ID" });
    }

    const subService = await SubService.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    if (!subService) {
      return res.status(404).json({ message: "SubService not found" });
    }

    res.json({
      success: true,
      message: "SubService disabled",
    });
  } catch (error) {
    next(error);
  }
};