import SubService from "../models/subService.models.js";
import Service from "../models/service.models.js";
import Process from "../models/process.models.js"
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
      processSteps,
      includedPoints: includedPoints,
      excludedPoints: excludedPoints , // ✅ NEW (optional)
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
    const customerPrice = Number(workerPrice) + Number(platformFee);

    const imagePath = req.files?.image?.[0]?.path;
    
        if (!imagePath) {
          return res.status(400).json({
            success:false,
            message: "Sub-Service image is required"
          });
        }
    
        const imageUploaded = await uploadOnCloudinary(imagePath);
    
        // handle cloudinary failure
        if (!imageUploaded || !imageUploaded.secure_url) {
          return res.status(500).json({
            success:false,
            message:"Image upload failed. Please try again."
          });
        }

        const normalizeArray = (field) => {
          if (!field) return [];
          if (Array.isArray(field)) return field;
          if (typeof field === "object") return Object.values(field);
          return [field];
        };
        
        const parsedIncluded = normalizeArray(includedPoints);
        const parsedExcluded = normalizeArray(excludedPoints);
        
        // parse processSteps
        let parsedSteps = [];
        if (processSteps) {
          try {
            parsedSteps =
              typeof processSteps === "string"
                ? JSON.parse(processSteps)
                : processSteps;
          } catch {
            return res.status(400).json({ message: "Invalid processSteps format" });
          }
        }
        

    let subService = await SubService.create({
      serviceId,
      name,
      description,
      workerPrice,
      platformFee,
      customerPrice,
      durationEstimate,
      withMaterial,
      image: imageUploaded.secure_url,
      includedPoints: parsedIncluded,
  excludedPoints: parsedExcluded,
    });

    // =====================================================
    // ✅ OPTIONAL: CREATE PROCESS IF PROVIDED
    // =====================================================
    if (parsedSteps.length > 0) {
      const normalizedSteps = parsedSteps.map((step, index) => ({
        stepNumber: index + 1,
        title: step.title?.trim(),
        description: step.description?.trim(),
      }));
    
      // ✅ remove old process if exists
      await Process.deleteOne({ subServiceId: subService._id });
    
      const process = await Process.create({
        subServiceId: subService._id,
        steps: normalizedSteps,
      });
    
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid subservice ID" });
    }

    const {
      name,
      description,
      workerPrice,
      platformFee,
      durationEstimate,
      active,
      processSteps,
      includedPoints,
      excludedPoints,
      withMaterial,
    } = req.body;

    /* ================= BUILD UPDATE OBJECT ================= */

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (durationEstimate !== undefined)
      updateData.durationEstimate = Number(durationEstimate);
    if (active !== undefined) updateData.active = active;

    // ✅ CRITICAL FIX — ALWAYS INCLUDE FIELD
    if (typeof withMaterial === "boolean") {
      updateData.withMaterial = withMaterial;
    }

    if (workerPrice !== undefined) {
      const wp = Number(workerPrice);
      if (wp < 0)
        return res.status(400).json({ message: "Invalid worker price" });
      updateData.workerPrice = wp;
    }

    if (platformFee !== undefined) {
      const pf = Number(platformFee);
      if (pf < 0)
        return res.status(400).json({ message: "Invalid platform fee" });
      updateData.platformFee = pf;
    }

    // ✅ price recalculation
    if (
      updateData.workerPrice !== undefined ||
      updateData.platformFee !== undefined
    ) {
      const wp = updateData.workerPrice ?? 0;
      const pf = updateData.platformFee ?? 0;
      updateData.customerPrice = wp + pf;
    }

    if (includedPoints !== undefined) {
      if (!Array.isArray(includedPoints)) {
        return res.status(400).json({
          message: "includedPoints must be an array",
        });
      }
      updateData.includedPoints = includedPoints
        .map((p) => p.trim())
        .filter(Boolean);
    }

    if (excludedPoints !== undefined) {
      if (!Array.isArray(excludedPoints)) {
        return res.status(400).json({
          message: "excludedPoints must be an array",
        });
      }
      updateData.excludedPoints = excludedPoints
        .map((p) => p.trim())
        .filter(Boolean);
    }

    /* ================= UPDATE DB ================= */

    const subService = await SubService.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // OK for now
    );

    if (!subService) {
      return res.status(404).json({ message: "SubService not found" });
    }

    /* ================= PROCESS ================= */

    if (processSteps !== undefined) {

      if (Array.isArray(processSteps) && processSteps.length === 0) {
        if (subService.processId) {
          await Process.findByIdAndDelete(subService.processId);
          subService.processId = null;
        }
      } else if (Array.isArray(processSteps)) {

        for (const step of processSteps) {
          if (!step.stepNumber || !step.title || !step.description) {
            return res.status(400).json({
              message: "Each step must have stepNumber, title, description",
            });
          }
        }

        const stepNumbers = processSteps.map((s) => s.stepNumber);
        if (new Set(stepNumbers).size !== stepNumbers.length) {
          return res.status(400).json({
            message: "Step numbers must be unique",
          });
        }

        if (subService.processId) {
          await Process.findByIdAndUpdate(
            subService.processId,
            { steps: processSteps },
            { returnDocument: "after" }
          );
        } else {
          const process = await Process.create({
            subServiceId: subService._id,
            steps: processSteps,
          });
          subService.processId = process._id;
        }
      }

      await subService.save();
    }

    /* ================= FINAL RESPONSE ================= */

    const updated = await SubService.findById(id).populate("processId");

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