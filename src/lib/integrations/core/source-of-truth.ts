/**
 * Real Estate Integration Hub — Source-of-Truth Engine
 * Configurable field ownership resolver for multi-vendor data conflicts.
 */

import type { ProviderKey } from "./provider-registry";

export type DataDomain =
  | "SALES_LISTINGS"
  | "RENTAL_MARKETING"
  | "PROPERTY_MANAGEMENT"
  | "OPEN_HOME_ATTENDEES"
  | "PROPERTY_INTELLIGENCE"
  | "CONTACTS"
  | "CALENDAR"
  | "WEBSITE_CONTENT"
  | "DOCUMENTS"
  | "TENANCY_RECORDS";

export interface FieldOwnership {
  domain: DataDomain;
  primarySource: ProviderKey;
  fallbackSources: ProviderKey[];
  allowOverride: boolean;
  description: string;
}

/**
 * Platform source-of-truth configuration.
 * These rules determine which vendor's data wins in a conflict.
 */
export const SOURCE_OF_TRUTH: FieldOwnership[] = [
  {
    domain: "SALES_LISTINGS",
    primarySource: "MRI_VAULT",
    fallbackSources: [],
    allowOverride: true,
    description: "Sales listings are sourced primarily from MRI Vault",
  },
  {
    domain: "RENTAL_MARKETING",
    primarySource: "MRI_PROPERTY_TREE",
    fallbackSources: ["PROPERTYME"],
    allowOverride: true,
    description: "Rental marketing sourced from MRI Property Tree or PropertyMe",
  },
  {
    domain: "PROPERTY_MANAGEMENT",
    primarySource: "MRI_PROPERTY_TREE",
    fallbackSources: ["PROPERTYME"],
    allowOverride: false,
    description: "Property management data from MRI Property Tree or PropertyMe",
  },
  {
    domain: "OPEN_HOME_ATTENDEES",
    primarySource: "HOMEPASS",
    fallbackSources: [],
    allowOverride: false,
    description: "Visitor check-in and open home registration from Homepass",
  },
  {
    domain: "PROPERTY_INTELLIGENCE",
    primarySource: "CORELOGIC",
    fallbackSources: [],
    allowOverride: false,
    description: "Licensed property data from CoreLogic / RP Data (internal only)",
  },
  {
    domain: "CONTACTS",
    primarySource: "MRI_VAULT",
    fallbackSources: ["HOMEPASS", "PROPERTYME"],
    allowOverride: true,
    description: "Contact master record from MRI Vault; enriched from Homepass & PropertyMe",
  },
  {
    domain: "CALENDAR",
    primarySource: "GOOGLE",
    fallbackSources: ["MICROSOFT", "APPLE"],
    allowOverride: true,
    description: "Calendar sync primary via Google; fallback to Microsoft or Apple export",
  },
  {
    domain: "WEBSITE_CONTENT",
    primarySource: "MRI_VAULT",
    fallbackSources: [],
    allowOverride: true,
    description: "Website listings and overrides managed by Platform CMS",
  },
  {
    domain: "DOCUMENTS",
    primarySource: "FLK",
    fallbackSources: [],
    allowOverride: false,
    description: "Digital agreements and e-signatures managed via FLK it over",
  },
  {
    domain: "TENANCY_RECORDS",
    primarySource: "PROPERTYME",
    fallbackSources: ["MRI_PROPERTY_TREE"],
    allowOverride: false,
    description: "Tenancy records from PropertyMe; fallback to MRI Property Tree",
  },
];

/**
 * Get the primary source-of-truth for a given data domain
 */
export function getPrimarySource(domain: DataDomain): FieldOwnership | undefined {
  return SOURCE_OF_TRUTH.find((sot) => sot.domain === domain);
}

/**
 * Resolve which provider's data takes precedence for a field
 */
export function resolveProvider(
  domain: DataDomain,
  availableProviders: ProviderKey[]
): ProviderKey | null {
  const sot = getPrimarySource(domain);
  if (!sot) return null;

  if (availableProviders.includes(sot.primarySource)) {
    return sot.primarySource;
  }

  for (const fallback of sot.fallbackSources) {
    if (availableProviders.includes(fallback)) {
      return fallback;
    }
  }

  return null;
}
