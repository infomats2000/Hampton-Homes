/**
 * Routine Inspection Report Download API
 * GET /api/tenancy/inspection-report/[id]
 * Serves printable statutory Routine Inspection Report HTML document.
 */

import { NextRequest, NextResponse } from "next/server";
import { MOCK_INSPECTIONS, generateInspectionReportHtml } from "@/lib/tenancy/tenancy-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const report = MOCK_INSPECTIONS.find((r) => r.id === id || r.leaseId === id);

    if (!report) {
      return NextResponse.json({ error: "Inspection report not found" }, { status: 404 });
    }

    const html = generateInspectionReportHtml(report);

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="routine-inspection-${id}.html"`,
      },
    });
  } catch (err) {
    console.error(`[Inspection Report API] Error for ${id}:`, err);
    return NextResponse.json({ error: "Failed to generate inspection report" }, { status: 500 });
  }
}
