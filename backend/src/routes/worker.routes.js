import express from "express";
import {
  registerWorker,
  workerLogin,
  getWorkerDashboard,
  getAssignedJobs,
  getJobDetails,
  startJob,
  completeJob,
  toggleAvailability,
  getWorkerProfile,
  getWorkerHistory,
  getWorkerEarnings,
  updateWorkerProfile,
  getApprovedWorkers,
  getWorkerDailySettlement,
  workerLogout,
  getRegisteredWorkers,
  rejectWorker,
  approveWorker,
  getAllSettlements,
  getSettlementStats,
  getSettlementsByStatus,
  getDashboardStats,
} from "../controllers/worker.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panImage", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  registerWorker
);

router.post("/login", workerLogin);

/* DASHBOARD STATS FIRST */
router.get("/dashboard/stats", getDashboardStats);

/* THEN PARAM ROUTES */
router.get("/dashboard/:workerId", getWorkerDashboard);

router.get("/profile/:workerId", getWorkerProfile);

router.patch(
  "/profile/:workerId",
  upload.single("profileImage"),
  updateWorkerProfile
);

router.get("/jobs/:workerId", getAssignedJobs);
router.get("/job/:bookingId", getJobDetails);

router.patch("/job/start/:bookingId", startJob);
router.patch("/job/complete/:bookingId", completeJob);

router.patch("/approve/:id", approveWorker);
router.patch("/reject/:id", rejectWorker);

router.get("/history/:workerId", getWorkerHistory);
router.get("/earnings/:workerId", getWorkerEarnings);

router.patch("/availability/:workerId", toggleAvailability);

router.get("/settlement/:workerId", getWorkerDailySettlement);

router.post("/logout/:workerId", workerLogout);

router.get("/approved", getApprovedWorkers);
router.get("/pending", getRegisteredWorkers);

router.get("/all", getAllSettlements);
router.get("/stats", getSettlementStats);
router.get("/all/status", getSettlementsByStatus);

export default router;