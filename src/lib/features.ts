import { prisma } from "./prisma";
import { RoleType } from "./permissions";

export type SubscriptionTier = "GOLD_ENTERPRISE" | "SILVER_GROWTH" | "BRONZE_STARTER" | "CUSTOM";

export interface ModuleFeatures {
  customerPortal: boolean;
  commercial: boolean;
  projects: boolean;
  auctions: boolean;
  propertyManagement: boolean;
  trustAccounting: boolean;
  commissionCalculator: boolean;
  aiCopywriter: boolean;
  buyerMatching: boolean;
  portalSyndication: boolean;
  xeroSync: boolean;
  amlVerification: boolean;
  news: boolean;
  suburbGuides: boolean;
  propertyIntelligence: boolean;
  digitalDocuments: boolean;
}

export const TIER_PRESETS: Record<SubscriptionTier, ModuleFeatures> = {
  GOLD_ENTERPRISE: {
    customerPortal: true,
    commercial: true,
    projects: true,
    auctions: true,
    propertyManagement: true,
    trustAccounting: true,
    commissionCalculator: true,
    aiCopywriter: true,
    buyerMatching: true,
    portalSyndication: true,
    xeroSync: true,
    amlVerification: true,
    news: true,
    suburbGuides: true,
    propertyIntelligence: true,
    digitalDocuments: true,
  },
  SILVER_GROWTH: {
    customerPortal: true,
    commercial: true,
    projects: false,
    auctions: false,
    propertyManagement: true,
    trustAccounting: false,
    commissionCalculator: false,
    aiCopywriter: false,
    buyerMatching: true,
    portalSyndication: true,
    xeroSync: true,
    amlVerification: false,
    news: true,
    suburbGuides: true,
    propertyIntelligence: false,
    digitalDocuments: false,
  },
  BRONZE_STARTER: {
    customerPortal: true,
    commercial: false,
    projects: false,
    auctions: false,
    propertyManagement: false,
    trustAccounting: false,
    commissionCalculator: false,
    aiCopywriter: false,
    buyerMatching: false,
    portalSyndication: false,
    xeroSync: false,
    amlVerification: false,
    news: true,
    suburbGuides: true,
    propertyIntelligence: false,
    digitalDocuments: false,
  },
  CUSTOM: {
    customerPortal: true,
    commercial: true,
    projects: true,
    auctions: true,
    propertyManagement: true,
    trustAccounting: true,
    commissionCalculator: true,
    aiCopywriter: true,
    buyerMatching: true,
    portalSyndication: true,
    xeroSync: true,
    amlVerification: true,
    news: true,
    suburbGuides: true,
    propertyIntelligence: true,
    digitalDocuments: true,
  },
};

const FEATURES_SETTING_KEY = "system.features";
const SUBSCRIPTION_SETTING_KEY = "system.subscription";

export interface SubscriptionConfig {
  tier: SubscriptionTier;
  clientName: string;
  clientStatus: "ACTIVE" | "SUSPENDED" | "TRIAL";
  expiryDate: string;
  features: ModuleFeatures;
}

export const DEFAULT_SUBSCRIPTION: SubscriptionConfig = {
  tier: "GOLD_ENTERPRISE",
  clientName: "Hampton Homes ERP",
  clientStatus: "ACTIVE",
  expiryDate: "2028-12-31",
  features: TIER_PRESETS.GOLD_ENTERPRISE,
};

/**
 * Retrieves the current active subscription and module feature flags from Neon DB.
 * Falls back to default if database is empty or unreachable.
 */
export async function getSubscriptionConfig(): Promise<SubscriptionConfig> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: SUBSCRIPTION_SETTING_KEY },
    });

    if (setting && setting.value && typeof setting.value === "object") {
      const val = setting.value as unknown as Partial<SubscriptionConfig>;
      return {
        tier: val.tier ?? DEFAULT_SUBSCRIPTION.tier,
        clientName: val.clientName ?? DEFAULT_SUBSCRIPTION.clientName,
        clientStatus: val.clientStatus ?? DEFAULT_SUBSCRIPTION.clientStatus,
        expiryDate: val.expiryDate ?? DEFAULT_SUBSCRIPTION.expiryDate,
        features: {
          ...DEFAULT_SUBSCRIPTION.features,
          ...(val.features || {}),
        },
      };
    }
  } catch (err) {
    console.error("Error fetching subscription config from DB:", err);
  }

  return DEFAULT_SUBSCRIPTION;
}

/**
 * Updates subscription config in Neon DB (Super Admin only).
 */
export async function updateSubscriptionConfig(
  config: Partial<SubscriptionConfig>
): Promise<SubscriptionConfig> {
  const current = await getSubscriptionConfig();
  const updated: SubscriptionConfig = {
    ...current,
    ...config,
    features: {
      ...current.features,
      ...(config.features || {}),
    },
  };

  await prisma.setting.upsert({
    where: { key: SUBSCRIPTION_SETTING_KEY },
    create: {
      key: SUBSCRIPTION_SETTING_KEY,
      value: updated as any,
      category: "SYSTEM",
      description: "Platform subscription tier and granular module feature flags",
      isPublic: true,
    },
    update: {
      value: updated as any,
    },
  });

  return updated;
}

/**
 * Checks if a specific module is enabled for the agency.
 * Super Admin always has full access to every module.
 */
export async function isModuleAllowed(
  moduleKey: keyof ModuleFeatures,
  userRoles?: RoleType[]
): Promise<boolean> {
  if (userRoles?.includes("SUPER_ADMIN")) {
    return true;
  }

  const sub = await getSubscriptionConfig();
  if (sub.clientStatus !== "ACTIVE") {
    return false;
  }

  return Boolean(sub.features[moduleKey]);
}
