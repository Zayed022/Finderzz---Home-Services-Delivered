import SubService from "../models/subService.models.js";
import Service from "../models/service.models.js";
import Process from "../models/process.models.js"
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
      withMaterial,
      processSteps // ✅ NEW (optional)
    } = req.body;

    // ✅ VALIDATIONS
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

    // ✅ CREATE SUB SERVICE FIRST
    const customerPrice = workerPrice + platformFee;

    let subService = await SubService.create({
      serviceId,
      name,
      description,
      workerPrice,
      platformFee,
      customerPrice,
      durationEstimate,
      withMaterial,
    });

    // =====================================================
    // ✅ OPTIONAL: CREATE PROCESS IF PROVIDED
    // =====================================================
    if (processSteps && Array.isArray(processSteps)) {

      if (processSteps.length === 0) {
        return res.status(400).json({
          message: "Process steps cannot be empty if provided",
        });
      }

      // validate each step
      for (const step of processSteps) {
        if (!step.stepNumber || !step.title || !step.description) {
          return res.status(400).json({
            message: "Each process step must have stepNumber, title, description",
          });
        }
      }

      const process = await Process.create({
        subServiceId: subService._id,
        steps: processSteps,
      });

      // link process to subService
      subService.processId = process._id;
      await subService.save();
    }

    // ✅ FETCH WITH PROCESS (OPTIONAL BUT BETTER)
    subService = await SubService.findById(subService._id)
      .populate("processId");

    res.status(201).json({
      success: true,
      data: subService,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllSubService = async (req, res, next) => {
    try {
      const subServices = await SubService.find({  })
        .sort({ order: 1 })
        .lean();
  
      res.json({ success: true, data: subServices });
    } catch (error) {
      next(error);
    }
};

export const getSubServicesByService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const { withMaterial } = req.query;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID"
      });
    }

    const filter = {
      serviceId,
      active: true,
      ...(withMaterial !== undefined && {
        withMaterial: withMaterial === "true"
      })
    };

    const subServices = await SubService.find(filter)
      .select("name description customerPrice durationEstimate withMaterial processId")
      .lean();

    const enriched = subServices.map(s => {
      const withMat = s.withMaterial ?? false;

      return {
        ...s,
        withMaterial: withMat,
        materialLabel: withMat
          ? "Material Included"
          : "Material Not Included",
        badgeType: withMat ? "included" : "excluded",

        // ✅ NEW: Process indicator
        hasProcess: !!s.processId
      };
    });

    res.json({
      success: true,
      data: enriched
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
      processSteps // ✅ NEW
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid subservice ID" });
    }

    const subService = await SubService.findById(id);

    if (!subService) {
      return res.status(404).json({ message: "SubService not found" });
    }

    // =========================
    // ✅ BASIC FIELD UPDATES
    // =========================
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

    // ✅ Always recalculate
    subService.customerPrice =
      subService.workerPrice + subService.platformFee;

    await subService.save();

    // =====================================================
    // 🔥 PROCESS HANDLING
    // =====================================================
    if (processSteps !== undefined) {

      // ❌ CASE 1: DELETE PROCESS
      if (Array.isArray(processSteps) && processSteps.length === 0) {
        if (subService.processId) {
          await Process.findByIdAndDelete(subService.processId);
          subService.processId = null;
          await subService.save();
        }
      }

      // ✅ CASE 2: CREATE OR UPDATE PROCESS
      else if (Array.isArray(processSteps)) {

        // validation
        for (const step of processSteps) {
          if (!step.stepNumber || !step.title || !step.description) {
            return res.status(400).json({
              message: "Each step must have stepNumber, title, description",
            });
          }
        }

        // optional: unique step numbers
        const stepNumbers = processSteps.map(s => s.stepNumber);
        if (new Set(stepNumbers).size !== stepNumbers.length) {
          return res.status(400).json({
            message: "Step numbers must be unique",
          });
        }

        // 🔄 UPDATE EXISTING
        if (subService.processId) {
          await Process.findByIdAndUpdate(
            subService.processId,
            { steps: processSteps },
            { new: true }
          );
        }

        // ➕ CREATE NEW
        else {
          const process = await Process.create({
            subServiceId: subService._id,
            steps: processSteps,
          });

          subService.processId = process._id;
          await subService.save();
        }
      }
    }

    // ✅ FINAL RESPONSE WITH PROCESS
    const updated = await SubService.findById(subService._id)
      .populate("processId");

    res.json({
      success: true,
      data: updated,
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

export const getSubServiceById = async (req, res, next) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid SubService ID"
      });
    }

    const subService = await SubService.findById(id)
    .populate("processId")
    .lean();

    if (!subService) {
      return res.status(404).json({
        success: false,
        message: "SubService not found"
      });
    }

    res.status(200).json({
      success: true,
      data: subService
    });

  } catch (error) {
    next(error);
  }
};