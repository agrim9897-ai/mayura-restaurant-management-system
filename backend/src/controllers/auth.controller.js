import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
  findAdminByEmail,
  findAdminById,
  comparePassword,
  signToken,
  requestPasswordReset,
  resetAdminPassword,
} from "../services/auth.service.js";

// Cookie options for httpOnly JWT cookie
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

/**
 * POST /api/auth/login or /api/admin/login
 * Authenticate admin and return JWT via httpOnly cookie + response body.
 */
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // 1. Find admin by email
  const admin = await findAdminByEmail(email);
  if (!admin) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 2. Verify password
  const isMatch = await comparePassword(password, admin.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 3. Generate JWT
  const token = signToken(admin);

  // 4. Set httpOnly cookie
  res.cookie("token", token, COOKIE_OPTIONS);

  // 5. Return success with token in body
  res.status(200).json(
    new ApiResponse(200, {
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    }, "Login successful")
  );
});

/**
 * POST /api/auth/logout or /api/admin/logout
 * Clear the JWT cookie.
 */
export const logoutAdmin = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

/**
 * GET /api/auth/me or /api/admin/profile
 * Return the currently authenticated admin's profile.
 */
export const getMe = asyncHandler(async (req, res) => {
  const admin = await findAdminById(req.admin.id);
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  res.status(200).json(new ApiResponse(200, admin, "Profile fetched"));
});

/**
 * POST /api/admin/forgot-password or /api/auth/forgot-password
 * Send password reset link to admin email.
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email address is required");
  }

  const message = await requestPasswordReset(email);
  res.status(200).json(new ApiResponse(200, null, message));
});

/**
 * POST /api/admin/reset-password or /api/auth/reset-password
 * Reset admin password using token.
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    throw new ApiError(400, "Token and new password are required");
  }

  const message = await resetAdminPassword({ token, newPassword });
  res.status(200).json(new ApiResponse(200, null, message));
});
