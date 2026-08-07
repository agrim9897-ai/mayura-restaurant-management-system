import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  loginAdmin,
  logoutAdmin,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// Rate limiter for forgot-password endpoint (max 5 requests per 15 mins per IP)
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    statusCode: 429,
    success: false,
    message: "Too many password reset attempts. Please try again after 15 minutes.",
  },
});

// POST   /api/admin/login           → Authenticate admin credentials
router.post("/login", loginAdmin);

// POST   /api/admin/logout          → Clear admin session & cookies
router.post("/logout", logoutAdmin);

// GET    /api/admin/profile         → Get current admin profile (protected)
router.get("/profile", authMiddleware, getMe);

// POST   /api/admin/forgot-password → Request password reset link (rate-limited)
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);

// POST   /api/admin/reset-password  → Reset password with token
router.post("/reset-password", resetPassword);

export default router;
