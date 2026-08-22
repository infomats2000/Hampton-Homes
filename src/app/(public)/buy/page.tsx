import React from "react";
import { SearchPortal } from "@/components/search/search-portal";

export default function BuyPage() {
  return (
    <SearchPortal
      defaultListingType="RESIDENTIAL_SALE"
      title="Properties for Sale in Australia"
      subtitle="Explore luxury houses, coastal apartments, and family residences synchronized live from MRI Vault."
    />
  );
}
