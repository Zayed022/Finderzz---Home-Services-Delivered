import express from "express";
import { createRequest, createVertical, getAllVerticals, getVerticalDetails } from "../controllers/vertical.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router = express.Router();

router.get("/verticals", getAllVerticals);
router.get("/vertical/:id", getVerticalDetails);
router.post("/request", createRequest);
router.post("/", upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]), 
    createVertical);
export default router;