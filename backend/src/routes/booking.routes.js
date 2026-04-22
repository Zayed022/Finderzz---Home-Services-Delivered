import express from "express";
import { assignWorker, cancelBooking, createBooking, deleteBooking, getAllBookings, getBookingById, getBookingsByStatus, getBookingStats, getBookingStatus, unassignWorker, updateBookingStatus } from "../controllers/booking.controllers.js";

const router = express.Router();

router.post("/", createBooking);

router.get("/", getAllBookings);

router.get("/status", getBookingsByStatus);

router.get("/stats", getBookingStats);

router.get("/:id", getBookingById);

router.patch("/:id/status", updateBookingStatus);

router.patch("/:id/assign-worker", assignWorker);

router.put("/bookings/:id/unassign", unassignWorker);

router.patch("/:id/cancel", cancelBooking);

router.get("/status/:bookingId", getBookingStatus);

router.delete("/:id", deleteBooking);

export default router;