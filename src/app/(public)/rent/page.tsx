import React from "react";
import { SearchPortal } from "@/components/search/search-portal";
import { getPublishedProperties } from "@/lib/properties/database-service";

export const dynamic = "force-dynamic";

export default async function RentPage() {
  const properties = await getPublishedProperties({ listingType: "RESIDENTIAL_RENT" });
  return (
    <SearchPortal
      defaultListingType="RESIDENTIAL_RENT"
      title="Properties for Rent in Australia"
      subtitle="Find residential rental properties, managed apartments, and prestige family homes synchronized from MRI Property Tree."
      properties={properties}
    />
  );
}
