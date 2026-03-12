
import express from "express";
import { approveSettlement, submitSettlement } from "../controllers/settlement.controllers.js";

const router = express.Router();
router.post("/submit",submitSettlement);
router.patch("/approve/:id",approveSettlement);

export default router;