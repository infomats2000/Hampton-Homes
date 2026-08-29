import dotenv from "dotenv";
import { hashPassword } from "../src/lib/auth";
import { passwordSchema } from "../src/lib/password-policy";
import { prisma } from "../src/lib/prisma";

dotenv.config({ path: ".env.local" });
dotenv.config();

const accounts = [
  ["superadmin@hamptonhomes.com.au", "ROTATE_SUPER_ADMIN_PASSWORD"],
  [process.env.ADMIN_EMAIL || "admin@hamptonhomes.com.au", "ROTATE_ADMIN_PASSWORD"],
  ["marcus.vance@hamptonhomes.com.au", "ROTATE_AGENT_PASSWORD"],
  ["james.harrison@example.com.au", "ROTATE_CUSTOMER_PASSWORD"],
] as const;

async function main() {
  for (const [email, variable] of accounts) {
    const password = passwordSchema.parse(process.env[variable]);
    const result = await prisma.user.updateMany({ where: { email }, data: { passwordHash: await hashPassword(password) } });
    if (result.count !== 1) throw new Error(`Expected one account for ${email}; updated ${result.count}.`);
    await prisma.auditLog.create({ data: { actorEmail: "production-security-rotation", action: "PASSWORD_ROTATED", entity: "User", entityId: email } });
    console.log(`Rotated ${email}`);
  }
}

main().finally(() => prisma.$disconnect());
