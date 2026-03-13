import User from "../models/user.models.js";
import Worker from "../models/worker.models.js";
import Booking from "../models/booking.models.js"
import Settlement from "../models/settlement.models.js"
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

const generateAccessAndRefreshTokens = async (workerId) => {
  try {
    const worker = await Worker.findById(workerId);

    const accessToken = worker.generateAccessToken();
    const refreshToken = worker.generateRefreshToken();

    worker.refreshToken = refreshToken;
    await worker.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

export const workerLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if(!(phone || password)){
      return res.status(400).json({message:"All fields are required"});
    };

    const worker = await Worker.findOne({ phone });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    const isPasswordValid = await worker.isPasswordCorrect(password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid worker credentials" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(worker._id);

    // Fetch logged-in user details (excluding sensitive fields)
    const loggedInWorker = await Worker.findById(worker._id).select("-password -refreshToken");

    // Set cookies

    worker.lastLogin = new Date();
    await worker.save();

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
    };

    if (worker.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your account is not approved yet",
      });
    }
    const token = generateWorkerToken(worker);

    return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json({
      success: true,
      message: "User logged in successfully",
      worker: loggedInWorker,
      token: accessToken
  });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

export const workerLogout = async (req, res) => {
  try {

    const { workerId } = req.params;

    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: "Worker ID required"
      });
    }

    // remove refresh token from DB
    await Worker.findByIdAndUpdate(
      workerId,
      { refreshToken: null },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "Logged out successfully"
      });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Logout failed"
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
      name,
      password,
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
      name,
      password,
      phone,
      aadhaarNumber,
      panNumber,
      address,
      skills,
      aadhaarImage: aadhaarImageUploaded.url,
      panImage: panImageUploaded.url,
      profileImage: profileImageUploaded.url,
    });

    const createdWorker = await Worker.findById(worker._id).select("-password -refreshToken");
    if (!createdWorker) {
      return res.status(500).json({ success: false, message: "Error creating worker" });
    }

    return res.status(201).json({
      success: true,
      message: "Registration submitted. Waiting for admin approval.",
      worker,
      data: createdWorker,
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

    console.log("PARAMS:", req.params);

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

export const getWorkerHistory = async (req, res) => {
  try {

    const { workerId } = req.params;

    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: "Worker ID is required",
      });
    }

    const jobs = await Booking.find({
      workerId,
      status: "completed",
    })
      .populate("services.subServiceId")
      .populate("areaId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });

  } catch (error) {

    console.error("Worker history error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch worker history",
      error: error.message,
    });

  }
};

export const getWorkerEarnings = async (req, res) => {
  try {

    const { workerId } = req.params;

    if (!workerId) {
      return res.status(400).json({
        success:false,
        message:"Worker ID is required"
      });
    }

    const bookings = await Booking.find({
      workerId,
      status:"completed"
    })
    .populate("services.subServiceId")
    .sort({ createdAt:-1 });

    let totalEarnings = 0;
    let todayEarnings = 0;
    let weeklyEarnings = 0;
    let monthlyEarnings = 0;

    const now = new Date();

    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const monthStart = new Date();
    monthStart.setDate(1);

    bookings.forEach((booking) => {

      let bookingEarning = 0;

      booking.services.forEach((service) => {

        let workerPrice = 0;

        if(service.bookingType === "inspection"){
          workerPrice =
            service.subServiceId?.inspectionWorkerPrice || 0;
        } else {
          workerPrice =
            service.subServiceId?.workerPrice || 0;
        }

        bookingEarning += workerPrice * (service.quantity || 1);

      });

      totalEarnings += bookingEarning;

      const bookingDate = new Date(booking.createdAt);

      if (bookingDate >= todayStart) {
        todayEarnings += bookingEarning;
      }

      if (bookingDate >= weekStart) {
        weeklyEarnings += bookingEarning;
      }

      if (bookingDate >= monthStart) {
        monthlyEarnings += bookingEarning;
      }

    });

    res.status(200).json({
      success:true,
      earnings:{
        totalEarnings,
        todayEarnings,
        weeklyEarnings,
        monthlyEarnings,
        totalCompletedJobs: bookings.length
      }
    });

  } catch (error) {

    console.error("Worker earnings error:", error);

    res.status(500).json({
      success:false,
      message:"Failed to fetch earnings"
    });

  }
};

export const getWorkerProfile = async (req, res) => {
  try {

    const { workerId } = req.params;

    const worker = await Worker.findById(workerId).select("-password -refreshToken");

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found"
      });
    }

    res.status(200).json({
      success: true,
      worker
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch worker profile"
    });

  }
};

export const updateWorkerProfile = async (req, res) => {
  try {

    const { workerId } = req.params;

    const {
      name,
      phone,
      address,
      skills
    } = req.body;

    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found"
      });
    }

    if (name) worker.name = name;
    if (phone) worker.phone = phone;
    if (address) worker.address = address;
    if (skills) worker.skills = skills;

    if (req.file) {

      const uploaded = await uploadOnCloudinary(req.file.path);

      worker.profileImage = uploaded.url;

    }

    await worker.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      worker
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });

  }
};

export const getApprovedWorkers = async (req,res,next)=>{
  try{

    const workers = await Worker.find({
      status:"approved",
      isActive:true
    })
    .select("name phone")
    .lean();

    res.json({
      success:true,
      data:workers
    });

  }catch(error){
    next(error);
  }
};

export const getWorkerDailySettlement = async (req,res)=>{
  try{

    const { workerId } = req.params;

    if(!workerId){
      return res.status(400).json({
        success:false,
        message:"Worker ID required"
      });
    }

    const bookings = await Booking.find({
      workerId,
      status:"completed"
    })
    .populate("services.subServiceId")
    .populate("areaId")
    .sort({ createdAt:-1 });

    const settlements = await Settlement.find({ workerId });

    const settlementMap = {};

    settlements.forEach(s=>{
      settlementMap[s.date] = s;
    });

    const dailyMap = {};

    bookings.forEach((booking)=>{

      const date = booking.createdAt.toISOString().split("T")[0];

      if(!dailyMap[date]){
        dailyMap[date] = {
          date,
          totalCollected:0,
          workerEarnings:0,
          adminShare:0,
          jobs:0,
          status:"pending"
        };
      }

      let collected = 0;
      let workerEarn = 0;
      let platformEarn = 0;

      booking.services.forEach(service=>{

        const price = service.price || 0;

        let workerPrice = 0;
        let platformFee = 0;

        if(service.bookingType === "inspection"){

          workerPrice =
            service.subServiceId?.inspectionWorkerPrice || 0;

          platformFee =
            service.subServiceId?.inspectionPlatformFee || 0;

        }else{

          workerPrice =
            service.subServiceId?.workerPrice || 0;

          platformFee =
            service.subServiceId?.platformFee || 0;
        }

        collected += price;
        workerEarn += workerPrice;
        platformEarn += platformFee;

      });

      const areaCharge = booking.extraCharge || 0;

      const adminShare = platformEarn + areaCharge;

      dailyMap[date].totalCollected += collected + areaCharge;
      dailyMap[date].workerEarnings += workerEarn;
      dailyMap[date].adminShare += adminShare;
      dailyMap[date].jobs += 1;

    });

    const result = Object.values(dailyMap).map(day=>{

      const settlement = settlementMap[day.date];

      if(settlement){
        day.status = settlement.status;
        day.settlementId = settlement._id;
      }

      return day;

    });

    res.json({
      success:true,
      data:result
    });

  }catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:"Failed to fetch settlement"
    });

  }
};