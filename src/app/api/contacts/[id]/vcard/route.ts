/**
 * vCard Export API
 * GET /api/contacts/[id]/vcard
 * Generates a .vcf download for any lead, customer, or agent.
 * ?type=lead|agent|customer
 */

import { NextRequest, NextResponse } from "next/server";
import { generateVCard, createVCardResponse } from "@/lib/integrations/apple/vcard";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const type = request.nextUrl.searchParams.get("type") ?? "lead";

  try {
    // Mock contact data — in production, fetch from Prisma based on type+id
    // const lead = await prisma.lead.findUniqueOrThrow({ where: { id } });

    // Demo vCard for development/testing
    const demoContacts: Record<string, Parameters<typeof generateVCard>[0]> = {
      lead: {
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com.au",
        phone: "+61 2 9000 0000",
        mobile: "+61 400 000 000",
        company: "Hampton Homes Enquiry",
        note: `Lead from Hampton Homes portal. Type: ${type}. ID: ${id}`,
      },
      agent: {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@hamptonhomes.com.au",
        phone: "+61 2 9000 0001",
        mobile: "+61 411 000 001",
        company: "Hampton Homes Realtors",
        title: "Senior Sales Agent",
      },
      customer: {
        firstName: "Customer",
        lastName: "Account",
        email: "customer@example.com.au",
        phone: "+61 2 9000 0002",
        company: "Hampton Homes Customer",
      },
    };

    const contactData = demoContacts[type] ?? demoContacts.lead;
    const filename = `${contactData.firstName?.toLowerCase()}-${contactData.lastName?.toLowerCase()}.vcf`;

    return createVCardResponse([contactData], filename);
  } catch (err) {
    console.error("[vCard API] Error:", err);
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
}
