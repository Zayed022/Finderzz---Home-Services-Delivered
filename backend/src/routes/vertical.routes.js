import express from "express";
import { createRequest, createVertical, deleteVertical, getAllRequest, getAllVerticals, getVerticalDetails, updateVertical } from "../controllers/vertical.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router = express.Router();

router.get("/verticals", getAllVerticals);
router.get("/vertical/:id", getVerticalDetails);
router.put(
  "/:id",
  upload.fields([
    { name: "icon", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  updateVertical
);

router.delete("/:id", deleteVertical);
router.post("/request", createRequest);
router.post("/", upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]), 
    createVertical);
router.get("/get", getAllRequest)
export default router;