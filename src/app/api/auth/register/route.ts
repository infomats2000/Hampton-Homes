import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie, buildAuthUser } from "@/lib/auth";

const registerSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().optional(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { firstName, lastName, phone, password } = parsed.data;
    const email = parsed.data.email.toLowerCase();

    // Check if email already registered
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email address already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Get CUSTOMER role
    let customerRole = await prisma.role.findUnique({
      where: { name: "CUSTOMER" },
    });

    if (!customerRole) {
      customerRole = await prisma.role.create({
        data: {
          name: "CUSTOMER",
          description: "System role for Customer",
          isSystem: true,
        },
      });
    }

    // Create User & Customer Profile in transaction
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        isActive: true,
        isEmailVerified: false,
        userRoles: {
          create: {
            roleId: customerRole.id,
          },
        },
        customerProfile: {
          create: {
            preferences: {},
          },
        },
      },
    });

    const authUser = buildAuthUser(
      {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
      ["CUSTOMER"]
    );

    // Create JWT Session & Cookie
    const token = await createSessionToken({
      userId: authUser.id,
      email: authUser.email,
      firstName: authUser.firstName,
      lastName: authUser.lastName,
      roles: authUser.roles,
      permissions: authUser.permissions,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: authUser,
      redirectTo: "/customer/dashboard",
    });
  } catch (error: any) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
