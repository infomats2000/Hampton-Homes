import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie, buildAuthUser } from "@/lib/auth";
import { RoleType } from "@/lib/permissions";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const password = parsed.data.password;

    // Look up user in Neon PostgreSQL
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: "This account has been deactivated. Please contact administrator." },
        { status: 403 }
      );
    }

    // Verify Password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Extract roles
    const roles = user.userRoles.map((ur) => ur.role.name as RoleType);
    if (roles.length === 0) {
      roles.push("CUSTOMER");
    }

    const authUser = buildAuthUser(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      roles
    );

    // Create signed JWT Token
    const token = await createSessionToken({
      userId: authUser.id,
      email: authUser.email,
      firstName: authUser.firstName,
      lastName: authUser.lastName,
      roles: authUser.roles,
      permissions: authUser.permissions,
    });

    // Set HTTP-Only Cookie
    await setSessionCookie(token);

    // Update lastLoginAt and record Audit Log (async non-blocking)
    prisma.user
      .update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      })
      .catch(() => {});

    prisma.auditLog
      .create({
        data: {
          actorId: user.id,
          actorEmail: user.email,
          action: "USER_LOGIN",
          entity: "User",
          entityId: user.id,
          ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        },
      })
      .catch(() => {});

    // Determine redirect destination
    let redirectTo = "/customer/dashboard";
    if (roles.includes("SUPER_ADMIN")) {
      redirectTo = "/super-admin";
    } else if (
      roles.some((r) =>
        ["ADMIN", "MARKETING_ADMIN", "OFFICE_MANAGER", "AGENT", "SUPPORT"].includes(r)
      )
    ) {
      redirectTo = "/admin";
    }

    return NextResponse.json({
      success: true,
      user: authUser,
      redirectTo,
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
