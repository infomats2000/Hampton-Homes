import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { RoleType, PermissionCode, ROLE_DEFAULT_PERMISSIONS, AuthUser } from "./permissions";
import { getJwtKey } from "./jwt";

const SALT_ROUNDS = 10;
export const AUTH_COOKIE_NAME = "auth_session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface SessionPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: RoleType[];
  permissions: PermissionCode[];
}

/**
 * Signs a secure JWT session token valid for 7 days.
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtKey());
}

/**
 * Verifies a JWT session token and returns the payload.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtKey(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Sets the secure HTTP-only authentication session cookie.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Clears the authentication session cookie.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Retrieves the currently logged in user from the session cookie.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload || !payload.userId) return null;

    return {
      id: payload.userId,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      roles: payload.roles,
      permissions: payload.permissions,
    };
  } catch {
    return null;
  }
}

/**
 * Helper to build AuthUser with permissions from roles.
 */
export function buildAuthUser(
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  },
  roles: RoleType[]
): AuthUser {
  const permissionSet = new Set<PermissionCode>();
  for (const role of roles) {
    const perms = ROLE_DEFAULT_PERMISSIONS[role] || [];
    for (const p of perms) {
      permissionSet.add(p);
    }
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles,
    permissions: Array.from(permissionSet),
  };
}
