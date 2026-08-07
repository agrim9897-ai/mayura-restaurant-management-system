/**
 * Admin Seed Script
 * Creates or updates the default admin account with bcrypt-hashed credentials.
 *
 * Usage: node src/scripts/seedAdmin.js
 */
import dotenv from "dotenv";
dotenv.config();

import prisma from "../config/database.js";
import { hashPassword } from "../services/auth.service.js";

const DEFAULT_ADMIN = {
  name: "Admin Manager",
  email: "admin@mayura.com",
  password: "Admin@123",
};

async function seed() {
  console.log("\n🌱 Seeding default admin account...\n");

  const hashedPassword = await hashPassword(DEFAULT_ADMIN.password);

  const admin = await prisma.admin.upsert({
    where: { email: DEFAULT_ADMIN.email },
    update: {
      password: hashedPassword,
      name: DEFAULT_ADMIN.name,
    },
    create: {
      name: DEFAULT_ADMIN.name,
      email: DEFAULT_ADMIN.email,
      password: hashedPassword,
    },
  });

  console.log("✅ Default admin account ready!");
  console.log(`   Email:    ${admin.email}`);
  console.log(`   Password: ${DEFAULT_ADMIN.password}`);
  console.log(`   ID:       ${admin.id}\n`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
