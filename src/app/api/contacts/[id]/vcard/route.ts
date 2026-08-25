/**
 * vCard Export API
 * GET /api/contacts/[id]/vcard
 * Generates a .vcf download for any lead, customer, or agent.
 * ?type=lead|agent|customer
 */

import { NextRequest, NextResponse } from "next/server";
import { generateVCard, createVCardResponse, VCardContact } from "@/lib/integrations/apple/vcard";
import { AGENCY_NAME } from "@/lib/agency-config";
import { getContactById } from "@/lib/contacts/contacts-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const type = request.nextUrl.searchParams.get("type") ?? "lead";

  try {
    const contact = getContactById(id);

    const contactData: VCardContact = contact
      ? {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          mobile: contact.mobile,
          company: contact.company ?? `${AGENCY_NAME} ${contact.type}`,
          title: contact.title ?? contact.type,
          address: {
            suburb: contact.suburb,
            state: contact.state ?? "NSW",
            postcode: contact.postcode,
            country: "Australia",
          },
          note: contact.notes ?? `Imported from ${AGENCY_NAME} ERP.`,
        }
      : {
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@example.com.au",
          phone: "+61 2 9000 0000",
          mobile: "+61 400 000 000",
          company: `${AGENCY_NAME} Enquiry`,
          note: `Lead from ${AGENCY_NAME} ERP. Type: ${type}. ID: ${id}`,
        };

    const filename = `${contactData.firstName?.toLowerCase()}-${contactData.lastName?.toLowerCase()}.vcf`;

    return createVCardResponse([contactData], filename);
  } catch (err) {
    console.error("[vCard API] Error:", err);
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
}
