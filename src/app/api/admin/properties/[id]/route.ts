import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { propertyInputSchema } from "@/lib/properties/property-input";
import { getCurrentUser } from "@/lib/auth";

async function isAdmin() {
  const user = await getCurrentUser();
  return Boolean(user?.roles.some((role) => role === "ADMIN" || role === "SUPER_ADMIN"));
}

type PropertyRouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: PropertyRouteContext) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { property: { include: { media: { orderBy: { displayOrder: "asc" } }, websiteOverride: true } } },
  });
  if (!listing) return NextResponse.json({ error: "Property listing not found" }, { status: 404 });
  return NextResponse.json({ listing });
}

export async function PATCH(request: Request, { params }: PropertyRouteContext) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const { id } = await params;
  const parsed = propertyInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid property data", details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.listing.findUnique({ where: { id }, include: { property: true } });
  if (!existing) return NextResponse.json({ error: "Property listing not found" }, { status: 404 });

  const input = parsed.data;
  await prisma.$transaction(async (tx) => {
    await tx.property.update({
      where: { id: existing.propertyId },
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
      },
    });
    await tx.listing.update({
      where: { id },
      data: {
        listingType: input.listingType,
        status: input.status,
        headline: input.headline,
        description: input.description,
        priceDisplay: input.priceDisplay,
        priceNumeric: input.priceNumeric,
        publishedAt: input.publish ? existing.publishedAt ?? new Date() : null,
      },
    });
    await tx.propertyMedia.deleteMany({ where: { propertyId: existing.propertyId, mediaType: "PHOTO" } });
    if (input.photos.length) {
      await tx.propertyMedia.createMany({
        data: input.photos.map((url, index) => ({ propertyId: existing.propertyId, url, mediaType: "PHOTO", displayOrder: index, isPrimary: index === 0 })),
      });
    }
    await tx.propertyWebsiteOverride.upsert({
      where: { propertyId: existing.propertyId },
      create: {
        propertyId: existing.propertyId,
        customHeadline: input.customHeadline || null,
        customBadge: input.customBadge || null,
        seoTitle: input.seoTitle || null,
        seoDescription: input.seoDescription || null,
        isFeaturedHomepage: input.isFeaturedHomepage,
        isFeaturedSearch: input.isFeaturedSearch,
      },
      update: {
        customHeadline: input.customHeadline || null,
        customBadge: input.customBadge || null,
        seoTitle: input.seoTitle || null,
        seoDescription: input.seoDescription || null,
        isFeaturedHomepage: input.isFeaturedHomepage,
        isFeaturedSearch: input.isFeaturedSearch,
      },
    });
  });
  return NextResponse.json({ id });
}

export async function DELETE(_request: Request, { params }: PropertyRouteContext) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const { id } = await params;
  const result = await prisma.listing.updateMany({
    where: { id },
    data: { status: "WITHDRAWN", publishedAt: null },
  });
  if (result.count === 0) return NextResponse.json({ error: "Property listing not found" }, { status: 404 });
  return NextResponse.json({ id, archived: true });
}
