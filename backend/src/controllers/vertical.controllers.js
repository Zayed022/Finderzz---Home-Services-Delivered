import Vertical from "../models/vertical.models.js"
import Request from "../models/request.models.js"
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const getAllVerticals = async (req, res) => {
    const data = await Vertical.find({ active: true });
    res.json({ success: true, data });
  };
  
  export const getVerticalDetails = async (req, res) => {
    const data = await Vertical.findById(req.params.id);
    res.json({ success: true, data });
  };
  
  export const createRequest = async (req, res) => {
    try {
      const { verticalId, userId, phone, responses } = req.body;
  
      if (!verticalId) {
        return res.status(400).json({
          success: false,
          message: "Vertical ID is required",
        });
      }
  
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is required",
        });
      }
  
      const request = await Request.create({
        verticalId,
        userId,
        phone,
        responses,
      });
  
      res.status(201).json({
        success: true,
        data: request,
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const createVertical = async (req, res, next) => {
    try {
      const { name, description } = req.body;
  
      if (!name)
        return res.status(400).json({ message: "Name is required" });
  
      const bannerPath = req.files?.bannerImage?.[0]?.path;
        
    
        if (!bannerPath) return res.status(400).json({ message: "Banner image is required" });

        const bannerUploaded = await uploadOnCloudinary(bannerPath);
    
        

        const iconPath = req.files?.icon?.[0]?.path;
            
        
            if (!iconPath) return res.status(400).json({ message: "Icon image is required" });
        
            const iconUploaded = await uploadOnCloudinary(iconPath);
  
      
  
      // Parse dynamicFields if coming as string (important)
      let parsedFields = [];
      if (req.body.dynamicFields) {
        parsedFields =
          typeof req.body.dynamicFields === "string"
            ? JSON.parse(req.body.dynamicFields)
            : req.body.dynamicFields;
      }
  
      const vertical = await Vertical.create({
        name,
        icon: iconUploaded.url,
        bannerImage: bannerUploaded.url,
        description,
        dynamicFields: parsedFields,
      });
  
      res.status(201).json({
        success: true,
        data: vertical,
      });
    } catch (error) {
      console.log("Create Vertical Error:", error);
      next(error);
    }
  };

  export const getAllRequest = async (req, res) => {
    try {
  
      const requests = await Request.find()
        .populate("verticalId", "name")   // 👈 THIS FIX
        .populate("userId", "name phone");
  
      res.json({
        success: true,
        data: requests,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch requests",
      });
    }
  };

  export const updateVertical = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid vertical ID",
        });
      }
  
      const vertical = await Vertical.findById(id);
  
      if (!vertical) {
        return res.status(404).json({
          success: false,
          message: "Vertical not found",
        });
      }
  
      let { name, description, active } = req.body;
  
      const updateData = {};
  
      /* =========================
         TEXT FIELDS
      ========================= */
  
      if (name !== undefined) {
        updateData.name = name.trim();
      }
  
      if (description !== undefined) {
        updateData.description = description.trim();
      }
  
      if (active !== undefined) {
        updateData.active =
          active === true ||
          active === "true" ||
          active === "1";
      }
  
      /* =========================
         IMAGE UPLOADS
      ========================= */
  
      // req.files.icon[0]
      if (req.files?.icon?.[0]) {
        const uploadedIcon = await uploadOnCloudinary(
          req.files.icon[0].path
        );
  
        if (uploadedIcon?.secure_url) {
          updateData.icon = uploadedIcon.secure_url;
        }
      }
  
      // req.files.bannerImage[0]
      if (req.files?.bannerImage?.[0]) {
        const uploadedBanner = await uploadOnCloudinary(
          req.files.bannerImage[0].path
        );
  
        if (uploadedBanner?.secure_url) {
          updateData.bannerImage = uploadedBanner.secure_url;
        }
      }
  
      /* =========================
         UPDATE DB
      ========================= */
  
      const updated = await Vertical.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );
  
      return res.status(200).json({
        success: true,
        message: "Vertical updated successfully",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  export const deleteVertical = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid vertical ID",
        });
      }
  
      const deleted = await Vertical.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Vertical not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Vertical deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };