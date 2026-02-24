import User from "../models/user.models.js";
import Worker from "../models/worker.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

export const loginWorker = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email, role: "worker" });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const worker = await Worker.findOne({ userId: user._id })
      .select("status isActive")
      .lean();

    if (!worker) {
      return res.status(400).json({ message: "Worker profile not found" });
    }

    if (worker.status !== "approved") {
      return res.status(403).json({
        message:
          worker.status === "pending"
            ? "Your account is pending admin approval"
            : "Your account has been rejected",
      });
    }

    if (!worker.isActive) {
      return res.status(403).json({
        message: "Your account is disabled",
      });
    }

    const token = generateWorkerToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "worker",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const registerWorker = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      aadhaarNumber,
      panNumber,
      address,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "worker",
    });

    await Worker.create({
      userId: user._id,
      phone,
      aadhaarNumber,
      panNumber,
      address,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Registration submitted. Await admin approval.",
    });
  } catch (error) {
    next(error);
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