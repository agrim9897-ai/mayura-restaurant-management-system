import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  getMe,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// POST   /api/admin/login    → Authenticate admin credentials
router.post("/login", loginAdmin);

// POST   /api/admin/logout   → Clear admin session & cookies
router.post("/logout", logoutAdmin);

// GET    /api/admin/profile  → Get current admin profile (protected)
router.get("/profile", authMiddleware, getMe);

export default router;
