import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getStaffSeatUsage, getSubscriptionConfig, invalidateSeatUsageCache } from "@/lib/features";

const createStaffSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "MARKETING_ADMIN", "OFFICE_MANAGER", "AGENT", "SUPPORT"]),
});

const updateStaffSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  isActive: z.boolean().optional(),
  newPassword: z.string().min(6).optional(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (!user.roles.includes("ADMIN") && !user.roles.includes("SUPER_ADMIN"))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin privileges required" },
        { status: 403 }
      );
    }

    const [staffUsers, seatUsage, subscription] = await Promise.all([
      prisma.user.findMany({
        take: 100,
        where: {
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
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          userRoles: {
            select: {
              role: {
                select: { name: true },
              },
            },
          },
          agentProfile: {
            select: { id: true },
          },
        },
      }),
      getStaffSeatUsage(),
      getSubscriptionConfig(),
    ]);

    const formatted = staffUsers.map((u) => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone,
      isActive: u.isActive,
      lastLoginAt: u.lastLoginAt,
      createdAt: u.createdAt,
      roles: u.userRoles.map((ur) => ur.role.name),
      isAgent: Boolean(u.agentProfile),
    }));

    return NextResponse.json({
      success: true,
      users: formatted,
      seatUsage,
      subscriptionTier: subscription.tier,
      maxStaffUsers: subscription.quotas.maxStaffUsers,
    });
  } catch (error: any) {
    console.error("Admin GET staff error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (!currentUser.roles.includes("ADMIN") && !currentUser.roles.includes("SUPER_ADMIN"))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin privileges required" },
        { status: 403 }
      );
    }

    const isSuperAdmin = currentUser.roles.includes("SUPER_ADMIN");

    // 1. STRICT SEAT QUOTA ENFORCEMENT FOR AGENCY OWNER
    const seatUsage = await getStaffSeatUsage();
    if (!isSuperAdmin && !seatUsage.canAdd) {
      return NextResponse.json(
        {
          success: false,
          error: `Staff seat limit reached (${seatUsage.used}/${seatUsage.limit}). Your current subscription allows a maximum of ${seatUsage.limit} staff logins. Please contact your SaaS administrator to upgrade your plan.`,
          quotaExceeded: true,
          seatUsage,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createStaffSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { firstName, lastName, phone, password, role } = parsed.data;
    const email = parsed.data.email.toLowerCase();

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "A user with this email address already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let roleRecord = await prisma.role.findUnique({
      where: { name: role },
    });

    if (!roleRecord) {
      roleRecord = await prisma.role.create({
        data: { name: role, isSystem: true },
      });
    }

    const newStaff = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        isActive: true,
        isEmailVerified: true,
        userRoles: {
          create: {
            roleId: roleRecord.id,
          },
        },
      },
      include: {
        userRoles: { include: { role: true } },
      },
    });

    if (role === "AGENT") {
      const office = await prisma.office.findFirst();
      if (office) {
        await prisma.agent.create({
          data: {
            userId: newStaff.id,
            officeId: office.id,
            position: "Sales Representative",
            isPublic: true,
          },
        });
      }
    }

    invalidateSeatUsageCache();
    const updatedSeatUsage = await getStaffSeatUsage();

    return NextResponse.json({
      success: true,
      user: {
        id: newStaff.id,
        email: newStaff.email,
        firstName: newStaff.firstName,
        lastName: newStaff.lastName,
        roles: newStaff.userRoles.map((ur) => ur.role.name),
        isActive: newStaff.isActive,
      },
      seatUsage: updatedSeatUsage,
    });
  } catch (error: any) {
    console.error("Admin POST staff error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (!currentUser.roles.includes("ADMIN") && !currentUser.roles.includes("SUPER_ADMIN"))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin privileges required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = updateStaffSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { userId, isActive, newPassword } = parsed.data;

    const target = await prisma.user.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { role: true } } },
    });

    if (!target) {
      return NextResponse.json({ success: false, error: "Staff member not found" }, { status: 404 });
    }

    // Prevent deactivating own account
    if (target.id === currentUser.id && isActive === false) {
      return NextResponse.json(
        { success: false, error: "You cannot deactivate your own account" },
        { status: 400 }
      );
    }

    // Prevent non-super-admins from modifying Super Admin accounts
    if (target.userRoles.some((r) => r.role.name === "SUPER_ADMIN") && !currentUser.roles.includes("SUPER_ADMIN")) {
      return NextResponse.json(
        { success: false, error: "Permission denied: Cannot edit Super Admin accounts" },
        { status: 403 }
      );
    }

    const updateData: any = {};
    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }
    if (newPassword) {
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: { userRoles: { include: { role: true } } },
    });

    invalidateSeatUsageCache();
    const seatUsage = await getStaffSeatUsage();

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        roles: updated.userRoles.map((ur) => ur.role.name),
        isActive: updated.isActive,
      },
      seatUsage,
    });
  } catch (error: any) {
    console.error("Admin PATCH staff error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
