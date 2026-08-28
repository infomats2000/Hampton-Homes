import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({ status: z.enum(["NEW", "ASSIGNED", "CONTACTED", "QUALIFIED", "APPOINTMENT_BOOKED", "APPRAISAL_COMPLETED", "NEGOTIATING", "WON", "LOST", "ARCHIVED"]) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user?.roles.some((role) => role === "ADMIN" || role === "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const { id } = await params;
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid lead status" }, { status: 400 });

  const existing = await prisma.lead.findUnique({ where: { id }, select: { status: true } });
  if (!existing) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  if (existing.status !== parsed.data.status) {
    await prisma.lead.update({
      where: { id }, data: {
        status: parsed.data.status,
        activities: { create: { actionType: "STATUS_CHANGE", description: `Status changed from ${existing.status} to ${parsed.data.status}`, actorName: `${user.firstName} ${user.lastName}` } },
      },
    });
  }
  return NextResponse.json({ id, status: parsed.data.status });
}
