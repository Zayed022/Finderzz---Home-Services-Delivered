import User from "../models/user.models.js";
import Worker from "../models/worker.models.js";
import Booking from "../models/booking.models.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateWorkerToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: "worker",
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const workerLogin = async (req, res) => {
  try {
    const { phone } = req.body;

    const worker = await Worker.findOne({ phone });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    if (worker.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your account is not approved yet",
      });
    }
    const token = generateWorkerToken(worker);

    res.json({
      success: true,
      worker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

export const registerWorker = async (req, res) => {
  try {
    const {
      phone,
      aadhaarNumber,
      panNumber,
      address,
      skills,
    } = req.body;

    const existingWorker = await Worker.findOne({ phone });

    if (existingWorker) {
      return res.status(400).json({
        success: false,
        message: "Worker profile already exists",
      });
    }

    const aadhaarImagePath = req.files?.aadhaarImage?.[0]?.path;
        
    
        if (!aadhaarImagePath) return res.status(400).json({ message: "Aadhaar image is required" });

        const aadhaarImageUploaded = await uploadOnCloudinary(aadhaarImagePath);
    
        

        const panImagePath = req.files?.panImage?.[0]?.path;
            
        
            if (!panImagePath) return res.status(400).json({ message: "Pan image is required" });
        
            const panImageUploaded = await uploadOnCloudinary(panImagePath);

            const profileImagePath = req.files?.profileImage?.[0]?.path;
        
    
            if (!profileImagePath) return res.status(400).json({ message: "Profile image is required" });
    
            const profileImageUploaded = await uploadOnCloudinary(profileImagePath);

    const worker = await Worker.create({
      phone,
      aadhaarNumber,
      panNumber,
      address,
      skills,
      aadhaarImage: aadhaarImageUploaded.url,
      panImage: panImageUploaded.url,
      profileImage: profileImageUploaded.url,
    });

    res.status(201).json({
      success: true,
      message: "Registration submitted. Waiting for admin approval.",
      worker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Worker registration failed",
      error: error.message,
    });
  }
};

export const approveWorker = async (req, res, next) => {
  try {
    const { id } = req.params;

    const worker = await Worker.findById(id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    worker.status = "approved";
    await worker.save();

    res.json({
      success: true,
      message: "Worker approved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const rejectWorker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const worker = await Worker.findById(id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    worker.status = "rejected";
    worker.rejectionReason = reason;
    await worker.save();

    res.json({
      success: true,
      message: "Worker rejected",
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.find()
      .populate("userId", "name email")
      .populate("skills", "name basePrice")
      .populate("assignedAreas", "name");

    res.json({
      success: true,
      data: workers,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkerDashboard = async (req, res) => {
  try {
    const { workerId } = req.params;

    const totalJobs = await Booking.countDocuments({
      workerId,
    });

    const completedJobs = await Booking.countDocuments({
      workerId,
      status: "completed",
    });

    const inProgressJobs = await Booking.countDocuments({
      workerId,
      status: "in_progress",
    });

    const pendingJobs = await Booking.countDocuments({
      workerId,
      status: "assigned",
    });

    res.json({
      success: true,
      dashboard: {
        totalJobs,
        completedJobs,
        inProgressJobs,
        pendingJobs,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
    });
  }
};

export const getAssignedJobs = async (req, res) => {
  try {
    const { workerId } = req.params;

    const jobs = await Booking.find({
      workerId,
      status: { $in: ["assigned", "in_progress"] },
    })
      .populate("services.subServiceId")
      .populate("areaId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

export const getJobDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const job = await Booking.findById(bookingId)
      .populate("services.subServiceId")
      .populate("areaId")
      .populate("workerId");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};

export const startJob = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "in_progress" },
      { new: true }
    );

    res.json({
      success: true,
      message: "Job started",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to start job",
    });
  }
};

export const completeJob = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "completed" },
      { new: true }
    );

    await Worker.findByIdAndUpdate(booking.workerId, {
      $inc: { totalJobs: 1 },
    });

    res.json({
      success: true,
      message: "Job completed successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to complete job",
    });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const { workerId } = req.params;

    const worker = await Worker.findById(workerId);

    worker.isAvailable = !worker.isAvailable;

    await worker.save();

    res.json({
      success: true,
      message: "Availability updated",
      isAvailable: worker.isAvailable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update availability",
    });
  }
};

export const getWorkerProfile = async (req, res) => {
  try {
    const { workerId } = req.params;

    const worker = await Worker.findById(workerId)
      .populate("skills")
      .populate("assignedAreas")
      .populate("userId");

    res.json({
      success: true,
      worker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};