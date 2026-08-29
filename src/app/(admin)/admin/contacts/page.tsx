import { ContactsManager, type ContactView } from "@/components/admin/contacts-manager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function sourceLabel(source: string) {
  const upper = source.toUpperCase();
  if (upper.includes("MRI")) return "MRI";
  if (upper.includes("HOMEPASS")) return "HOMEPASS";
  if (upper.includes("PROPERTYME")) return "PROPERTYME";
  if (upper.includes("GOOGLE")) return "GOOGLE";
  if (upper.includes("MICROSOFT")) return "MICROSOFT";
  return "MANUAL";
}

export default async function UnifiedContactsPage() {
  const [leads, agents, customers, links, matches] = await Promise.all([
    prisma.lead.findMany({ include: { property: true }, orderBy: { updatedAt: "desc" }, take: 500 }),
    prisma.agent.findMany({ include: { user: true, office: true }, orderBy: { updatedAt: "desc" } }),
    prisma.customerProfile.findMany({ include: { user: true }, orderBy: { updatedAt: "desc" }, take: 500 }),
    prisma.contactExternalLink.findMany(),
    prisma.contactMatchCandidate.findMany({ where: { action: "PENDING" }, select: { primaryId: true, matchId: true } }),
  ]);
  const sourcesByContact = new Map<string, Set<string>>();
  for (const link of links) {
    const key = `${link.internalType}:${link.internalId}`;
    const sources = sourcesByContact.get(key) ?? new Set<string>();
    sources.add(link.provider);
    sourcesByContact.set(key, sources);
  }
  const matchCounts = new Map<string, number>();
  for (const match of matches) {
    matchCounts.set(match.primaryId, (matchCounts.get(match.primaryId) ?? 0) + 1);
    matchCounts.set(match.matchId, (matchCounts.get(match.matchId) ?? 0) + 1);
  }
  const contacts: ContactView[] = [
    ...leads.map((lead): ContactView => ({
      id: lead.id, name: lead.name, email: lead.email, phone: lead.phone,
      type: lead.leadType === "TENANT" ? "TENANT" : "LEAD",
      sources: Array.from(sourcesByContact.get(`LEAD:${lead.id}`) ?? [sourceLabel(lead.source)]),
      location: lead.property ? `${lead.property.suburb} ${lead.property.state}` : "",
      lastActivity: lead.updatedAt.toISOString(), matchFlags: matchCounts.get(lead.id) ?? 0, notes: lead.notes ?? "",
    })),
    ...agents.map((agent): ContactView => ({
      id: agent.id, name: `${agent.user.firstName} ${agent.user.lastName}`, email: agent.user.email,
      phone: agent.mobile ?? agent.phone ?? agent.user.phone ?? "", type: "AGENT",
      sources: Array.from(sourcesByContact.get(`AGENT:${agent.id}`) ?? ["MANUAL"]),
      location: `${agent.office.suburb} ${agent.office.state}`, lastActivity: agent.updatedAt.toISOString(), matchFlags: matchCounts.get(agent.id) ?? 0, notes: agent.bio ?? "",
    })),
    ...customers.map((customer): ContactView => ({
      id: customer.id, name: `${customer.user.firstName} ${customer.user.lastName}`, email: customer.user.email,
      phone: customer.user.phone ?? "", type: "CUSTOMER",
      sources: Array.from(sourcesByContact.get(`CUSTOMER:${customer.id}`) ?? ["MANUAL"]),
      location: "", lastActivity: customer.updatedAt.toISOString(), matchFlags: matchCounts.get(customer.id) ?? 0, notes: "Registered customer",
    })),
  ];
  contacts.sort((a, b) => b.lastActivity.localeCompare(a.lastActivity));
  return <ContactsManager initialContacts={contacts} />;
}
