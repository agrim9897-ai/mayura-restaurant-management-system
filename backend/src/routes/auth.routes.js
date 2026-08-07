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

// POST   /api/auth/login            → Authenticate admin
router.post("/login", loginAdmin);

// POST   /api/auth/logout           → Clear auth cookie
router.post("/logout", logoutAdmin);

// GET    /api/auth/me               → Get current admin profile (protected)
router.get("/me", authMiddleware, getMe);

// POST   /api/auth/forgot-password  → Request password reset link (rate-limited)
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);

// POST   /api/auth/reset-password   → Reset password with token
router.post("/reset-password", resetPassword);

export default router;
