/**
 * Microsoft Outlook Calendar Integration — MS Graph API
 * Appointment and inspection sync engine.
 */

import type { ICalEvent } from "../apple/ical";

export interface MicrosoftCalendarConfig {
  accessToken: string;
  calendarId?: string; // Specific calendar ID or leave undefined for default
}

export interface MicrosoftCalendarEvent {
  id?: string;
  subject: string;
  body?: { contentType: "Text" | "HTML"; content: string };
  location?: { displayName: string };
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees?: {
    emailAddress: { address: string; name?: string };
    type: "required" | "optional";
  }[];
  isReminderOn?: boolean;
  reminderMinutesBeforeStart?: number;
  webLink?: string;
}

const TIMEZONE = "AUS Eastern Standard Time";

/**
 * Convert an internal ICalEvent to an MS Graph Calendar event payload
 */
export function toMicrosoftCalendarEvent(event: ICalEvent): MicrosoftCalendarEvent {
  return {
    subject: event.title,
    body: event.description
      ? { contentType: "Text", content: event.description }
      : undefined,
    location: event.location ? { displayName: event.location } : undefined,
    start: {
      dateTime: event.startTime.toISOString().replace("Z", ""),
      timeZone: TIMEZONE,
    },
    end: {
      dateTime: event.endTime.toISOString().replace("Z", ""),
      timeZone: TIMEZONE,
    },
    attendees: event.attendees?.map((a) => ({
      emailAddress: { address: a.email, name: a.name },
      type: "required" as const,
    })),
    isReminderOn: event.alarm !== undefined,
    reminderMinutesBeforeStart: event.alarm,
  };
}

/**
 * Insert a new event into Microsoft Outlook Calendar
 */
export async function insertMicrosoftCalendarEvent(
  config: MicrosoftCalendarConfig,
  event: ICalEvent
): Promise<string> {
  const endpoint = config.calendarId
    ? `https://graph.microsoft.com/v1.0/me/calendars/${config.calendarId}/events`
    : "https://graph.microsoft.com/v1.0/me/events";

  const payload = toMicrosoftCalendarEvent(event);
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`MS Graph Calendar insert error: ${res.status}`);
  const data = await res.json();
  return data.id as string;
}

/**
 * Update an existing Outlook Calendar event
 */
export async function updateMicrosoftCalendarEvent(
  config: MicrosoftCalendarConfig,
  graphEventId: string,
  event: ICalEvent
): Promise<void> {
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/events/${graphEventId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toMicrosoftCalendarEvent(event)),
    }
  );
  if (!res.ok) throw new Error(`MS Graph Calendar update error: ${res.status}`);
}

/**
 * Delete an Outlook Calendar event
 */
export async function deleteMicrosoftCalendarEvent(
  config: MicrosoftCalendarConfig,
  graphEventId: string
): Promise<void> {
  await fetch(`https://graph.microsoft.com/v1.0/me/events/${graphEventId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${config.accessToken}` },
  });
}
