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
  mobile: z.string().trim().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "MARKETING_ADMIN", "OFFICE_MANAGER", "AGENT", "SUPPORT"]),
  position: z.string().trim().optional(),
  officeId: z.string().optional(),
  bio: z.string().optional(),
  isPublic: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

const updateStaffSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().optional().nullable(),
  mobile: z.string().trim().optional().nullable(),
  role: z.enum(["ADMIN", "MARKETING_ADMIN", "OFFICE_MANAGER", "AGENT", "SUPPORT"]).optional(),
  position: z.string().trim().optional().nullable(),
  officeId: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
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

    const [staffUsers, offices, seatUsage, subscription] = await Promise.all([
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
          avatarUrl: true,
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
            select: {
              id: true,
              position: true,
              officeId: true,
              bio: true,
              photoUrl: true,
              phone: true,
              mobile: true,
              isPublic: true,
              isFeatured: true,
              office: {
                select: {
                  id: true,
                  name: true,
                  suburb: true,
                },
              },
            },
          },
        },
      }),
      prisma.office.findMany({
        select: {
          id: true,
          name: true,
          suburb: true,
          state: true,
        },
        orderBy: { name: "asc" },
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
      avatarUrl: u.avatarUrl,
      isActive: u.isActive,
      lastLoginAt: u.lastLoginAt,
      createdAt: u.createdAt,
      roles: u.userRoles.map((ur) => ur.role.name),
      primaryRole: u.userRoles[0]?.role.name || "AGENT",
      agentProfile: u.agentProfile
        ? {
            id: u.agentProfile.id,
            position: u.agentProfile.position,
            officeId: u.agentProfile.officeId,
            officeName: u.agentProfile.office?.name || "Main Branch",
            bio: u.agentProfile.bio,
            mobile: u.agentProfile.mobile,
            isPublic: u.agentProfile.isPublic,
            isFeatured: u.agentProfile.isFeatured,
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      users: formatted,
      offices,
      seatUsage,
      subscriptionTier: subscription.tier,
      maxStaffUsers: subscription.quotas.maxStaffUsers,
    });
  } catch (error) {
    console.error("Admin GET staff error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
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

    // 1. Strict Seat Quota Enforcement
    const seatUsage = await getStaffSeatUsage();
    if (!isSuperAdmin && !seatUsage.canAdd) {
      return NextResponse.json(
        {
          success: false,
          error: `Staff seat limit reached (${seatUsage.used}/${seatUsage.limit}). Your current subscription allows up to ${seatUsage.limit} staff members. Contact your administrator to upgrade your plan.`,
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

    const {
      firstName,
      lastName,
      phone,
      mobile,
      password,
      role,
      position,
      officeId,
      bio,
      isPublic = true,
      isFeatured = false,
    } = parsed.data;

    const email = parsed.data.email.toLowerCase();

    // Check existing email
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

    // Resolve Office
    let targetOfficeId = officeId;
    if (!targetOfficeId) {
      const defaultOffice = await prisma.office.findFirst();
      if (!defaultOffice) {
        const newOffice = await prisma.office.create({
          data: {
            name: "Head Office",
            slug: "head-office",
            address: "100 Prestige Blvd",
            suburb: "Sydney",
            state: "NSW",
            postcode: "2000",
            phone: "(02) 9000 0000",
            email: "info@hamptonhomes.com.au",
            isHeadOffice: true,
          },
        });
        targetOfficeId = newOffice.id;
      } else {
        targetOfficeId = defaultOffice.id;
      }
    }

    const newStaff = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone: phone || mobile,
        isActive: true,
        isEmailVerified: true,
        userRoles: {
          create: {
            roleId: roleRecord.id,
          },
        },
        agentProfile: {
          create: {
            officeId: targetOfficeId,
            position: position || (role === "ADMIN" ? "Principal / Partner" : "Sales Agent"),
            bio: bio || null,
            phone: phone || null,
            mobile: mobile || null,
            isPublic,
            isFeatured,
          },
        },
      },
      include: {
        userRoles: { include: { role: true } },
        agentProfile: { include: { office: true } },
      },
    });

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
        agentProfile: newStaff.agentProfile,
      },
      seatUsage: updatedSeatUsage,
    });
  } catch (error) {
    console.error("Admin POST staff error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return PATCH(req);
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

    const {
      userId,
      firstName,
      lastName,
      email,
      phone,
      mobile,
      role,
      position,
      officeId,
      bio,
      isPublic,
      isFeatured,
      isActive,
      newPassword,
    } = parsed.data;

    const target = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: { include: { role: true } },
        agentProfile: true,
      },
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

    const userUpdateData: Record<string, unknown> = {};
    if (firstName) userUpdateData.firstName = firstName;
    if (lastName) userUpdateData.lastName = lastName;
    if (email) userUpdateData.email = email.toLowerCase();
    if (phone !== undefined) userUpdateData.phone = phone;
    if (typeof isActive === "boolean") userUpdateData.isActive = isActive;
    if (newPassword) userUpdateData.passwordHash = await bcrypt.hash(newPassword, 10);

    // Update Role if provided
    if (role) {
      let roleRecord = await prisma.role.findUnique({ where: { name: role } });
      if (!roleRecord) {
        roleRecord = await prisma.role.create({ data: { name: role, isSystem: true } });
      }
      await prisma.userRole.deleteMany({ where: { userId } });
      await prisma.userRole.create({
        data: { userId, roleId: roleRecord.id },
      });
    }

    // Update User
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userUpdateData,
      include: {
        userRoles: { include: { role: true } },
        agentProfile: true,
      },
    });

    // Update or Create Agent Profile
    if (position !== undefined || officeId !== undefined || bio !== undefined || isPublic !== undefined || isFeatured !== undefined || mobile !== undefined) {
      let resolvedOfficeId = officeId;
      if (!resolvedOfficeId && !target.agentProfile?.officeId) {
        const defaultOffice = await prisma.office.findFirst();
        resolvedOfficeId = defaultOffice?.id;
      }

      if (target.agentProfile) {
        await prisma.agent.update({
          where: { id: target.agentProfile.id },
          data: {
            position: position ?? target.agentProfile.position,
            officeId: resolvedOfficeId ?? target.agentProfile.officeId,
            bio: bio !== undefined ? bio : target.agentProfile.bio,
            mobile: mobile !== undefined ? mobile : target.agentProfile.mobile,
            isPublic: isPublic !== undefined ? isPublic : target.agentProfile.isPublic,
            isFeatured: isFeatured !== undefined ? isFeatured : target.agentProfile.isFeatured,
          },
        });
      } else if (resolvedOfficeId) {
        await prisma.agent.create({
          data: {
            userId,
            officeId: resolvedOfficeId,
            position: position || "Sales Representative",
            bio: bio || null,
            mobile: mobile || null,
            isPublic: isPublic ?? true,
            isFeatured: isFeatured ?? false,
          },
        });
      }
    }

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
  } catch (error) {
    console.error("Admin PATCH staff error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (!currentUser.roles.includes("ADMIN") && !currentUser.roles.includes("SUPER_ADMIN"))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin privileges required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    if (userId === currentUser.id) {
      return NextResponse.json({ success: false, error: "Cannot delete your own account" }, { status: 400 });
    }

    const target = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: { include: { role: true } },
        agentProfile: true,
      },
    });

    if (!target) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (target.userRoles.some((r) => r.role.name === "SUPER_ADMIN") && !currentUser.roles.includes("SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Cannot delete Super Admin account" }, { status: 403 });
    }

    // Clean up relations
    if (target.agentProfile) {
      await prisma.propertyAgent.deleteMany({ where: { agentId: target.agentProfile.id } });
      await prisma.agent.delete({ where: { id: target.agentProfile.id } });
    }

    await prisma.userRole.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    invalidateSeatUsageCache();
    const seatUsage = await getStaffSeatUsage();

    return NextResponse.json({
      success: true,
      message: "Staff member deleted successfully",
      seatUsage,
    });
  } catch (error) {
    console.error("Admin DELETE staff error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
