import React from "react";
import { SearchPortal } from "@/components/search/search-portal";

export default function RentPage() {
  return (
    <SearchPortal
      defaultListingType="RESIDENTIAL_RENT"
      title="Properties for Rent in Australia"
      subtitle="Find residential rental properties, managed apartments, and prestige family homes synchronized from MRI Property Tree."
    />
  );
}
