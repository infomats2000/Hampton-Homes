import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppraisalsManager, type AppraisalView } from "@/components/admin/appraisals-manager";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminAppraisalsPage() {
  const [records, agentRecords] = await Promise.all([
    prisma.appraisalRequest.findMany({
      include: {
        lead: true,
        assignedAgent: { include: { user: true, office: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 250,
    }),
    prisma.agent.findMany({ where: { user: { isActive: true } }, include: { user: true, office: true }, orderBy: [{ displayOrder: "asc" }, { user: { lastName: "asc" } }] }),
  ]);
  const appointmentIds = records.flatMap((record) => record.appointmentId ? [record.appointmentId] : []);
  const appointments = appointmentIds.length ? await prisma.appointment.findMany({ where: { id: { in: appointmentIds } }, select: { id: true, startTime: true } }) : [];
  const appointmentById = new Map(appointments.map((appointment) => [appointment.id, appointment]));
  const appraisals: AppraisalView[] = records.map((record) => ({
    id: record.id, leadId: record.leadId, ownerName: record.lead.name, ownerEmail: record.lead.email, ownerPhone: record.lead.phone,
    address: record.address, suburb: record.suburb, state: record.state, postcode: record.postcode,
    propertyType: record.propertyType, bedrooms: record.bedrooms, bathrooms: record.bathrooms,
    sellingTimeframe: record.sellingTimeframe, status: record.status, assignedAgentId: record.assignedAgentId ?? "",
    assignedAgentName: record.assignedAgent ? `${record.assignedAgent.user.firstName} ${record.assignedAgent.user.lastName}` : "Unassigned",
    scheduledAt: record.appointmentId ? appointmentById.get(record.appointmentId)?.startTime.toISOString().slice(0, 16) ?? "" : "",
    createdAt: record.createdAt.toISOString(),
  }));
  const agents = agentRecords.map((agent) => ({ id: agent.id, name: `${agent.user.firstName} ${agent.user.lastName}`, officeName: agent.office.name }));

  return <div className="space-y-8"><div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2"><h1 className="font-serif text-3xl font-bold text-[#0a192f]">Property Appraisal Requests</h1><Badge variant="gold">Live Database</Badge></div><p className="mt-1 text-sm text-slate-500">Assign agents, schedule visits and track appraisal completion.</p></div><Link href="/sell" target="_blank" className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium hover:bg-slate-50">Preview public form<ArrowRight className="ml-2 h-3.5 w-3.5" /></Link></div><AppraisalsManager initialAppraisals={appraisals} agents={agents} /></div>;
}
