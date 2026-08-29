import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getJwtKey } from "@/lib/jwt";

// Firebase Hosting forwards only `__session` through Hosting rewrites.
const AUTH_COOKIE_NAME = "__session";
const LEGACY_AUTH_COOKIE_NAME = "auth_session";
const STAFF_ROLES = new Set([
  "SUPER_ADMIN",
  "ADMIN",
  "MARKETING_ADMIN",
  "OFFICE_MANAGER",
  "AGENT",
  "SUPPORT",
]);

interface DecodedToken {
  userId: string;
  email: string;
  roles: string[];
}

function apiError(status: 401 | 403, error: string) {
  return NextResponse.json({ success: false, error }, { status });
}

async function verifyToken(token?: string): Promise<DecodedToken | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtKey(), { algorithms: ["HS256"] });
    return payload as unknown as DecodedToken;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");
  const isPublicApi =
    pathname === "/api/auth/login" ||
    pathname === "/api/auth/register" ||
    pathname === "/api/enquiries" ||
    pathname.startsWith("/api/webhooks/");

  if (isPublicApi) return NextResponse.next();

  const isProtectedPage =
    pathname.startsWith("/super-admin") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/customer");

  if (!isApi && !isProtectedPage) return NextResponse.next();

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value ?? request.cookies.get(LEGACY_AUTH_COOKIE_NAME)?.value;
  const decoded = await verifyToken(token);
  if (!decoded) {
    if (isApi) return apiError(401, "Authentication required");

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const roles = decoded.roles ?? [];
  const isSuperAdmin = roles.includes("SUPER_ADMIN");
  const isStaff = roles.some((role) => STAFF_ROLES.has(role));

  if (pathname.startsWith("/api/super-admin") && !isSuperAdmin) {
    return apiError(403, "Super Admin access required");
  }

  if (pathname.startsWith("/api/admin") && !roles.some((role) => role === "ADMIN" || role === "SUPER_ADMIN")) {
    return apiError(403, "Admin access required");
  }

  if (isApi && !pathname.startsWith("/api/auth/") && !isStaff) {
    return apiError(403, "Staff access required");
  }

  if (pathname.startsWith("/super-admin") && !isSuperAdmin) {
    return NextResponse.redirect(new URL(roles.includes("CUSTOMER") ? "/customer/dashboard" : "/admin", request.url));
  }

  if (pathname.startsWith("/admin") && !isStaff) {
    return NextResponse.redirect(new URL("/customer/dashboard", request.url));
  }

  if (pathname.startsWith("/customer") && !roles.includes("CUSTOMER") && !isSuperAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/super-admin/:path*",
    "/admin/:path*",
    "/customer/:path*",
  ],
};
