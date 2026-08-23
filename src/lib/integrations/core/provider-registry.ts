/**
 * Real Estate Integration Hub — Core Provider Registry
 * Base interfaces, health-check engine, credential masking, and provider factory.
 */

export type ProviderKey =
  | "HOMEPASS"
  | "FLK"
  | "CORELOGIC"
  | "PROPERTYME"
  | "GOOGLE"
  | "MICROSOFT"
  | "APPLE"
  | "MRI_VAULT"
  | "MRI_PROPERTY_TREE";

export type IntegrationStatus =
  | "CONNECTED"
  | "DEGRADED"
  | "DISCONNECTED"
  | "PENDING_SETUP";

export interface ProviderHealthResult {
  provider: ProviderKey;
  status: IntegrationStatus;
  latencyMs?: number;
  message?: string;
  checkedAt: Date;
}

export interface IntegrationProvider {
  key: ProviderKey;
  displayName: string;
  description: string;
  logoUrl?: string;
  documentationUrl?: string;
  healthCheck(): Promise<ProviderHealthResult>;
}

export interface CredentialSet {
  [field: string]: string;
}

/**
 * Masks sensitive credential values for safe display.
 * Replaces all but the last 4 characters with bullet characters.
 */
export function maskCredentials(raw: CredentialSet): CredentialSet {
  const masked: CredentialSet = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string" && value.length > 4) {
      masked[key] = "••••" + value.slice(-4);
    } else {
      masked[key] = "••••";
    }
  }
  return masked;
}

/**
 * Provider metadata registry — used for Integration Hub UI cards
 */
export const PROVIDER_REGISTRY: Record<
  ProviderKey,
  { displayName: string; description: string; category: string; color: string }
> = {
  HOMEPASS: {
    displayName: "Homepass",
    description: "Open home check-in & visitor registration",
    category: "Open Homes",
    color: "#00a8e1",
  },
  FLK: {
    displayName: "FLK it over",
    description: "Digital agreements, leasing & e-signatures",
    category: "Documents",
    color: "#6366f1",
  },
  CORELOGIC: {
    displayName: "CoreLogic / RP Data",
    description: "Licensed property intelligence & valuations",
    category: "Property Data",
    color: "#dc2626",
  },
  PROPERTYME: {
    displayName: "PropertyMe",
    description: "Property management & tenancy records",
    category: "Property Management",
    color: "#0ea5e9",
  },
  GOOGLE: {
    displayName: "Google Workspace",
    description: "Google Contacts & Calendar OAuth sync",
    category: "Contacts & Calendar",
    color: "#4285f4",
  },
  MICROSOFT: {
    displayName: "Microsoft Outlook",
    description: "MS Graph Contacts & Outlook Calendar sync",
    category: "Contacts & Calendar",
    color: "#0078d4",
  },
  APPLE: {
    displayName: "Apple Contacts & Calendar",
    description: "vCard & iCal export for Apple ecosystem",
    category: "Contacts & Calendar",
    color: "#555555",
  },
  MRI_VAULT: {
    displayName: "MRI Vault",
    description: "Sales listings & property data (primary)",
    category: "CRM",
    color: "#059669",
  },
  MRI_PROPERTY_TREE: {
    displayName: "MRI Property Tree",
    description: "Rental & property management (primary)",
    category: "CRM",
    color: "#059669",
  },
};
