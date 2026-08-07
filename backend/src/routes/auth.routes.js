import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  getMe,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// POST   /api/auth/login    → Authenticate admin
router.post("/login", loginAdmin);

// POST   /api/auth/logout   → Clear auth cookie
router.post("/logout", logoutAdmin);

// GET    /api/auth/me       → Get current admin profile (protected)
router.get("/me", authMiddleware, getMe);

export default router;
