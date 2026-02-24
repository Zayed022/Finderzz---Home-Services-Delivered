import express from "express";
import { createSubService, deleteSubService, getSubServicesByService, updateSubService } from "../controllers/subService.controllers.js";


const router = express.Router();
router.post("/", createSubService);                             // done
router.get("/:serviceId", getSubServicesByService);             // done
router.patch("/:id", updateSubService);
router.delete("/:id", deleteSubService);


export default router;