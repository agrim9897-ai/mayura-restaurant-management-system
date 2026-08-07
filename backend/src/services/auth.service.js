import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../config/database.js";
import config from "../config/index.js";
import { sendPasswordResetEmail } from "./email.service.js";

const SALT_ROUNDS = 12;

/**
 * Hash a plaintext password with bcrypt.
 */
export async function hashPassword(plaintext) {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

/**
 * Compare a plaintext password against a bcrypt hash.
 */
export async function comparePassword(plaintext, hash) {
  return bcrypt.compare(plaintext, hash);
}

/**
 * Sign a JWT for a given admin payload.
 * @returns {string} JWT token
 */
export function signToken(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

/**
 * Verify and decode a JWT token.
 * @returns {object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

/**
 * Find an admin by email.
 */
export async function findAdminByEmail(email) {
  return prisma.admin.findUnique({ where: { email: email.toLowerCase().trim() } });
}

/**
 * Find an admin by ID.
 */
export async function findAdminById(id) {
  return prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatarUrl: true,
      role: true,
      status: true,
      lastLogin: true,
      emailNotifications: true,
      reservationNotifs: true,
      preferredLanguage: true,
      createdAt: true,
    },
  });
}

/**
 * Update admin profile information.
 */
export async function updateAdminProfile(id, data) {
  return prisma.admin.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatarUrl: true,
      role: true,
      status: true,
      lastLogin: true,
      emailNotifications: true,
      reservationNotifs: true,
      preferredLanguage: true,
      createdAt: true,
    },
  });
}

/**
 * Change admin password with current password verification.
 */
export async function changeAdminPassword(id, { currentPassword, newPassword, confirmPassword }) {
  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("All password fields are required.");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("New passwords do not match.");
  }

  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) {
    throw new Error("Admin not found.");
  }

  const isMatch = await comparePassword(currentPassword, admin.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect.");
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.admin.update({
    where: { id },
    data: { password: hashedPassword },
  });

  return "Password changed successfully.";
}

/**
 * Create a new admin user (for seeding).
 */
export async function createAdmin({ name, email, password }) {
  const hashedPassword = await hashPassword(password);
  return prisma.admin.create({
    data: { name, email: email.toLowerCase().trim(), password: hashedPassword },
  });
}

/**
 * Request password reset email (Generates crypto token & stores SHA256 hash in DB).
 * Returns generic message to prevent email enumeration attacks.
 */
export async function requestPasswordReset(email) {
  const cleanEmail = (email || "").toLowerCase().trim();
  const admin = await findAdminByEmail(cleanEmail);

  if (admin) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        resetPasswordToken: tokenHash,
        resetPasswordExpires: expiresAt,
      },
    });

    const resetUrl = `${config.corsOrigin}/admin/reset-password?token=${rawToken}`;
    await sendPasswordResetEmail({ to: admin.email, resetUrl });
  }

  return "If an account exists with that email, a password reset link has been sent.";
}

/**
 * Reset admin password using token.
 */
export async function resetAdminPassword({ token, newPassword }) {
  if (!token) {
    throw new Error("Password reset token is missing.");
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const admin = await prisma.admin.findFirst({
    where: {
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { gte: new Date() },
    },
  });

  if (!admin) {
    throw new Error("Password reset token is invalid or has expired.");
  }

  // Complexity check: Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  return "Password changed successfully. Please log in again.";
}
