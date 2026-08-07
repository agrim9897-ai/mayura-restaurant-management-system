import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/database.js";
import config from "../config/index.js";

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
  return prisma.admin.findUnique({ where: { email } });
}

/**
 * Find an admin by ID.
 */
export async function findAdminById(id) {
  return prisma.admin.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, createdAt: true },
  });
}

/**
 * Create a new admin user (for seeding).
 */
export async function createAdmin({ name, email, password }) {
  const hashedPassword = await hashPassword(password);
  return prisma.admin.create({
    data: { name, email, password: hashedPassword },
  });
}
