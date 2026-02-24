import express from "express";
import {
  register,
  login,
  googleLogin,
  getCurrentUser,
} from "../controllers/user.controllers.js"
import { authMiddleware } from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", authMiddleware, getCurrentUser);

export default router;