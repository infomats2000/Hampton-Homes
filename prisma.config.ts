import dotenv from "dotenv";
import { defineConfig } from "@prisma/config";

// Load .env.local first (overriding .env), matching Next.js precedence
dotenv.config({ path: ".env.local" });
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
});
