import express from "express";
import { createBooking, getBookingsByStatus } from "../controllers/booking.controllers.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/get", getBookingsByStatus);

export default router;