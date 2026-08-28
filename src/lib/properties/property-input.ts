import { z } from "zod";

export const propertyInputSchema = z.object({
  streetNumber: z.string().trim().max(20).optional().default(""),
  streetName: z.string().trim().min(2).max(150),
  suburb: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(10).default("NSW"),
  postcode: z.string().trim().regex(/^\d{4}$/, "Enter a four-digit Australian postcode"),
  bedrooms: z.coerce.number().int().min(0).max(100).default(0),
  bathrooms: z.coerce.number().int().min(0).max(100).default(0),
  carSpaces: z.coerce.number().int().min(0).max(100).default(0),
  landAreaSqm: z.coerce.number().nonnegative().optional(),
  buildingAreaSqm: z.coerce.number().nonnegative().optional(),
  propertyType: z.string().trim().min(2).max(50),
  listingType: z.enum(["RESIDENTIAL_SALE", "RESIDENTIAL_RENT", "COMMERCIAL_SALE", "COMMERCIAL_RENT", "PROJECT"]),
  status: z.enum(["DRAFT", "COMING_SOON", "FOR_SALE", "FOR_RENT", "AUCTION", "UNDER_OFFER", "UNDER_CONTRACT", "SOLD", "LEASED", "WITHDRAWN", "OFF_MARKET"]),
  headline: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(20000),
  priceDisplay: z.string().trim().min(1).max(100),
  priceNumeric: z.coerce.number().nonnegative().optional(),
  photos: z.array(z.string().url()).max(50).default([]),
  publish: z.boolean().default(false),
  customHeadline: z.string().trim().max(200).optional().default(""),
  customBadge: z.string().trim().max(80).optional().default(""),
  seoTitle: z.string().trim().max(70).optional().default(""),
  seoDescription: z.string().trim().max(170).optional().default(""),
  isFeaturedHomepage: z.boolean().default(false),
  isFeaturedSearch: z.boolean().default(false),
});

export type PropertyInput = z.infer<typeof propertyInputSchema>;
