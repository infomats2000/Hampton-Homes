import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clearSessionCookie, getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { passwordSchema } from "@/lib/password-policy";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((value) => value.newPassword === value.confirmPassword, { message: "New passwords do not match", path: ["confirmPassword"] });

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, "auth:change-password", 5, 30 * 60 * 1000);
  if (!rateLimit.allowed) return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } });
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const parsed = changePasswordSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid password details" }, { status: 400 });
  if (parsed.data.currentPassword === parsed.data.newPassword) return NextResponse.json({ error: "New password must be different from the current password" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: currentUser.id }, select: { passwordHash: true } });
  if (!user || !(await verifyPassword(parsed.data.currentPassword, user.passwordHash))) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  await prisma.$transaction([
    prisma.user.update({ where: { id: currentUser.id }, data: { passwordHash: await hashPassword(parsed.data.newPassword) } }),
    prisma.auditLog.create({ data: { actorId: currentUser.id, actorEmail: currentUser.email, action: "PASSWORD_CHANGED", entity: "User", entityId: currentUser.id } }),
  ]);
  await clearSessionCookie();
  return NextResponse.json({ success: true, message: "Password changed. Please sign in again." });
}

