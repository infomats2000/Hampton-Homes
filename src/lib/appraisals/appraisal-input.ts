import { z } from "zod";

export const appraisalRequestSchema = z.object({
  address: z.string().trim().min(5).max(200),
  suburb: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(10).default("NSW"),
  postcode: z.string().trim().regex(/^\d{4}$/, "Enter a four-digit Australian postcode"),
  propertyType: z.enum(["House", "Apartment", "Townhouse", "Villa", "Land", "Commercial"]),
  bedrooms: z.coerce.number().int().min(0).max(20),
  bathrooms: z.coerce.number().int().min(0).max(20),
  ownerName: z.string().trim().min(2).max(100),
  ownerEmail: z.string().trim().email().max(254),
  ownerPhone: z.string().trim().min(8).max(30),
  sellingTimeframe: z.enum(["IMMEDIATELY", "1_3_MONTHS", "3_6_MONTHS", "CURIOUS"]),
  website: z.string().max(0).optional().default(""),
});

export const appraisalUpdateSchema = z.object({
  status: z.enum(["NEW", "ASSIGNED", "SCHEDULED", "COMPLETED", "ARCHIVED"]),
  assignedAgentId: z.string().uuid().nullable().optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
});

