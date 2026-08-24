import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || "https://infomats.com.au";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/customer/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
