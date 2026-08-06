import path from "node:path";
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: path.join(import.meta.dirname, "prisma", "schema.prisma"),
  migrate: {
    async url() {
      return process.env.DATABASE_URL;
    },
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
