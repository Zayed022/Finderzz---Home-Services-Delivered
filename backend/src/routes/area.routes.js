import express from "express";
import {
  createArea,
  getActiveAreas,
  getAllAreas,
  updateArea,
  deleteArea
} from "../controllers/area.controllers.js";
const router = express.Router();

// Public
router.get("/active", getActiveAreas);

// Admin
router.post("/", createArea);
router.get("/", getAllAreas);
router.patch("/:id", updateArea);
router.delete("/:id", deleteArea);

export default router;