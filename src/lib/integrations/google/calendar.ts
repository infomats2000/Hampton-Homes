/**
 * Google Calendar Integration — OAuth 2.0 Calendar API v3
 * Appointment and inspection sync engine.
 */

import type { ICalEvent } from "../apple/ical";

export interface GoogleCalendarConfig {
  accessToken: string;
  calendarId?: string; // Defaults to "primary"
}

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime: string; timeZone?: string };
  end: { dateTime: string; timeZone?: string };
  attendees?: { email: string; displayName?: string }[];
  reminders?: {
    useDefault: boolean;
    overrides?: { method: string; minutes: number }[];
  };
  htmlLink?: string;
}

const TIMEZONE = "Australia/Sydney";

/**
 * Convert an internal ICalEvent to a Google Calendar event payload
 */
export function toGoogleCalendarEvent(event: ICalEvent): GoogleCalendarEvent {
  return {
    summary: event.title,
    description: event.description,
    location: event.location,
    start: { dateTime: event.startTime.toISOString(), timeZone: TIMEZONE },
    end: { dateTime: event.endTime.toISOString(), timeZone: TIMEZONE },
    attendees: event.attendees?.map((a) => ({ email: a.email, displayName: a.name })),
    reminders: event.alarm
      ? {
          useDefault: false,
          overrides: [
            { method: "popup", minutes: event.alarm },
            { method: "email", minutes: event.alarm },
          ],
        }
      : { useDefault: true },
  };
}

/**
 * Insert a new event into Google Calendar
 */
export async function insertGoogleCalendarEvent(
  config: GoogleCalendarConfig,
  event: ICalEvent
): Promise<string> {
  const calendarId = config.calendarId ?? "primary";
  const payload = toGoogleCalendarEvent(event);
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error(`Google Calendar insert error: ${res.status}`);
  const data = await res.json();
  return data.id as string;
}

/**
 * Update an existing Google Calendar event
 */
export async function updateGoogleCalendarEvent(
  config: GoogleCalendarConfig,
  googleEventId: string,
  event: ICalEvent
): Promise<void> {
  const calendarId = config.calendarId ?? "primary";
  const payload = toGoogleCalendarEvent(event);
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${googleEventId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error(`Google Calendar update error: ${res.status}`);
}

/**
 * Delete a Google Calendar event
 */
export async function deleteGoogleCalendarEvent(
  config: GoogleCalendarConfig,
  googleEventId: string
): Promise<void> {
  const calendarId = config.calendarId ?? "primary";
  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${googleEventId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${config.accessToken}` },
    }
  );
}
