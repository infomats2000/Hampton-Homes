import { z } from "zod";

export const passwordSchema = z.string()
  .min(12, "Password must be at least 12 characters long")
  .max(128, "Password must be no more than 128 characters long")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[0-9]/, "Password must include a number")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character");

