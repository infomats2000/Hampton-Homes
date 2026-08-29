import { NextResponse } from "next/server";

import { appraisalUpdateSchema } from "@/lib/appraisals/appraisal-input";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user?.roles.some((role) => role === "ADMIN" || role === "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const parsed = appraisalUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid appraisal update" }, { status: 400 });
  const { id } = await params;
  const input = parsed.data;
  const existing = await prisma.appraisalRequest.findUnique({ where: { id }, include: { lead: true } });
  if (!existing) return NextResponse.json({ error: "Appraisal request not found" }, { status: 404 });

  if (input.assignedAgentId) {
    const agent = await prisma.agent.findUnique({ where: { id: input.assignedAgentId }, select: { id: true } });
    if (!agent) return NextResponse.json({ error: "Assigned agent not found" }, { status: 400 });
  }
  if (input.status === "SCHEDULED" && !input.scheduledAt && !existing.appointmentId) {
    return NextResponse.json({ error: "Choose an appointment time before scheduling" }, { status: 400 });
  }

  const actorName = `${user.firstName} ${user.lastName}`;
  const result = await prisma.$transaction(async (tx) => {
    let appointmentId = existing.appointmentId;
    if (input.scheduledAt) {
      const startTime = new Date(input.scheduledAt);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
      const appointment = appointmentId
        ? await tx.appointment.update({
            where: { id: appointmentId },
            data: { startTime, endTime, agentId: input.assignedAgentId ?? existing.assignedAgentId, status: input.status === "COMPLETED" ? "COMPLETED" : "SCHEDULED" },
          })
        : await tx.appointment.create({
            data: {
              type: "APPRAISAL",
              title: `Property appraisal — ${existing.address}`,
              description: `Appraisal for ${existing.lead.name}`,
              startTime,
              endTime,
              locationAddress: `${existing.address}, ${existing.suburb} ${existing.state} ${existing.postcode}`,
              agentId: input.assignedAgentId ?? existing.assignedAgentId,
              leadId: existing.leadId,
            },
          });
      appointmentId = appointment.id;
    } else if (appointmentId && (input.status === "COMPLETED" || input.status === "ARCHIVED")) {
      await tx.appointment.update({ where: { id: appointmentId }, data: { status: input.status === "COMPLETED" ? "COMPLETED" : "CANCELLED" } });
    }

    const leadStatus = input.status === "NEW" ? "NEW"
      : input.status === "ASSIGNED" ? "ASSIGNED"
      : input.status === "SCHEDULED" ? "APPOINTMENT_BOOKED"
      : input.status === "COMPLETED" ? "APPRAISAL_COMPLETED"
      : "ARCHIVED";
    const assignedAgentId = input.assignedAgentId === undefined ? existing.assignedAgentId : input.assignedAgentId;

    await tx.lead.update({
      where: { id: existing.leadId },
      data: {
        status: leadStatus,
        agentId: assignedAgentId,
        activities: {
          create: {
            actionType: "APPRAISAL_UPDATED",
            description: `Appraisal status changed from ${existing.status} to ${input.status}`,
            actorName,
          },
        },
      },
    });
    return tx.appraisalRequest.update({
      where: { id },
      data: { status: input.status, assignedAgentId, appointmentId },
    });
  });

  return NextResponse.json({ id: result.id, status: result.status, assignedAgentId: result.assignedAgentId, appointmentId: result.appointmentId });
}
