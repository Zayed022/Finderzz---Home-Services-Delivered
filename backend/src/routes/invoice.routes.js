import express from "express";
import { getInvoiceByBooking } from "../controllers/invoice.controllers.js";

const router = express.Router();

router.get("/booking/:bookingId", getInvoiceByBooking);

export default router;