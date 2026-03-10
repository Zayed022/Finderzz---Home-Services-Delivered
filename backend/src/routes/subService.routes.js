import express from "express";
import { createSubService, deleteSubService, getSubServiceById, getSubServicesByService, updateSubService } from "../controllers/subService.controllers.js";


const router = express.Router();
router.post("/", createSubService);  
router.get("/:serviceId", getSubServicesByService);                            // done
router.get("/:subId", getSubServiceById);            // done
router.patch("/:id", updateSubService);
router.delete("/:id", deleteSubService);


export default router;