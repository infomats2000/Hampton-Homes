import { notFound } from "next/navigation";

import { PropertyDetailClient } from "@/components/public/property-detail-client";
import { getPublishedProperty } from "@/lib/properties/database-service";

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPublishedProperty(decodeURIComponent(slug));
  if (!property) notFound();
  return <PropertyDetailClient property={property} />;
}
