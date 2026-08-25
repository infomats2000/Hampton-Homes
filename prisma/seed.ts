import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { PERMISSIONS, ROLE_DEFAULT_PERMISSIONS, RoleType } from "../src/lib/permissions";
import { DEFAULT_SUBSCRIPTION } from "../src/lib/features";

async function main() {
  console.log("🌱 Starting Hampton Homes database seeding...");

  // 1. Seed Permissions
  console.log("Creating permissions...");
  const permissionEntries = Object.entries(PERMISSIONS);
  for (const [key, code] of permissionEntries) {
    const module = code.split(".")[0] || "general";
    await prisma.permission.upsert({
      where: { code },
      update: {
        name: key.replace(/_/g, " "),
        module,
      },
      create: {
        code,
        name: key.replace(/_/g, " "),
        module,
        description: `Permission for ${code}`,
      },
    });
  }

  // 2. Seed Roles & RolePermissions
  console.log("Creating roles and role-permission mappings...");
  const rolesList: RoleType[] = [
    "SUPER_ADMIN",
    "ADMIN",
    "MARKETING_ADMIN",
    "OFFICE_MANAGER",
    "AGENT",
    "SUPPORT",
    "CUSTOMER",
  ];

  for (const roleName of rolesList) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {
        description: `System role for ${roleName}`,
        isSystem: true,
      },
      create: {
        name: roleName,
        description: `System role for ${roleName}`,
        isSystem: true,
      },
    });

    const allowedPermCodes = ROLE_DEFAULT_PERMISSIONS[roleName] || [];
    for (const code of allowedPermCodes) {
      const perm = await prisma.permission.findUnique({ where: { code } });
      if (perm) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: perm.id,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: perm.id,
          },
        });
      }
    }
  }

  // 3. Seed Default Super Admin Account
  console.log("Creating Super Admin account...");
  const superAdminPassword = await bcrypt.hash("SuperAdmin123!", 10);
  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: "SUPER_ADMIN" } });
  
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@hamptonhomes.com.au" },
    update: {
      firstName: "Super",
      lastName: "Admin",
      passwordHash: superAdminPassword,
      isActive: true,
    },
    create: {
      email: "superadmin@hamptonhomes.com.au",
      passwordHash: superAdminPassword,
      firstName: "Super",
      lastName: "Admin",
      isActive: true,
      isEmailVerified: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: superAdmin.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: superAdmin.id,
      roleId: superAdminRole.id,
    },
  });

  // 4. Seed Agency Owner (Admin) Account
  console.log("Creating Agency Owner (Admin) account...");
  const adminEmail = process.env.ADMIN_EMAIL || "admin@hamptonhomes.com.au";
  const adminPassword = await bcrypt.hash("AdminPassword123!", 10);
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: "ADMIN" } });

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      firstName: "Agency",
      lastName: "Owner",
      passwordHash: adminPassword,
      isActive: true,
    },
    create: {
      email: adminEmail,
      passwordHash: adminPassword,
      firstName: "Agency",
      lastName: "Owner",
      isActive: true,
      isEmailVerified: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  // 5. Seed Head Office & Agent Account
  console.log("Creating Head Office & Agent account...");
  const office = await prisma.office.upsert({
    where: { slug: "sydney-head-office" },
    update: {},
    create: {
      name: "Hampton Homes Sydney HQ",
      slug: "sydney-head-office",
      address: "Level 24, 100 Barangaroo Ave",
      suburb: "Barangaroo",
      state: "NSW",
      postcode: "2000",
      phone: "(02) 9000 1234",
      email: "headquarters@hamptonhomes.com.au",
      isHeadOffice: true,
      description: "Hampton Homes Premier Barangaroo Flagship Office",
    },
  });

  const agentPassword = await bcrypt.hash("AgentPassword123!", 10);
  const agentRole = await prisma.role.findUniqueOrThrow({ where: { name: "AGENT" } });

  const agentUser = await prisma.user.upsert({
    where: { email: "marcus.vance@hamptonhomes.com.au" },
    update: {
      firstName: "Marcus",
      lastName: "Vance",
      passwordHash: agentPassword,
      isActive: true,
    },
    create: {
      email: "marcus.vance@hamptonhomes.com.au",
      passwordHash: agentPassword,
      firstName: "Marcus",
      lastName: "Vance",
      phone: "0412 345 678",
      isActive: true,
      isEmailVerified: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: agentUser.id,
        roleId: agentRole.id,
      },
    },
    update: {},
    create: {
      userId: agentUser.id,
      roleId: agentRole.id,
    },
  });

  await prisma.agent.upsert({
    where: { userId: agentUser.id },
    update: {},
    create: {
      userId: agentUser.id,
      officeId: office.id,
      position: "Director of Prestige Sales",
      bio: "Marcus Vance is a leading luxury real estate specialist in Sydney with over 15 years experience.",
      mobile: "0412 345 678",
      isFeatured: true,
      isPublic: true,
    },
  });

  // 6. Seed Customer Account
  console.log("Creating Customer account...");
  const customerPassword = await bcrypt.hash("CustomerPassword123!", 10);
  const customerRole = await prisma.role.findUniqueOrThrow({ where: { name: "CUSTOMER" } });

  const customerUser = await prisma.user.upsert({
    where: { email: "james.harrison@example.com.au" },
    update: {
      firstName: "James",
      lastName: "Harrison",
      passwordHash: customerPassword,
      isActive: true,
    },
    create: {
      email: "james.harrison@example.com.au",
      passwordHash: customerPassword,
      firstName: "James",
      lastName: "Harrison",
      phone: "0498 765 432",
      isActive: true,
      isEmailVerified: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: customerUser.id,
        roleId: customerRole.id,
      },
    },
    update: {},
    create: {
      userId: customerUser.id,
      roleId: customerRole.id,
    },
  });

  await prisma.customerProfile.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: {
      userId: customerUser.id,
      preferences: {
        propertyTypes: ["House", "Apartment"],
        minBedrooms: 3,
        maxPrice: 3500000,
        suburbs: ["Manly", "Mosman", "Vaucluse"],
      },
    },
  });

  // 7. Seed Subscription Setting
  console.log("Creating initial subscription setting...");
  await prisma.setting.upsert({
    where: { key: "system.subscription" },
    update: {},
    create: {
      key: "system.subscription",
      value: DEFAULT_SUBSCRIPTION as any,
      category: "SYSTEM",
      description: "Platform subscription tier and granular module feature flags",
      isPublic: true,
    },
  });

  console.log("✅ Hampton Homes seeding complete!");
  console.log("\nDefault Seeded Accounts:");
  console.log("1. Super Admin: superadmin@hamptonhomes.com.au  | Password: SuperAdmin123!");
  console.log("2. Agency Owner: admin@hamptonhomes.com.au        | Password: AdminPassword123!");
  console.log("3. Agent:        marcus.vance@hamptonhomes.com.au | Password: AgentPassword123!");
  console.log("4. Customer:     james.harrison@example.com.au    | Password: CustomerPassword123!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
