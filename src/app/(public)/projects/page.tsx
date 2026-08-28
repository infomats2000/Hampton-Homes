import React from "react";
import { SearchPortal } from "@/components/search/search-portal";
import { getPublishedProperties } from "@/lib/properties/database-service";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const properties = await getPublishedProperties();
  return (
    <SearchPortal
      defaultListingType="PROJECT"
      title="New Developments & Off-The-Plan Projects"
      subtitle="Discover master-planned communities, architectural luxury towers, and off-the-plan opportunities."
      properties={properties}
    />
  );
}
