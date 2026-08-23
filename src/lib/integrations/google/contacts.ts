/**
 * Google Contacts Integration — OAuth 2.0 People API
 * Contact export and sync engine using Google People API v1.
 */

import type { VCardContact } from "../apple/vcard";

export interface GoogleContactsConfig {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken?: string;
}

export interface GoogleContact {
  resourceName: string;
  etag?: string;
  names?: { givenName?: string; familyName?: string; displayName?: string }[];
  emailAddresses?: { value: string; type?: string }[];
  phoneNumbers?: { value: string; type?: string }[];
  organizations?: { name?: string; title?: string }[];
  addresses?: {
    streetAddress?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  }[];
  biographies?: { value: string }[];
}

/**
 * Create a Google People API contact from a VCardContact
 */
export function toGoogleContact(contact: VCardContact): object {
  return {
    names: [
      {
        givenName: contact.firstName,
        familyName: contact.lastName ?? "",
      },
    ],
    emailAddresses: contact.email ? [{ value: contact.email, type: "work" }] : [],
    phoneNumbers: [
      ...(contact.phone ? [{ value: contact.phone, type: "work" }] : []),
      ...(contact.mobile ? [{ value: contact.mobile, type: "mobile" }] : []),
    ],
    organizations:
      contact.company || contact.title
        ? [{ name: contact.company, title: contact.title }]
        : [],
    addresses: contact.address
      ? [
          {
            streetAddress: contact.address.street,
            city: contact.address.suburb,
            region: contact.address.state,
            postalCode: contact.address.postcode,
            country: contact.address.country ?? "Australia",
            type: "work",
          },
        ]
      : [],
    biographies: contact.note ? [{ value: contact.note, contentType: "TEXT_PLAIN" }] : [],
  };
}

/**
 * Create a new Google Contact via People API
 */
export async function createGoogleContact(
  config: GoogleContactsConfig,
  contact: VCardContact
): Promise<string> {
  const payload = toGoogleContact(contact);
  const res = await fetch("https://people.googleapis.com/v1/people:createContact", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Google Contacts API error: ${res.status}`);
  const data = await res.json();
  return data.resourceName as string;
}

/**
 * Update an existing Google Contact by resourceName
 */
export async function updateGoogleContact(
  config: GoogleContactsConfig,
  resourceName: string,
  contact: VCardContact,
  etag: string
): Promise<void> {
  const payload = { ...toGoogleContact(contact), etag, resourceName };
  const res = await fetch(
    `https://people.googleapis.com/v1/${resourceName}:updateContact?updatePersonFields=names,emailAddresses,phoneNumbers,organizations,addresses,biographies`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error(`Google Contacts update error: ${res.status}`);
}

/**
 * Generate Google OAuth 2.0 authorization URL
 */
export function getGoogleAuthUrl(clientId: string, redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/contacts",
      "https://www.googleapis.com/auth/calendar",
    ].join(" "),
    access_type: "offline",
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}
