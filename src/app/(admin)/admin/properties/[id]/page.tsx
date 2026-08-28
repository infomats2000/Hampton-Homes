import { notFound } from "next/navigation";

import { PropertyForm } from "@/components/admin/property-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({ params }: PageProps<"/admin/properties/[id]">) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { property: { include: { media: { where: { mediaType: "PHOTO" }, orderBy: { displayOrder: "asc" } }, websiteOverride: true } } },
  });
  if (!listing) notFound();

  const property = listing.property;
  const override = property.websiteOverride;
  return <PropertyForm listingId={listing.id} mriManaged={Boolean(property.mriId)} initialValues={{
    streetNumber: property.streetNumber ?? "", streetName: property.streetName,
    suburb: property.suburb, state: property.state, postcode: property.postcode,
    bedrooms: property.bedrooms ?? 0, bathrooms: property.bathrooms ?? 0, carSpaces: property.carSpaces ?? 0,
    landAreaSqm: property.landAreaSqm ?? undefined, buildingAreaSqm: property.buildingAreaSqm ?? undefined,
    propertyType: property.propertyType, listingType: listing.listingType, status: listing.status,
    headline: listing.headline, description: listing.description, priceDisplay: listing.priceDisplay,
    priceNumeric: listing.priceNumeric ?? undefined, publish: Boolean(listing.publishedAt),
    photosText: property.media.map((photo) => photo.url).join("\n"),
    customHeadline: override?.customHeadline ?? "", customBadge: override?.customBadge ?? "",
    seoTitle: override?.seoTitle ?? "", seoDescription: override?.seoDescription ?? "",
    isFeaturedHomepage: override?.isFeaturedHomepage ?? false, isFeaturedSearch: override?.isFeaturedSearch ?? false,
  }} />;
}
