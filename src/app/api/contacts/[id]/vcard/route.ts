import { NextRequest, NextResponse } from "next/server";
import { AGENCY_NAME } from "@/lib/agency-config";
import { createVCardResponse, type VCardContact } from "@/lib/integrations/apple/vcard";
import { prisma } from "@/lib/prisma";

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  return { firstName: parts.shift() ?? name, lastName: parts.join(" ") };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const type = request.nextUrl.searchParams.get("type")?.toUpperCase();
  let contact: VCardContact | null = null;

  if (type === "LEAD" || type === "TENANT") {
    const lead = await prisma.lead.findUnique({ where: { id }, include: { property: true } });
    if (lead) {
      const name = splitName(lead.name);
      contact = { ...name, email: lead.email, mobile: lead.phone, company: `${AGENCY_NAME} ${type === "TENANT" ? "Tenant" : "Lead"}`, title: lead.leadType, address: lead.property ? { street: `${lead.property.streetNumber ?? ""} ${lead.property.streetName}`.trim(), suburb: lead.property.suburb, state: lead.property.state, postcode: lead.property.postcode, country: lead.property.country } : undefined, note: lead.notes ?? undefined };
    }
  } else if (type === "AGENT") {
    const agent = await prisma.agent.findUnique({ where: { id }, include: { user: true, office: true } });
    if (agent) contact = { firstName: agent.user.firstName, lastName: agent.user.lastName, email: agent.user.email, phone: agent.phone ?? agent.office.phone, mobile: agent.mobile ?? agent.user.phone ?? undefined, company: AGENCY_NAME, title: agent.position, address: { street: agent.office.address, suburb: agent.office.suburb, state: agent.office.state, postcode: agent.office.postcode, country: "Australia" }, note: agent.bio ?? undefined, photoUrl: agent.photoUrl ?? undefined };
  } else if (type === "CUSTOMER") {
    const customer = await prisma.customerProfile.findUnique({ where: { id }, include: { user: true } });
    if (customer) contact = { firstName: customer.user.firstName, lastName: customer.user.lastName, email: customer.user.email, mobile: customer.user.phone ?? undefined, company: `${AGENCY_NAME} Customer`, title: "Customer", note: `Registered ${AGENCY_NAME} customer.` };
  }

  if (!contact) return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  const safeName = `${contact.firstName}-${contact.lastName ?? "contact"}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  return createVCardResponse([contact], `${safeName}.vcf`);
}
