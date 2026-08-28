import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllProperties } from "@/lib/properties/database-service";
import { propertyInputSchema } from "@/lib/properties/property-input";
import { getCurrentUser } from "@/lib/auth";

async function isAdmin() {
  const user = await getCurrentUser();
  return Boolean(user?.roles.some((role) => role === "ADMIN" || role === "SUPER_ADMIN"));
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  return NextResponse.json({ properties: await getAllProperties() });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const parsed = propertyInputSchema.safeParse(await request.json().catch(() => null));
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
        landAreaSqm: input.landAreaSqm,
        buildingAreaSqm: input.buildingAreaSqm,
        propertyType: input.propertyType,
        media: {
          create: input.photos.map((url, index) => ({ url, mediaType: "PHOTO", displayOrder: index, isPrimary: index === 0 })),
        },
        websiteOverride: {
          create: {
            customHeadline: input.customHeadline || null,
            customBadge: input.customBadge || null,
            seoTitle: input.seoTitle || null,
            seoDescription: input.seoDescription || null,
            isFeaturedHomepage: input.isFeaturedHomepage,
            isFeaturedSearch: input.isFeaturedSearch,
          },
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
