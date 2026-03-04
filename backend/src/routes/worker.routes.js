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

router.get("/jobs/:workerId", getAssignedJobs);
router.get("/job/:bookingId", getJobDetails);

router.patch("/job/start/:bookingId", startJob);
router.patch("/job/complete/:bookingId", completeJob);

router.patch("/availability/:workerId", toggleAvailability);

export default router;