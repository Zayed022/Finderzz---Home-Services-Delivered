import mongoose from "mongoose";
import Notice from "../models/notice.models.js"

/* ─────────────────────────────────────────────── */
/* CREATE NOTICE */
/* ─────────────────────────────────────────────── */
export const createNotice = async (req, res, next) => {
  try {
    const { heading, message, icon, type } = req.body;

    if (!heading || !message) {
      return res.status(400).json({
        success: false,
        message: "Heading and message are required",
      });
    }

    const notice = await Notice.create({
      heading,
      message,
      icon,
      type,
    });

    res.status(201).json({
      success: true,
      data: notice,
    });

  } catch (error) {
    next(error);
  }
};


/* ─────────────────────────────────────────────── */
/* GET ALL NOTICES (ADMIN) */
/* ─────────────────────────────────────────────── */
export const getAllNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: notices,
    });

  } catch (error) {
    next(error);
  }
};


/* ─────────────────────────────────────────────── */
/* GET ACTIVE NOTICES (PUBLIC USE) */
/* ─────────────────────────────────────────────── */
export const getActiveNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find({ active: true })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: notices,
    });

  } catch (error) {
    next(error);
  }
};


/* ─────────────────────────────────────────────── */
/* GET SINGLE NOTICE */
/* ─────────────────────────────────────────────── */
export const getNoticeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Notice ID",
      });
    }

    const notice = await Notice.findById(id).lean();

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.json({
      success: true,
      data: notice,
    });

  } catch (error) {
    next(error);
  }
};


/* ─────────────────────────────────────────────── */
/* UPDATE NOTICE */
/* ─────────────────────────────────────────────── */
export const updateNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { heading, message, icon, type, active } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Notice ID",
      });
    }

    const notice = await Notice.findByIdAndUpdate(
      id,
      {
        ...(heading && { heading }),
        ...(message && { message }),
        ...(icon && { icon }),
        ...(type && { type }),
        ...(typeof active === "boolean" && { active }),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.json({
      success: true,
      data: notice,
    });

  } catch (error) {
    next(error);
  }
};


/* ─────────────────────────────────────────────── */
/* DELETE NOTICE */
/* ─────────────────────────────────────────────── */
export const deleteNotice = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Notice ID",
      });
    }

    const notice = await Notice.findByIdAndDelete(id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.json({
      success: true,
      message: "Notice deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};


/* ─────────────────────────────────────────────── */
/* TOGGLE NOTICE ACTIVE STATUS */
/* ─────────────────────────────────────────────── */
export const toggleNoticeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Notice ID",
      });
    }

    const notice = await Notice.findById(id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    notice.active = !notice.active;
    await notice.save();

    res.json({
      success: true,
      data: notice,
    });

  } catch (error) {
    next(error);
  }
};