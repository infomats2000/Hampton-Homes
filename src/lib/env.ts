import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production", "test"]).default("development"),
  APP_NAME: z.string().default("Hampton Homes"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().optional().default("postgresql://postgres:postgres@localhost:5432/hampton_homes"),
  JWT_SECRET: z.string().default("hampton-homes-super-secret-jwt-key-change-in-prod-2026"),
  MRI_DEMO_MODE: z.enum(["true", "false"]).default("true"),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  APP_NAME: process.env.APP_NAME,
  APP_URL: process.env.APP_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  MRI_DEMO_MODE: process.env.MRI_DEMO_MODE,
});
