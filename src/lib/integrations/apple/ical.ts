/**
 * Apple iCal (.ics) Exporter
 * Generates RFC 5545-compliant iCalendar strings for Apple Calendar, Google Calendar,
 * and Microsoft Outlook import.
 */

export interface ICalEvent {
  uid?: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  organizer?: { name: string; email: string };
  attendees?: { name: string; email: string }[];
  url?: string;
  alarm?: number; // minutes before event to remind
}

/**
 * Generate an iCalendar (.ics) string for a single event.
 */
export function generateICalEvent(event: ICalEvent): string {
  const now = formatICalDate(new Date());
  const uid =
    event.uid ?? `${Date.now()}-${Math.random().toString(36).slice(2)}@hamptonhomes.com.au`;

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hampton Homes Realtors//Real Estate Platform//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatICalDate(event.startTime)}`,
    `DTEND:${formatICalDate(event.endTime)}`,
    `SUMMARY:${escapeICal(event.title)}`,
  ];

  if (event.description) lines.push(`DESCRIPTION:${escapeICal(event.description)}`);
  if (event.location) lines.push(`LOCATION:${escapeICal(event.location)}`);
  if (event.url) lines.push(`URL:${event.url}`);

  if (event.organizer) {
    lines.push(
      `ORGANIZER;CN="${escapeICal(event.organizer.name)}":MAILTO:${event.organizer.email}`
    );
  }

  if (event.attendees) {
    for (const attendee of event.attendees) {
      lines.push(
        `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;CN="${escapeICal(attendee.name)}":MAILTO:${attendee.email}`
      );
    }
  }

  if (event.alarm !== undefined) {
    lines.push(
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:Reminder: ${escapeICal(event.title)}`,
      `TRIGGER:-PT${event.alarm}M`,
      "END:VALARM"
    );
  }

  lines.push("END:VEVENT", "END:VCALENDAR");

  return lines.join("\r\n");
}

/**
 * Generate an .ics file content string for multiple events.
 */
export function generateICalFile(events: ICalEvent[]): string {
  const eventLines = events.map((e) => {
    // Strip the VCALENDAR wrapper for multi-event files
    const vcal = generateICalEvent(e);
    const inner = vcal
      .replace("BEGIN:VCALENDAR\r\n", "")
      .replace(/.*VERSION.*\r\n/, "")
      .replace(/.*PRODID.*\r\n/, "")
      .replace(/.*CALSCALE.*\r\n/, "")
      .replace(/.*METHOD.*\r\n/, "")
      .replace("\r\nEND:VCALENDAR", "");
    return inner;
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hampton Homes Realtors//Real Estate Platform//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    ...eventLines,
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Create a Response with correct MIME type for iCal download.
 */
export function createICalResponse(events: ICalEvent[], filename = "appointment.ics"): Response {
  const icsContent =
    events.length === 1 ? generateICalEvent(events[0]) : generateICalFile(events);
  return new Response(icsContent, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(Buffer.byteLength(icsContent, "utf8")),
    },
  });
}

function formatICalDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function escapeICal(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}
