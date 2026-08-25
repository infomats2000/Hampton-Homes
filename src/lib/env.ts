import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production", "test"]).default("development"),

  // ─── App URL (used by sitemap, OG tags, absolute redirects) ──────────────
  APP_URL: z.string().url().default("http://localhost:3000"),

  // ─── Database ─────────────────────────────────────────────────────────────
  DATABASE_URL: z.string().optional().default("postgresql://postgres:postgres@localhost:5432/agency_db"),
  DIRECT_URL: z.string().optional(),

  // ─── Authentication ───────────────────────────────────────────────────────
  JWT_SECRET: z.string().default("change-me-in-production-use-openssl-rand-base64-32"),
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),

  // ─── MRI Integration ──────────────────────────────────────────────────────
  MRI_DEMO_MODE: z.enum(["true", "false"]).default("true"),
  MRI_VAULT_BASE_URL: z.string().optional(),
  MRI_VAULT_API_KEY: z.string().optional(),
  MRI_VAULT_AGENCY_ID: z.string().optional(),
  MRI_PROPERTY_TREE_BASE_URL: z.string().optional(),
  MRI_PROPERTY_TREE_API_KEY: z.string().optional(),

  // ─── Webhook Secrets ──────────────────────────────────────────────────────
  HOMEPASS_WEBHOOK_SECRET: z.string().optional(),
  FLK_WEBHOOK_SECRET: z.string().optional(),
  PROPERTYME_WEBHOOK_SECRET: z.string().optional(),

  // ─── Email (Resend) ───────────────────────────────────────────────────────
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  APP_URL: process.env.APP_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  MRI_DEMO_MODE: process.env.MRI_DEMO_MODE,
  MRI_VAULT_BASE_URL: process.env.MRI_VAULT_BASE_URL,
  MRI_VAULT_API_KEY: process.env.MRI_VAULT_API_KEY,
  MRI_VAULT_AGENCY_ID: process.env.MRI_VAULT_AGENCY_ID,
  MRI_PROPERTY_TREE_BASE_URL: process.env.MRI_PROPERTY_TREE_BASE_URL,
  MRI_PROPERTY_TREE_API_KEY: process.env.MRI_PROPERTY_TREE_API_KEY,
  HOMEPASS_WEBHOOK_SECRET: process.env.HOMEPASS_WEBHOOK_SECRET,
  FLK_WEBHOOK_SECRET: process.env.FLK_WEBHOOK_SECRET,
  PROPERTYME_WEBHOOK_SECRET: process.env.PROPERTYME_WEBHOOK_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
});
