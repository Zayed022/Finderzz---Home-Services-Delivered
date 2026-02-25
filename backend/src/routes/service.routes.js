import express from "express";

import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { createService, deleteService, getServicesByCategory, getServiceWithSubServices, updateService } from "../controllers/service.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.post("/",upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]), createService);                            // done
router.get("/:categoryId", getServicesByCategory);          // done
router.get(
    "/:serviceId/details",
    getServiceWithSubServices
  );
router.patch("/:id", updateService);
router.delete("/:id", deleteService);

export default router;