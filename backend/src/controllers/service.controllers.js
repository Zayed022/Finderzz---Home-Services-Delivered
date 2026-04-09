import Service from "../models/service.models.js";
import Category from "../models/category.models.js";
import SubService from "../models/subService.models.js"
import Process from "../models/process.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createService = async (req, res, next) => {
  try {
    const {
      categoryId,
      name,
      description,
      isPopular,

      // inspection
      inspectionAvailable,
      inspectionWorkerPrice,
      inspectionPlatformFee,
      inspectionDescription,
      inspectionDuration,
      processSteps,
      includedPoints: includedPoints,
      excludedPoints: excludedPoints ,
    } = req.body;

    /* ---------------- CATEGORY VALIDATION ---------------- */

    const category = await Category.findById(categoryId);

    if (!category || !category.active) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    /* ---------------- BANNER ---------------- */

    const bannerPath = req.files?.bannerImage?.[0]?.path;

    if (!bannerPath) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required",
      });
    }

    const bannerUploaded = await uploadOnCloudinary(bannerPath);

    if (!bannerUploaded?.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Banner upload failed",
      });
    }

    /* ---------------- ICON ---------------- */

    const iconPath = req.files?.icon?.[0]?.path;

    if (!iconPath) {
      return res.status(400).json({
        success: false,
        message: "Icon image is required",
      });
    }

    const iconUploaded = await uploadOnCloudinary(iconPath);

    if (!iconUploaded?.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Icon upload failed",
      });
    }

    /* ----------- SAFE NUMBER CONVERSION ----------- */

    const isInspectionEnabled =
      inspectionAvailable === true || inspectionAvailable === "true";

    const workerPrice = Number(inspectionWorkerPrice || 0);
    const platformFee = Number(inspectionPlatformFee || 0);
    const duration = inspectionDuration
      ? Number(inspectionDuration)
      : undefined;

    /* ----------- VALIDATION ----------- */

    if (isInspectionEnabled) {
      if (isNaN(workerPrice) || isNaN(platformFee)) {
        return res.status(400).json({
          success: false,
          message: "Invalid inspection prices",
        });
      }

      if (workerPrice < 0 || platformFee < 0) {
        return res.status(400).json({
          success: false,
          message: "Inspection prices cannot be negative",
        });
      }
    }

    /* ----------- CALCULATION ----------- */

    const inspectionPrice = isInspectionEnabled
      ? workerPrice + platformFee
      : 0;


      const parseJSON = (value) => {
        if (!value) return [];
        try {
          return typeof value === "string" ? JSON.parse(value) : value;
        } catch {
          return [];
        }
      };
      
      const includedPointsParsed = parseJSON(req.body.includedPoints);
      const excludedPointsParsed = parseJSON(req.body.excludedPoints);

    /* ---------------- CREATE SERVICE ---------------- */

    const service = await Service.create({
      categoryId,
      name,
      bannerImage: bannerUploaded.secure_url,
      description,
      icon: iconUploaded.secure_url,
      isPopular,

      inspectionAvailable: isInspectionEnabled,
      inspectionWorkerPrice: workerPrice,
      inspectionPlatformFee: platformFee,
      inspectionPrice,
      inspectionDescription,
      inspectionDuration: duration,
      includedPoints: includedPointsParsed,
      excludedPoints: excludedPointsParsed,
    
    });

    // =====================================================
    // ✅ PROCESS CREATION (SAFE + NO DUPLICATE INDEX ISSUE)
    // =====================================================

    let steps;

    if (processSteps) {
      try {
        steps =
          typeof processSteps === "string"
            ? JSON.parse(processSteps)
            : processSteps;
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid processSteps format",
        });
      }
    }

    if (Array.isArray(steps) && steps.length > 0) {

      // normalize step numbers
      const normalizedSteps = steps.map((step, index) => ({
        stepNumber: index + 1,
        title: step.title?.trim(),
        description: step.description?.trim(),
      }));

      // validation
      for (const step of normalizedSteps) {
        if (!step.title || !step.description) {
          return res.status(400).json({
            success: false,
            message:
              "Each process step must have title and description",
          });
        }
      }

      // 🔥 IMPORTANT: ensure no existing process (avoid duplicate key error)
      await Process.deleteOne({ serviceId: service._id });

      const process = await Process.create({
        serviceId: service._id,
        steps: normalizedSteps,
      });

      service.processId = process._id;
      await service.save();
    }

    // =====================================================
    // ✅ FINAL FETCH
    // =====================================================

    const finalService = await Service.findById(service._id)
      .populate("processId")
      .lean();

    return res.status(201).json({
      success: true,
      data: finalService,
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

export const getServiceById = async (req,res,next)=>{
  try{

    const { id } = req.params;

    const service = await Service.findById(id);

    if(!service){
      return res.status(404).json({message:"Service not found"});
    }

    res.json({
      success:true,
      data:service
    });

  }catch(error){
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;

    let {
      name,
      description,
      categoryId,
      isPopular,

      inspectionAvailable,
      inspectionWorkerPrice,
      inspectionPlatformFee,
      inspectionDescription,
      inspectionDuration,
      includedPoints,
      excludedPoints,
    } = req.body;

    const updateData = {
      name,
      description,
      categoryId,
      isPopular,
    };

    /* ================= INSPECTION LOGIC ================= */

    if (inspectionAvailable === true) {
      if (
        inspectionWorkerPrice == null ||
        inspectionPlatformFee == null
      ) {
        return res.status(400).json({
          message: "Inspection prices required",
        });
      }

      // Ensure numbers
      inspectionWorkerPrice = Number(inspectionWorkerPrice);
      inspectionPlatformFee = Number(inspectionPlatformFee);

      updateData.inspectionAvailable = true;
      updateData.inspectionWorkerPrice = inspectionWorkerPrice;
      updateData.inspectionPlatformFee = inspectionPlatformFee;

      updateData.inspectionPrice =
        inspectionWorkerPrice + inspectionPlatformFee;

      updateData.inspectionDescription =
        inspectionDescription || "";

      updateData.inspectionDuration =
        Number(inspectionDuration) || 0;

      updateData.includedPoints =
        Array.isArray(includedPoints) ? includedPoints : [];

      updateData.excludedPoints =
        Array.isArray(excludedPoints) ? excludedPoints : [];
    } else {
      // If inspection disabled → clean fields
      updateData.inspectionAvailable = false;
      updateData.inspectionWorkerPrice = 0;
      updateData.inspectionPlatformFee = 0;
      updateData.inspectionPrice = 0;
      updateData.inspectionDescription = "";
      updateData.inspectionDuration = 0;
      updateData.includedPoints = [];
      updateData.excludedPoints = [];
    }

    /* ================= UPDATE ================= */

    const service = await Service.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      data: service,
    });

  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Validate service
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // 2. Soft delete service
    service.active = false;
    await service.save();

    // 3. HARD delete related process (safe cleanup)
    await Process.findOneAndDelete({ serviceId: id });

    res.json({
      success: true,
      message: "Service disabled and process cleaned",
    });
  } catch (error) {
    console.error("Delete service error:", error);
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
        service: {
          ...service,

          // Explicit exposure (frontend clarity)
          inspection: {
            available: service.inspectionAvailable,
            price: service.inspectionPrice,
            description: service.inspectionDescription,
            duration: service.inspectionDuration,
          },
        },
        subServices,
      },
    });
  } catch (error) {
    next(error);
  }
};