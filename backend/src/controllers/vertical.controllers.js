import Vertical from "../models/vertical.models.js"
import Request from "../models/request.models.js"
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