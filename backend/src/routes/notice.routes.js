import express from "express";
import {
  createNotice,
  getAllNotices,
  getActiveNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
  toggleNoticeStatus
} from "../controllers/notice.controllers.js";

const router = express.Router();

router.post("/", createNotice);

router.get("/", getAllNotices);           // admin
router.get("/active", getActiveNotices);  // public

router.get("/:id", getNoticeById);

router.put("/:id", updateNotice);

router.patch("/:id/toggle", toggleNoticeStatus);

router.delete("/:id", deleteNotice);

export default router;