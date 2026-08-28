import React from "react";
import { SearchPortal } from "@/components/search/search-portal";
import { getPublishedProperties } from "@/lib/properties/database-service";

export const dynamic = "force-dynamic";

export default async function CommercialPage() {
  const properties = (await getPublishedProperties()).filter((property) => property.listingType.startsWith("COMMERCIAL"));
  return (
    <SearchPortal
      defaultListingType="COMMERCIAL_SALE"
      title="Commercial Real Estate & Assets"
      subtitle="Prime retail spaces, commercial offices, industrial warehouses, and investment assets across Australia."
      properties={properties}
    />
  );
}
