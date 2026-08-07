import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcrypt";

dotenv.config();

let connectionString = process.env.DATABASE_URL || "postgresql://postgres:Agrim%4011@localhost:5432/mayura_db?schema=public";

// Clean up incompatible connection parameters for remote poolers
if (connectionString.includes("&channel_binding=require")) {
  connectionString = connectionString.replace("&channel_binding=require", "");
}
if (connectionString.includes("?channel_binding=require")) {
  connectionString = connectionString.replace("?channel_binding=require", "?");
}

const isRemoteDb =
  connectionString.includes("neon.tech") ||
  connectionString.includes("onrender.com") ||
  connectionString.includes("amazonaws.com") ||
  connectionString.includes("sslmode=require");

// Create a native pg connection pool with SSL options if connecting to remote DB
const pool = new pg.Pool({
  connectionString,
  ...(isRemoteDb ? { ssl: { rejectUnauthorized: false } } : {}),
});

// Create the Prisma adapter using the pg pool
const adapter = new PrismaPg(pool);

// Instantiate PrismaClient with the adapter (Prisma 7 requirement)
const prisma = new PrismaClient({ adapter });

/**
 * Ensures at least one default admin account exists in the database.
 * If no admin is found, automatically seeds admin@mayura.com / Admin@123.
 */
export async function ensureDefaultAdmin() {
  try {
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash("Admin@123", 12);
      await prisma.admin.create({
        data: {
          name: "Admin Manager",
          email: "admin@mayura.com",
          password: hashedPassword,
          role: "Admin",
          status: "Active",
          phone: "+91 98765 00000",
        },
      });
      console.log("🌱 Default admin account seeded: admin@mayura.com / Admin@123");
    }
  } catch (error) {
    console.error("⚠️ Default admin auto-seed warning:", error.message);
  }
}

/**
 * Verifies that the database connection is working and ensures default admin is seeded.
 * @returns {Promise<boolean>}
 */
export async function connectDatabase() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected successfully");
    await ensureDefaultAdmin();
    return true;
  } catch (error) {
    console.error("⚠️  Database connection failed:", error.message);
    console.error("   Update DATABASE_URL in .env with correct credentials.\n");
    return false;
  }
}

/**
 * Checks if the database is reachable (for health checks).
 * @returns {Promise<boolean>}
 */
export async function isDatabaseHealthy() {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

/**
 * Gracefully disconnects from the database.
 */
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    await pool.end();
  } catch {
    // Ignore errors during shutdown
  }
  console.log("🔌 Database disconnected");
}

export default prisma;
