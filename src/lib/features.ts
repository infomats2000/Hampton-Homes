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

export interface SubscriptionQuotas {
  maxStaffUsers: number; // Staff seats (Admins, Agents, Managers, Support)
  maxListings: number; // Active property listings cap
  maxOffices: number; // Branch locations cap
  maxStorageMb: number; // Upload storage cap in MB
  maxAiTokensPerMonth: number; // AI generation token allowance
}

export const TIER_QUOTAS: Record<SubscriptionTier, SubscriptionQuotas> = {
  GOLD_ENTERPRISE: {
    maxStaffUsers: 50,
    maxListings: 1000,
    maxOffices: 10,
    maxStorageMb: 50000,
    maxAiTokensPerMonth: 500000,
  },
  SILVER_GROWTH: {
    maxStaffUsers: 10,
    maxListings: 100,
    maxOffices: 3,
    maxStorageMb: 10000,
    maxAiTokensPerMonth: 50000,
  },
  BRONZE_STARTER: {
    maxStaffUsers: 3,
    maxListings: 25,
    maxOffices: 1,
    maxStorageMb: 2000,
    maxAiTokensPerMonth: 0,
  },
  CUSTOM: {
    maxStaffUsers: 25,
    maxListings: 500,
    maxOffices: 5,
    maxStorageMb: 25000,
    maxAiTokensPerMonth: 250000,
  },
};

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

const SUBSCRIPTION_SETTING_KEY = "system.subscription";

export interface SubscriptionConfig {
  tier: SubscriptionTier;
  clientName: string;
  clientStatus: "ACTIVE" | "SUSPENDED" | "TRIAL";
  expiryDate: string;
  features: ModuleFeatures;
  quotas: SubscriptionQuotas;
}

export const DEFAULT_SUBSCRIPTION: SubscriptionConfig = {
  tier: "GOLD_ENTERPRISE",
  clientName: "Hampton Homes ERP",
  clientStatus: "ACTIVE",
  expiryDate: "2028-12-31",
  features: TIER_PRESETS.GOLD_ENTERPRISE,
  quotas: TIER_QUOTAS.GOLD_ENTERPRISE,
};

/**
 * Retrieves the current active subscription, module features, and quotas from Neon DB.
 */
export async function getSubscriptionConfig(): Promise<SubscriptionConfig> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: SUBSCRIPTION_SETTING_KEY },
    });

    if (setting && setting.value && typeof setting.value === "object") {
      const val = setting.value as unknown as Partial<SubscriptionConfig>;
      const tier = val.tier ?? DEFAULT_SUBSCRIPTION.tier;

      return {
        tier,
        clientName: val.clientName ?? DEFAULT_SUBSCRIPTION.clientName,
        clientStatus: val.clientStatus ?? DEFAULT_SUBSCRIPTION.clientStatus,
        expiryDate: val.expiryDate ?? DEFAULT_SUBSCRIPTION.expiryDate,
        features: {
          ...(TIER_PRESETS[tier] || DEFAULT_SUBSCRIPTION.features),
          ...(val.features || {}),
        },
        quotas: {
          ...(TIER_QUOTAS[tier] || DEFAULT_SUBSCRIPTION.quotas),
          ...(val.quotas || {}),
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
    quotas: {
      ...current.quotas,
      ...(config.quotas || {}),
    },
  };

  await prisma.setting.upsert({
    where: { key: SUBSCRIPTION_SETTING_KEY },
    create: {
      key: SUBSCRIPTION_SETTING_KEY,
      value: updated as any,
      category: "SYSTEM",
      description: "Platform subscription tier, quotas, and granular module feature flags",
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

export interface StaffSeatUsage {
  used: number;
  limit: number;
  available: number;
  canAdd: boolean;
}

/**
 * Calculates current staff seat usage against subscription quota.
 * Staff includes: ADMIN, MARKETING_ADMIN, OFFICE_MANAGER, AGENT, SUPPORT.
 * (SUPER_ADMIN and CUSTOMER accounts do not consume staff seats).
 */
export async function getStaffSeatUsage(): Promise<StaffSeatUsage> {
  const sub = await getSubscriptionConfig();
  const limit = sub.quotas?.maxStaffUsers || DEFAULT_SUBSCRIPTION.quotas.maxStaffUsers;

  // Count active staff users with agency internal roles
  const staffCount = await prisma.user.count({
    where: {
      isActive: true,
      userRoles: {
        some: {
          role: {
            name: {
              in: ["ADMIN", "MARKETING_ADMIN", "OFFICE_MANAGER", "AGENT", "SUPPORT"],
            },
          },
        },
      },
    },
  });

  const available = Math.max(0, limit - staffCount);
  const canAdd = staffCount < limit;

  return {
    used: staffCount,
    limit,
    available,
    canAdd,
  };
}
