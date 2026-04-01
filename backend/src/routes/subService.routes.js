import express from "express";
import { createSubService, deleteSubService, getAllSubService, getSubServiceById, getSubServicesByService, updateSubService } from "../controllers/subService.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router = express.Router();
router.post("/",upload.fields([
    { name: "image", maxCount: 1 },
  ]),
    
    createSubService);

router.get("/", getAllSubService)

router.get("/service/:serviceId", getSubServicesByService);

router.get("/:id", getSubServiceById);

router.patch("/:id", updateSubService);

router.delete("/:id", deleteSubService);


export default router;