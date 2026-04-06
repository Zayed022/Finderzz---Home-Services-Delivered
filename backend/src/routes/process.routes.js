import express from "express";
import {
  getProcessById,
  getProcessByServiceId,
  getProcessBySubServiceId,
} from "../controllers/process.controllers.js";

const router = express.Router();

// 🔹 Get by processId
router.get("/:id", getProcessById);

// 🔹 Get by serviceId (BEST for your case)
router.get("/service/:serviceId", getProcessByServiceId);

// 🔹 Get by subServiceId
router.get("/sub-service/:subServiceId", getProcessBySubServiceId);

export default router;