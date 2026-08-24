import bcrypt from "bcryptjs";
import { RoleType, PermissionCode, ROLE_DEFAULT_PERMISSIONS, AuthUser } from "./permissions";
import { AGENCY_EMAIL, AGENCY_NAME } from "./agency-config";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// In-Memory / JWT Auth Simulation for Phase 1 (Works out of the box with or without live Postgres)
export interface SessionToken {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: RoleType[];
  expiresAt: number;
}

export function createMockSession(role: RoleType = "SUPER_ADMIN"): AuthUser {
  const permissions: PermissionCode[] = ROLE_DEFAULT_PERMISSIONS[role] || [];
  // Admin email and name are derived from the agency config (env vars), not hardcoded.
  const adminEmail = process.env.ADMIN_EMAIL ?? `admin@${AGENCY_EMAIL.split("@")[1] ?? "agency.com.au"}`;
  const [firstName, ...rest] = AGENCY_NAME.split(" ");

  return {
    id: "user-super-admin-01",
    email: adminEmail,
    firstName: firstName ?? "Admin",
    lastName: rest.join(" ") || "User",
    roles: [role],
    permissions,
  };
}
