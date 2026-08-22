export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  publishedAt: string;
  status: "PUBLISHED" | "DRAFT" | "SCHEDULED";
  excerpt: string;
}

export const MOCK_ARTICLES: ArticleItem[] = [
  {
    id: "art-101",
    title: "Sydney Real Estate Market Insights Q3 2026",
    slug: "sydney-market-insights-q3-2026",
    category: "Market Reports",
    author: "Sarah Hampton",
    publishedAt: "2026-08-20",
    status: "PUBLISHED",
    excerpt: "Analysis of Australian interest rate impacts, Sydney waterfront property demand, and Parramatta commercial growth.",
  },
  {
    id: "art-102",
    title: "Top 5 Renovations That Add Value to Australian Family Homes",
    slug: "top-5-renovations-australian-homes",
    category: "Property Guides",
    author: "Marcus Vance",
    publishedAt: "2026-08-15",
    status: "PUBLISHED",
    excerpt: "From alfresco entertainer terraces to marble kitchens, discover high-yield property improvements.",
  },
];
