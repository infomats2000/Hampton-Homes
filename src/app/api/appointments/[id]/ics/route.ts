/**
 * iCal Export API
 * GET /api/appointments/[id]/ics
 * Generates a .ics calendar event download for any inspection or appointment.
 */

import { NextRequest, NextResponse } from "next/server";
import { createICalResponse } from "@/lib/integrations/apple/ical";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // In production, fetch appointment from Prisma:
    // const appointment = await prisma.appointment.findUniqueOrThrow({ where: { id } });

    // Demo appointment data for development/testing
    const now = new Date();
    const startTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
    startTime.setHours(10, 0, 0, 0);
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 min

    const demoEvent = {
      uid: `appointment-${id}@hamptonhomes.com.au`,
      title: "Property Inspection — Hampton Homes",
      description: `Property Inspection\n\nAppointment ID: ${id}\n\nPlease arrive 5 minutes early.\n\nHampton Homes Realtors\nPhone: +61 2 9000 0000\nEmail: info@hamptonhomes.com.au`,
      location: "123 Harbour View Drive, Mosman NSW 2088",
      startTime,
      endTime,
      organizer: {
        name: "Hampton Homes Realtors",
        email: "info@hamptonhomes.com.au",
      },
      alarm: 60, // 60 minutes before
    };

    return createICalResponse([demoEvent], `inspection-${id}.ics`);
  } catch (err) {
    console.error("[iCal API] Error:", err);
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }
}
