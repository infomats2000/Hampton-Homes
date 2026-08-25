import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getStaffSeatUsage, getSubscriptionConfig, invalidateSeatUsageCache } from "@/lib/features";

const createUserSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([
    "SUPER_ADMIN",
    "ADMIN",
    "MARKETING_ADMIN",
    "OFFICE_MANAGER",
    "AGENT",
    "SUPPORT",
    "CUSTOMER",
  ]),
});

const updateUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  isActive: z.boolean().optional(),
  roles: z.array(z.string()).optional(),
  newPassword: z.string().min(6).optional(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.roles.includes("SUPER_ADMIN")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Super Admin privileges required" },
        { status: 403 }
      );
    }

    const [users, seatUsage, subscription] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
          agentProfile: true,
          customerProfile: true,
        },
      }),
      getStaffSeatUsage(),
      getSubscriptionConfig(),
    ]);

    const formatted = users.map((u) => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone,
      isActive: u.isActive,
      isEmailVerified: u.isEmailVerified,
      lastLoginAt: u.lastLoginAt,
      createdAt: u.createdAt,
      roles: u.userRoles.map((ur) => ur.role.name),
      isAgent: Boolean(u.agentProfile),
      isCustomer: Boolean(u.customerProfile),
    }));

    return NextResponse.json({
      success: true,
      users: formatted,
      seatUsage,
      subscription,
    });
  } catch (error: any) {
    console.error("Super Admin GET users error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.roles.includes("SUPER_ADMIN")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Super Admin privileges required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createUserSchema.safeParse(body);

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

    // Retrieve or create role
    let roleRecord = await prisma.role.findUnique({
      where: { name: role },
    });

    if (!roleRecord) {
      roleRecord = await prisma.role.create({
        data: {
          name: role,
          description: `System role for ${role}`,
          isSystem: true,
        },
      });
    }

    const newUser = await prisma.user.create({
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
        userRoles: {
          include: { role: true },
        },
      },
    });

    // If role is AGENT, auto-create agent profile
    if (role === "AGENT") {
      const office = await prisma.office.findFirst();
      if (office) {
        await prisma.agent.create({
          data: {
            userId: newUser.id,
            officeId: office.id,
            position: "Sales Representative",
            isPublic: true,
          },
        });
      }
    } else if (role === "CUSTOMER") {
      await prisma.customerProfile.create({
        data: {
          userId: newUser.id,
          preferences: {},
        },
      });
    }

    // Record Audit Log
    prisma.auditLog
      .create({
        data: {
          actorId: currentUser.id,
          actorEmail: currentUser.email,
          action: "SUPER_ADMIN_CREATED_USER",
          entity: "User",
          entityId: newUser.id,
          newValue: { email: newUser.email, role, firstName, lastName },
        },
      })
      .catch(() => {});

    invalidateSeatUsageCache();
    const seatUsage = await getStaffSeatUsage();

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        roles: newUser.userRoles.map((ur) => ur.role.name),
        isActive: newUser.isActive,
      },
      seatUsage,
    });
  } catch (error: any) {
    console.error("Super Admin POST user error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.roles.includes("SUPER_ADMIN")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Super Admin privileges required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { userId, isActive, roles, newPassword } = parsed.data;

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { role: true } } },
    });

    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Prevent Super Admin from deactivating their own account
    if (targetUser.id === currentUser.id && isActive === false) {
      return NextResponse.json(
        { success: false, error: "Cannot deactivate your own Super Admin account" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    if (newPassword) {
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // Update roles if provided
    if (roles && Array.isArray(roles) && roles.length > 0) {
      // Remove current roles
      await prisma.userRole.deleteMany({
        where: { userId },
      });

      for (const roleName of roles) {
        let role = await prisma.role.findUnique({ where: { name: roleName } });
        if (!role) {
          role = await prisma.role.create({
            data: { name: roleName, isSystem: true },
          });
        }
        await prisma.userRole.create({
          data: { userId, roleId: role.id },
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: { userRoles: { include: { role: true } } },
    });

    invalidateSeatUsageCache();
    const seatUsage = await getStaffSeatUsage();

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        roles: updatedUser.userRoles.map((ur) => ur.role.name),
        isActive: updatedUser.isActive,
      },
      seatUsage,
    });
  } catch (error: any) {
    console.error("Super Admin PATCH user error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
