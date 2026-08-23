/**
 * Apple vCard (.vcf) Exporter
 * Generates RFC 6350-compliant vCard 3.0 strings for Apple Contacts import.
 */

export interface VCardContact {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  company?: string;
  title?: string;
  address?: {
    street?: string;
    suburb?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  note?: string;
  photoUrl?: string;
}

/**
 * Generate a vCard 3.0 string for a single contact.
 */
export function generateVCard(contact: VCardContact): string {
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];

  const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(" ");
  lines.push(`FN:${escapeVCard(fullName)}`);
  lines.push(`N:${escapeVCard(contact.lastName ?? "")};${escapeVCard(contact.firstName)};;;`);

  if (contact.company) lines.push(`ORG:${escapeVCard(contact.company)}`);
  if (contact.title) lines.push(`TITLE:${escapeVCard(contact.title)}`);
  if (contact.email) lines.push(`EMAIL;TYPE=INTERNET,WORK:${contact.email}`);
  if (contact.phone) lines.push(`TEL;TYPE=WORK,VOICE:${contact.phone}`);
  if (contact.mobile) lines.push(`TEL;TYPE=CELL,VOICE:${contact.mobile}`);

  if (contact.address) {
    const { street = "", suburb = "", state = "", postcode = "", country = "Australia" } =
      contact.address;
    lines.push(
      `ADR;TYPE=WORK:;;${escapeVCard(street)};${escapeVCard(suburb)};${escapeVCard(state)};${escapeVCard(postcode)};${escapeVCard(country)}`
    );
  }

  if (contact.note) lines.push(`NOTE:${escapeVCard(contact.note)}`);
  if (contact.photoUrl) lines.push(`PHOTO;VALUE=URI:${contact.photoUrl}`);

  lines.push(`REV:${new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15)}Z`);
  lines.push("END:VCARD");

  return lines.join("\r\n");
}

/**
 * Generate a .vcf file content string for multiple contacts.
 */
export function generateVCardFile(contacts: VCardContact[]): string {
  return contacts.map(generateVCard).join("\r\n");
}

/**
 * Create a Response with correct MIME type for vCard download.
 */
export function createVCardResponse(contacts: VCardContact[], filename = "contacts.vcf"): Response {
  const vcfContent = generateVCardFile(contacts);
  return new Response(vcfContent, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(Buffer.byteLength(vcfContent, "utf8")),
    },
  });
}

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}
