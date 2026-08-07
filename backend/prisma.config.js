import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// Use DIRECT_URL for Prisma CLI commands (db pull, migrate, validate) to bypass transaction pooler
const directUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString: directUrl });
const adapter = new PrismaPg(pool);

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    url: directUrl,
  },

  migrate: {
    adapter: async () => adapter,
  },
});
