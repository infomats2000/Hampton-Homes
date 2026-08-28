import React from "react";
import { SearchPortal } from "@/components/search/search-portal";
import { getPublishedProperties } from "@/lib/properties/database-service";

export const dynamic = "force-dynamic";

export default async function SoldPage() {
  const properties = (await getPublishedProperties()).filter((property) => property.status === "SOLD");
  return (
    <SearchPortal
      defaultListingType="RESIDENTIAL_SALE"
      title="Recent Sales & Market Historical Data"
      subtitle="View verified sales prices and auction results across Sydney, Melbourne, and Brisbane."
      properties={properties}
    />
  );
}
