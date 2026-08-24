/**
 * Agency Configuration — White-Label Master App
 *
 * All agency-specific branding, contact details, licensing, and feature flags
 * are read from environment variables. To deploy a new client instance, simply
 * fill in their details in .env.local (or Vercel Environment Variables).
 *
 * This is the SINGLE source of truth. Never hardcode agency details in components.
 */

// ─── Brand & Identity ────────────────────────────────────────────────────────

export const AGENCY_NAME = process.env.NEXT_PUBLIC_AGENCY_NAME ?? "Infomats Real Estate ERP";
export const AGENCY_LEGAL_NAME = process.env.NEXT_PUBLIC_AGENCY_LEGAL_NAME ?? "Infomats Real Estate ERP Pty Ltd";
export const AGENCY_TAGLINE = process.env.NEXT_PUBLIC_AGENCY_TAGLINE ?? "Australia's premier real estate management platform & ERP";
export const AGENCY_ABN = process.env.NEXT_PUBLIC_AGENCY_ABN ?? "84 123 456 789";
export const AGENCY_LICENCE = process.env.NEXT_PUBLIC_AGENCY_LICENCE ?? ""; // NSW Fair Trading / State licence number
export const AGENCY_STATE = process.env.NEXT_PUBLIC_AGENCY_STATE ?? "NSW"; // Primary operating state

// ─── Contact Details ─────────────────────────────────────────────────────────

export const AGENCY_PHONE = process.env.NEXT_PUBLIC_AGENCY_PHONE ?? "1300 426 786";
export const AGENCY_PHONE_DISPLAY = process.env.NEXT_PUBLIC_AGENCY_PHONE_DISPLAY ?? "1300 INFOMATS (1300 426 786)";
export const AGENCY_EMAIL = process.env.NEXT_PUBLIC_AGENCY_EMAIL ?? "enquiries@infomats.com.au";
export const AGENCY_HEAD_OFFICE_ADDRESS = process.env.NEXT_PUBLIC_AGENCY_HEAD_OFFICE_ADDRESS ?? "Level 24, 100 Barangaroo Ave, Sydney NSW 2000";
export const AGENCY_WEBSITE_URL = process.env.NEXT_PUBLIC_AGENCY_WEBSITE_URL ?? "https://infomats.com.au";

// ─── Branding / Colours ───────────────────────────────────────────────────────

// Primary colour (navy / dark) — used for headings, buttons, backgrounds
export const AGENCY_COLOR_PRIMARY = process.env.NEXT_PUBLIC_AGENCY_COLOR_PRIMARY ?? "#0a192f";
// Darker shade of primary (used for dark nav bars, admin sidebar)
export const AGENCY_COLOR_PRIMARY_DARK = process.env.NEXT_PUBLIC_AGENCY_COLOR_PRIMARY_DARK ?? "#071325";
// Accent colour (gold) — used for highlights, badges, hover states
export const AGENCY_COLOR_ACCENT = process.env.NEXT_PUBLIC_AGENCY_COLOR_ACCENT ?? "#c5a059";
export const AGENCY_COLOR_ACCENT_LIGHT = process.env.NEXT_PUBLIC_AGENCY_COLOR_ACCENT_LIGHT ?? "#d4af37";

// ─── Logo & Media ─────────────────────────────────────────────────────────────

// Path relative to /public, or an absolute CDN URL
export const AGENCY_LOGO_URL = process.env.NEXT_PUBLIC_AGENCY_LOGO_URL ?? "/logo.jpg";
// Used for OG image, Twitter card, favicon fallback
export const AGENCY_OG_IMAGE_URL = process.env.NEXT_PUBLIC_AGENCY_OG_IMAGE_URL ?? "/logo.jpg";

// ─── SEO Defaults ─────────────────────────────────────────────────────────────

export const AGENCY_SEO_TITLE_DEFAULT = process.env.NEXT_PUBLIC_AGENCY_SEO_TITLE_DEFAULT
  ?? `${AGENCY_NAME} | Real Estate Australia & Prestige Property Portal`;
export const AGENCY_SEO_TITLE_TEMPLATE = process.env.NEXT_PUBLIC_AGENCY_SEO_TITLE_TEMPLATE
  ?? `%s | ${AGENCY_NAME} Real Estate`;
export const AGENCY_SEO_DESCRIPTION = process.env.NEXT_PUBLIC_AGENCY_SEO_DESCRIPTION
  ?? `${AGENCY_NAME} — ${AGENCY_TAGLINE}. Search residential sales, luxury rentals, and prime property listings across Australia, powered by live MRI synchronisation.`;

// ─── Social & Analytics ───────────────────────────────────────────────────────

export const AGENCY_GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? "";
export const AGENCY_FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? "";

// ─── Feature Flags ────────────────────────────────────────────────────────────

// Toggle entire features on/off per client. Set to "false" to hide from nav/UI.
export const FEATURE_CUSTOMER_PORTAL = process.env.NEXT_PUBLIC_FEATURE_CUSTOMER_PORTAL !== "false";
export const FEATURE_COMMERCIAL_LISTINGS = process.env.NEXT_PUBLIC_FEATURE_COMMERCIAL !== "false";
export const FEATURE_PROJECTS = process.env.NEXT_PUBLIC_FEATURE_PROJECTS !== "false";
export const FEATURE_AUCTIONS = process.env.NEXT_PUBLIC_FEATURE_AUCTIONS !== "false";
export const FEATURE_PROPERTY_MANAGEMENT = process.env.NEXT_PUBLIC_FEATURE_PROPERTY_MANAGEMENT !== "false";
export const FEATURE_NEWS = process.env.NEXT_PUBLIC_FEATURE_NEWS !== "false";
export const FEATURE_SUBURB_GUIDES = process.env.NEXT_PUBLIC_FEATURE_SUBURB_GUIDES !== "false";
export const FEATURE_PROPERTY_INTELLIGENCE = process.env.NEXT_PUBLIC_FEATURE_PROPERTY_INTELLIGENCE !== "false";
export const FEATURE_DIGITAL_DOCUMENTS = process.env.NEXT_PUBLIC_FEATURE_DOCUMENTS !== "false";

// ─── Convenience Helpers ─────────────────────────────────────────────────────

/**
 * Returns the full agency config as a single object.
 * Useful for passing the entire config as props to a single component.
 */
export function getAgencyConfig() {
  return {
    // Identity
    name: AGENCY_NAME,
    legalName: AGENCY_LEGAL_NAME,
    tagline: AGENCY_TAGLINE,
    abn: AGENCY_ABN,
    licence: AGENCY_LICENCE,
    state: AGENCY_STATE,
    // Contact
    phone: AGENCY_PHONE,
    phoneDisplay: AGENCY_PHONE_DISPLAY,
    email: AGENCY_EMAIL,
    headOfficeAddress: AGENCY_HEAD_OFFICE_ADDRESS,
    websiteUrl: AGENCY_WEBSITE_URL,
    // Brand
    colorPrimary: AGENCY_COLOR_PRIMARY,
    colorPrimaryDark: AGENCY_COLOR_PRIMARY_DARK,
    colorAccent: AGENCY_COLOR_ACCENT,
    colorAccentLight: AGENCY_COLOR_ACCENT_LIGHT,
    logoUrl: AGENCY_LOGO_URL,
    ogImageUrl: AGENCY_OG_IMAGE_URL,
    // SEO
    seoTitleDefault: AGENCY_SEO_TITLE_DEFAULT,
    seoTitleTemplate: AGENCY_SEO_TITLE_TEMPLATE,
    seoDescription: AGENCY_SEO_DESCRIPTION,
    // Features
    features: {
      customerPortal: FEATURE_CUSTOMER_PORTAL,
      commercial: FEATURE_COMMERCIAL_LISTINGS,
      projects: FEATURE_PROJECTS,
      auctions: FEATURE_AUCTIONS,
      propertyManagement: FEATURE_PROPERTY_MANAGEMENT,
      news: FEATURE_NEWS,
      suburbGuides: FEATURE_SUBURB_GUIDES,
      propertyIntelligence: FEATURE_PROPERTY_INTELLIGENCE,
      digitalDocuments: FEATURE_DIGITAL_DOCUMENTS,
    },
  } as const;
}

export type AgencyConfig = ReturnType<typeof getAgencyConfig>;
