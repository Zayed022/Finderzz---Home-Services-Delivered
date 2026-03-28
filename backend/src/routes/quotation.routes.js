import express from "express";
import {
  createQuotation,
  getAllQuotations,
  getWorkerQuotations,
  updateQuotationStatus,
} from "../controllers/quotation.controllers.js";



import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();


// =============================
// WORKER ROUTES
// =============================

// Create quotation (with images)
router.post(
  "/create",
  upload.fields([
    { name: "quotationImages", maxCount: 1 },
  ]),
  createQuotation
);

// Get worker's own quotations
router.get(
  "/worker",
  getWorkerQuotations
);


// =============================
// ADMIN ROUTES
// =============================

// Get all quotations
router.get(
  "/admin",
  getAllQuotations
);

// Approve / Reject quotation
router.patch(
  "/:id/status",
  updateQuotationStatus
);






export default router;