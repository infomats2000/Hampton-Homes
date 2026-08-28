import { Badge } from "@/components/ui/badge";
import { LeadsManager, type LeadView } from "@/components/admin/leads-manager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const records = await prisma.lead.findMany({
    include: {
      property: true,
      assignedAgent: { include: { user: true, office: true } },
      activities: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
    take: 250,
  });
  const leads: LeadView[] = records.map((lead) => ({
    id: lead.id, name: lead.name, email: lead.email, phone: lead.phone,
    leadType: lead.leadType, status: lead.status, priority: lead.priority,
    propertyAddress: lead.property ? `${lead.property.streetNumber ?? ""} ${lead.property.streetName}, ${lead.property.suburb} ${lead.property.state}`.trim() : "",
    assignedAgentName: lead.assignedAgent ? `${lead.assignedAgent.user.firstName} ${lead.assignedAgent.user.lastName}` : "Unassigned",
    officeName: lead.assignedAgent?.office.name ?? "No office assigned",
    createdAt: lead.createdAt.toISOString(), notes: lead.notes ?? "",
    activities: lead.activities.map((activity) => ({ id: activity.id, description: activity.description, actorName: activity.actorName, createdAt: activity.createdAt.toISOString() })),
  }));

  return <div className="space-y-8">
    <div className="border-b border-slate-200 pb-6">
      <div className="flex items-center gap-2"><h1 className="font-serif text-3xl font-bold text-[#0a192f]">Lead Management & Pipeline</h1><Badge variant="gold">Live Database</Badge></div>
      <p className="mt-1 text-sm text-slate-500">Track property enquiries, assignments, contact progress and conversion outcomes.</p>
    </div>
    <LeadsManager initialLeads={leads} />
  </div>;
}
