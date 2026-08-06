import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

// Create a native pg connection pool
const pool = new pg.Pool({ connectionString });

// Create the Prisma adapter using the pg pool
const adapter = new PrismaPg(pool);

// Instantiate PrismaClient with the adapter (Prisma 7 requirement)
const prisma = new PrismaClient({ adapter });

/**
 * Verifies that the database connection is working.
 * Logs the result but does NOT crash the server if DB is unreachable,
 * so the health check endpoint can still report the status.
 * @returns {Promise<boolean>}
 */
export async function connectDatabase() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.error("⚠️  Database connection failed:", error.message);
    console.error("   The server will start, but database features won't work.");
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
