import React from "react";
import { SearchPortal } from "@/components/search/search-portal";

export default function SoldPage() {
  return (
    <SearchPortal
      defaultListingType="RESIDENTIAL_SALE"
      title="Recent Sales & Market Historical Data"
      subtitle="View verified sales prices and auction results across Sydney, Melbourne, and Brisbane."
    />
  );
}
