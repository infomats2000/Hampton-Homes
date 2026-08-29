import "server-only";

import { prisma } from "@/lib/prisma";
import type { MRIRawProperty } from "@/lib/mri/provider.interface";
import type { Prisma } from "@prisma/client";

const listingInclude = {
  property: {
    include: {
      media: { orderBy: [{ isPrimary: "desc" as const }, { displayOrder: "asc" as const }] },
      websiteOverride: true,
    },
  },
  agents: {
    where: { isPrimary: true },
    take: 1,
    include: { agent: { include: { user: true, office: true } } },
  },
  inspections: { where: { startTime: { gte: new Date() } }, orderBy: { startTime: "asc" as const } },
} satisfies Prisma.ListingInclude;

type ListingRecord = Prisma.ListingGetPayload<{ include: typeof listingInclude }>;

function toView(listing: ListingRecord): MRIRawProperty {
  const property = listing.property;
  const assignment = listing.agents[0]?.agent;
  const provider = property.mriProvider === "PROPERTY_TREE" ? "PROPERTY_TREE" : "VAULT";

  return {
    externalId: listing.id,
    provider,
    streetNumber: property.streetNumber ?? "",
    streetName: property.streetName,
    suburb: property.suburb,
    state: property.state,
    postcode: property.postcode,
    bedrooms: property.bedrooms ?? 0,
    bathrooms: property.bathrooms ?? 0,
    carSpaces: property.carSpaces ?? 0,
    landAreaSqm: property.landAreaSqm ?? undefined,
    buildingAreaSqm: property.buildingAreaSqm ?? undefined,
    propertyType: property.propertyType,
    listingType: listing.listingType,
    status: listing.status,
    headline: property.websiteOverride?.customHeadline ?? listing.headline,
    description: listing.description,
    priceDisplay: listing.priceDisplay,
    priceNumeric: listing.priceNumeric ?? 0,
    primaryAgentName: assignment ? `${assignment.user.firstName} ${assignment.user.lastName}` : "Infomats Real Estate",
    primaryAgentEmail: assignment?.user.email ?? "info@infomats.net",
    officeName: assignment?.office.name ?? "Infomats Real Estate",
    photos: property.media.filter((item) => item.mediaType === "PHOTO").map((item) => item.url),
    inspections: listing.inspections.map((item) => ({ startTime: item.startTime.toISOString(), endTime: item.endTime.toISOString() })),
    auctionDate: listing.auctionDate?.toISOString(),
    auctionLocation: listing.auctionLocation ?? undefined,
    updatedAt: listing.updatedAt.toISOString(),
  };
}

export async function getPublishedProperties(options?: {
  listingType?: "RESIDENTIAL_SALE" | "RESIDENTIAL_RENT";
  featuredOnly?: boolean;
  limit?: number;
}): Promise<MRIRawProperty[]> {
  const listings = await prisma.listing.findMany({
    where: {
      publishedAt: { lte: new Date() },
      status: { notIn: ["DRAFT", "WITHDRAWN", "OFF_MARKET"] },
      ...(options?.listingType ? { listingType: options.listingType } : {}),
      ...(options?.featuredOnly ? { property: { websiteOverride: { isFeaturedHomepage: true } } } : {}),
    },
    include: listingInclude,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    ...(options?.limit ? { take: options.limit } : {}),
  });
  return listings.map(toView);
}

export async function getAllProperties(): Promise<MRIRawProperty[]> {
  const listings = await prisma.listing.findMany({ include: listingInclude, orderBy: { updatedAt: "desc" } });
  return listings.map(toView);
}

export async function getPublishedProperty(id: string): Promise<MRIRawProperty | null> {
  const listing = await prisma.listing.findFirst({
    where: {
      OR: [{ id }, { property: { mriId: id } }],
      publishedAt: { lte: new Date() },
      status: { notIn: ["DRAFT", "WITHDRAWN", "OFF_MARKET"] },
    },
    include: listingInclude,
  });
  return listing ? toView(listing) : null;
}
