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
} from "../controllers/worker.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.post("/register", upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panImage", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
    registerWorker);
router.post("/login", workerLogin);

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

router.get("/history/:workerId", getWorkerHistory);

router.get("/earnings/:workerId", getWorkerEarnings);

router.patch("/availability/:workerId", toggleAvailability);

router.get("/approved", getApprovedWorkers);


export default router;