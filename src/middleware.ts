import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "hampton-homes-secure-jwt-key-australia-2026";
const JWT_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
const AUTH_COOKIE_NAME = "auth_session";

interface DecodedToken {
  userId: string;
  email: string;
  roles: string[];
}

async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_KEY, {
      algorithms: ["HS256"],
    });
    return payload as unknown as DecodedToken;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Paths requiring protection
  const isSuperAdminRoute = pathname.startsWith("/super-admin");
  const isAdminRoute = pathname.startsWith("/admin");
  const isCustomerRoute = pathname.startsWith("/customer");

  if (!isSuperAdminRoute && !isAdminRoute && !isCustomerRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const decoded = token ? await verifyToken(token) : null;

  // Unauthenticated user attempting to access protected route
  if (!decoded) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const roles = decoded.roles || [];

  // Super Admin route restriction
  if (isSuperAdminRoute) {
    if (!roles.includes("SUPER_ADMIN")) {
      // Not a Super Admin -> redirect to regular admin or customer dashboard
      const redirectUrl = roles.includes("CUSTOMER")
        ? new URL("/customer/dashboard", req.url)
        : new URL("/admin", req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Admin / Staff route restriction
  if (isAdminRoute) {
    const isStaff = roles.some((r) =>
      ["SUPER_ADMIN", "ADMIN", "MARKETING_ADMIN", "OFFICE_MANAGER", "AGENT", "SUPPORT"].includes(r)
    );
    if (!isStaff) {
      // Customer trying to access internal ERP -> redirect to customer dashboard
      return NextResponse.redirect(new URL("/customer/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/super-admin/:path*", "/admin/:path*", "/customer/:path*"],
};
