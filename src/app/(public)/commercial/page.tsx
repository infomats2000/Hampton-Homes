import React from "react";
import { SearchPortal } from "@/components/search/search-portal";

export default function CommercialPage() {
  return (
    <SearchPortal
      defaultListingType="COMMERCIAL_SALE"
      title="Commercial Real Estate & Assets"
      subtitle="Prime retail spaces, commercial offices, industrial warehouses, and investment assets across Australia."
    />
  );
}
