/**
 * Microsoft Outlook Contacts Integration — MS Graph API
 * Contact export and sync engine.
 */

import type { VCardContact } from "../apple/vcard";

export interface MicrosoftContactsConfig {
  accessToken: string;
}

/**
 * Convert internal VCardContact to MS Graph contact payload
 */
export function toMicrosoftContact(contact: VCardContact): object {
  return {
    givenName: contact.firstName,
    surname: contact.lastName ?? "",
    displayName: [contact.firstName, contact.lastName].filter(Boolean).join(" "),
    jobTitle: contact.title,
    companyName: contact.company,
    emailAddresses: contact.email
      ? [{ address: contact.email, name: [contact.firstName, contact.lastName].filter(Boolean).join(" ") }]
      : [],
    businessPhones: contact.phone ? [contact.phone] : [],
    mobilePhone: contact.mobile,
    businessAddress: contact.address
      ? {
          street: contact.address.street,
          city: contact.address.suburb,
          state: contact.address.state,
          postalCode: contact.address.postcode,
          countryOrRegion: contact.address.country ?? "Australia",
        }
      : undefined,
    personalNotes: contact.note,
  };
}

/**
 * Create a contact in Microsoft Outlook via MS Graph
 */
export async function createMicrosoftContact(
  config: MicrosoftContactsConfig,
  contact: VCardContact
): Promise<string> {
  const payload = toMicrosoftContact(contact);
  const res = await fetch("https://graph.microsoft.com/v1.0/me/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`MS Graph Contacts error: ${res.status}`);
  const data = await res.json();
  return data.id as string;
}

/**
 * Update an existing Microsoft Contact
 */
export async function updateMicrosoftContact(
  config: MicrosoftContactsConfig,
  graphContactId: string,
  contact: VCardContact
): Promise<void> {
  const payload = toMicrosoftContact(contact);
  const res = await fetch(`https://graph.microsoft.com/v1.0/me/contacts/${graphContactId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`MS Graph Contacts update error: ${res.status}`);
}

/**
 * Generate Microsoft OAuth 2.0 authorization URL
 */
export function getMicrosoftAuthUrl(clientId: string, redirectUri: string, tenantId = "common"): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: [
      "Contacts.ReadWrite",
      "Calendars.ReadWrite",
      "offline_access",
    ].join(" "),
    response_mode: "query",
  });
  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params}`;
}
