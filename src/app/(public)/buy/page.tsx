import React from "react";
import { SearchPortal } from "@/components/search/search-portal";
import { getPublishedProperties } from "@/lib/properties/database-service";

export const dynamic = "force-dynamic";

export default async function BuyPage() {
  const properties = await getPublishedProperties({ listingType: "RESIDENTIAL_SALE" });
  return (
    <SearchPortal
      defaultListingType="RESIDENTIAL_SALE"
      title="Properties for Sale in Australia"
      subtitle="Explore luxury houses, coastal apartments, and family residences synchronized live from MRI Vault."
      properties={properties}
    />
  );
}
