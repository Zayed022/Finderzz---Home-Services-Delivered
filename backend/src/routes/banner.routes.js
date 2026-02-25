import express from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  createBanner,
  getActiveBanners,
  deleteBanner,
} from "../controllers/banner.controllers.js";

const router = express.Router();

router.post("/", upload.fields([
    { name: "bannerImage", maxCount: 1 },
  ]), createBanner);
router.get("/active", getActiveBanners);
router.delete("/:id", deleteBanner);

export default router;