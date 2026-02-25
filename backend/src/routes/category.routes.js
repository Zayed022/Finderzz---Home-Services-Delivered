import express from "express";

import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { createCategory, deleteCategory, getCategories, getCategoriesWithServices, updateCategory } from "../controllers/category.controllers.js";
const router = express.Router();

router.post("/",  createCategory);              // done
router.get("/", getCategories);                 // done
router.get("/with-services", getCategoriesWithServices);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;