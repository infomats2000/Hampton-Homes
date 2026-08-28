import { MetadataRoute } from "next";
import { MOCK_AGENTS } from "@/lib/properties/service";
import { getPublishedProperties } from "@/lib/properties/database-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL || "https://infomats.com.au";
  const properties = await getPublishedProperties();

  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/buy",
    "/rent",
    "/sold",
    "/commercial",
    "/projects",
    "/agents",
    "/offices",
    "/suburbs",
    "/auctions",
    "/sell",
    "/about",
    "/contact",
    "/news",
    "/property-management",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));

  const propertyPages: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${baseUrl}/property/${p.externalId}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "hourly",
    priority: 0.9,
  }));

  const agentPages: MetadataRoute.Sitemap = MOCK_AGENTS.map((a) => ({
    url: `${baseUrl}/agents/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...propertyPages, ...agentPages];
}
