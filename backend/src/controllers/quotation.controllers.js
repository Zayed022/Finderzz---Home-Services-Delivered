import Quotation from "../models/quotation.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// CREATE QUOTATION (Worker)
export const createQuotation = async (req, res) => {
  try {
    const { description, estimatedPrice, workerName, clientName } = req.body;

    const quotationPath = req.files?.quotationImages?.[0]?.path;

    if (!quotationPath) {
      return res.status(400).json({
        success:false,
        message: "Quotaion image is required"
      });
    }

    const quotationUploaded = await uploadOnCloudinary(quotationPath);

    // handle cloudinary failure
    if (!quotationUploaded || !quotationUploaded.secure_url) {
      return res.status(500).json({
        success:false,
        message:"Image upload failed. Please try again."
      });
    }

    const quotation = await Quotation.create({
      workerName,
      clientName,
      quotationImages: quotationUploaded.secure_url,
      description,
      estimatedPrice,
    });

    return res.status(201).json({
      success: true,
      message: "Quotation created successfully",
      data: quotation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADMIN: get all quotations
export const getAllQuotations = async (req, res) => {
    try {
      const quotations = await Quotation.find()
        .populate("clientName workerName estimatedPrice description")
        .sort({ createdAt: -1 });
  
      res.json({ success: true, data: quotations });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // WORKER: get own quotations
  export const getWorkerQuotations = async (req, res) => {
    try {
      const quotations = await Quotation.find({
        workerId: req.user._id,
      }).sort({ createdAt: -1 });
  
      res.json({ success: true, data: quotations });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  export const updateQuotationStatus = async (req, res) => {
    try {
      const { status, adminNotes, approvedPrice } = req.body;
  
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }
  
      const quotation = await Quotation.findById(req.params.id);
  
      if (!quotation) {
        return res.status(404).json({
          success: false,
          message: "Quotation not found",
        });
      }
  
      quotation.status = status;
      quotation.adminNotes = adminNotes || "";
      quotation.approvedPrice = approvedPrice || quotation.estimatedPrice;
  
      await quotation.save();
  
      return res.json({
        success: true,
        message: `Quotation ${status}`,
        data: quotation,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };