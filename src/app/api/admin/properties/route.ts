import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getAllProperties } from "@/lib/properties/database-service";

const propertyInput = z.object({
  streetNumber: z.string().trim().max(20).optional().default(""),
  streetName: z.string().trim().min(2).max(150),
  suburb: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(10).default("NSW"),
  postcode: z.string().trim().regex(/^\d{4}$/),
  bedrooms: z.coerce.number().int().min(0).max(100).default(0),
  bathrooms: z.coerce.number().int().min(0).max(100).default(0),
  carSpaces: z.coerce.number().int().min(0).max(100).default(0),
  propertyType: z.string().trim().min(2).max(50),
  listingType: z.enum(["RESIDENTIAL_SALE", "RESIDENTIAL_RENT", "COMMERCIAL_SALE", "COMMERCIAL_RENT", "PROJECT"]),
  status: z.enum(["DRAFT", "COMING_SOON", "FOR_SALE", "FOR_RENT", "AUCTION", "UNDER_OFFER", "UNDER_CONTRACT", "SOLD", "LEASED", "WITHDRAWN", "OFF_MARKET"]),
  headline: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(20000),
  priceDisplay: z.string().trim().min(1).max(100),
  priceNumeric: z.coerce.number().nonnegative().optional(),
  photos: z.array(z.string().url()).max(50).default([]),
  publish: z.boolean().default(false),
});

export async function GET() {
  return NextResponse.json({ properties: await getAllProperties() });
}

export async function POST(request: Request) {
  const parsed = propertyInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid property data", details: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;
  const listing = await prisma.$transaction(async (tx) => {
    const property = await tx.property.create({
      data: {
        streetNumber: input.streetNumber || null,
        streetName: input.streetName,
        suburb: input.suburb,
        state: input.state.toUpperCase(),
        postcode: input.postcode,
        bedrooms: input.bedrooms,
        bathrooms: input.bathrooms,
        carSpaces: input.carSpaces,
        propertyType: input.propertyType,
        media: {
          create: input.photos.map((url, index) => ({ url, mediaType: "PHOTO", displayOrder: index, isPrimary: index === 0 })),
        },
      },
    });

    return tx.listing.create({
      data: {
        propertyId: property.id,
        listingType: input.listingType,
        status: input.status,
        headline: input.headline,
        description: input.description,
        priceDisplay: input.priceDisplay,
        priceNumeric: input.priceNumeric,
        publishedAt: input.publish ? new Date() : null,
      },
    });
  });

  return NextResponse.json({ id: listing.id }, { status: 201 });
}
