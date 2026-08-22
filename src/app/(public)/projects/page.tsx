import React from "react";
import { SearchPortal } from "@/components/search/search-portal";

export default function ProjectsPage() {
  return (
    <SearchPortal
      defaultListingType="PROJECT"
      title="New Developments & Off-The-Plan Projects"
      subtitle="Discover master-planned communities, architectural luxury towers, and off-the-plan opportunities."
    />
  );
}
