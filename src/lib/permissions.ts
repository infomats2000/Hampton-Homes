// Hampton Homes - Role Based Access Control (RBAC) & Permission Engine

export const PERMISSIONS = {
  // Property Permissions
  PROPERTY_VIEW: "property.view",
  PROPERTY_OVERRIDE: "property.website_override",
  
  // Lead & Enquiry Permissions
  LEAD_VIEW: "lead.view",
  LEAD_ASSIGN: "lead.assign",
  LEAD_UPDATE: "lead.update",
  LEAD_EXPORT: "lead.export",

  // Agent & Office Management
  AGENT_MANAGE: "agent.manage",
  OFFICE_MANAGE: "office.manage",

  // Content & Marketing
  CMS_MANAGE: "cms.manage",
  SEO_MANAGE: "seo.manage",

  // Reporting & Analytics
  REPORT_VIEW: "report.view",
  REPORT_EXPORT: "report.export",

  // MRI Integrations & Sync
  INTEGRATION_VIEW: "integration.view",
  INTEGRATION_MANAGE: "integration.manage",
  MRI_SYNC: "mri.sync",
  MRI_RETRY: "mri.retry",

  // System Administration
  USER_MANAGE: "user.manage",
  ROLE_MANAGE: "role.manage",
  SYSTEM_SETTINGS: "system.settings",
  AUDIT_VIEW: "audit.view",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export type RoleType =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MARKETING_ADMIN"
  | "OFFICE_MANAGER"
  | "AGENT"
  | "SUPPORT"
  | "CUSTOMER";

// Role-to-Permissions Default Matrix
export const ROLE_DEFAULT_PERMISSIONS: Record<RoleType, PermissionCode[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  
  ADMIN: [
    PERMISSIONS.PROPERTY_VIEW,
    PERMISSIONS.PROPERTY_OVERRIDE,
    PERMISSIONS.LEAD_VIEW,
    PERMISSIONS.LEAD_ASSIGN,
    PERMISSIONS.LEAD_UPDATE,
    PERMISSIONS.LEAD_EXPORT,
    PERMISSIONS.AGENT_MANAGE,
    PERMISSIONS.OFFICE_MANAGE,
    PERMISSIONS.CMS_MANAGE,
    PERMISSIONS.SEO_MANAGE,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_EXPORT,
    PERMISSIONS.INTEGRATION_VIEW,
    PERMISSIONS.MRI_SYNC,
    PERMISSIONS.MRI_RETRY,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.ROLE_MANAGE,
    PERMISSIONS.AUDIT_VIEW,
  ],

  MARKETING_ADMIN: [
    PERMISSIONS.PROPERTY_VIEW,
    PERMISSIONS.PROPERTY_OVERRIDE,
    PERMISSIONS.CMS_MANAGE,
    PERMISSIONS.SEO_MANAGE,
    PERMISSIONS.REPORT_VIEW,
  ],

  OFFICE_MANAGER: [
    PERMISSIONS.PROPERTY_VIEW,
    PERMISSIONS.LEAD_VIEW,
    PERMISSIONS.LEAD_ASSIGN,
    PERMISSIONS.LEAD_UPDATE,
    PERMISSIONS.AGENT_MANAGE,
    PERMISSIONS.REPORT_VIEW,
  ],

  AGENT: [
    PERMISSIONS.PROPERTY_VIEW,
    PERMISSIONS.LEAD_VIEW,
    PERMISSIONS.LEAD_UPDATE,
    PERMISSIONS.REPORT_VIEW,
  ],

  SUPPORT: [
    PERMISSIONS.PROPERTY_VIEW,
    PERMISSIONS.LEAD_VIEW,
    PERMISSIONS.INTEGRATION_VIEW,
    PERMISSIONS.AUDIT_VIEW,
  ],

  CUSTOMER: [
    PERMISSIONS.PROPERTY_VIEW,
  ],
};

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: RoleType[];
  permissions: PermissionCode[];
}

/**
 * Validates if user has specific permission.
 * Super Admin bypasses check.
 */
export function hasPermission(user: AuthUser | null, permission: PermissionCode): boolean {
  if (!user) return false;
  if (user.roles.includes("SUPER_ADMIN")) return true;
  return user.permissions.includes(permission);
}

/**
 * Validates if user has any of the requested permissions.
 */
export function hasAnyPermission(user: AuthUser | null, permissions: PermissionCode[]): boolean {
  if (!user) return false;
  if (user.roles.includes("SUPER_ADMIN")) return true;
  return permissions.some((perm) => user.permissions.includes(perm));
}
