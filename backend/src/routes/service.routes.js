import express from "express";

import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { createService, deleteService, getServiceById, getServices, getServicesByCategory, getServiceWithSubServices, updateService } from "../controllers/service.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router = express.Router();

/* -------- CREATE -------- */
router.post(
  "/",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  createService
);

/* -------- READ -------- */

// ALL services
router.get("/", getServices);

// Services by category (FIXED)
router.get("/category/:categoryId", getServicesByCategory);

// Service with subservices
router.get("/:serviceId/details", getServiceWithSubServices);

// Single service
router.get("/:id", getServiceById);

/* -------- UPDATE -------- */
router.patch("/:id", updateService);

/* -------- DELETE -------- */
router.delete("/:id", deleteService);

export default router;