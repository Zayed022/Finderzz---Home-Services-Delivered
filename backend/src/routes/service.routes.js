import express from "express";

import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { createService, deleteService, getServicesByCategory, updateService } from "../controllers/service.controllers.js";

const router = express.Router();

router.post("/", createService);                            // done
router.get("/:categoryId", getServicesByCategory);          // done
router.patch("/:id", updateService);
router.delete("/:id", deleteService);

export default router;