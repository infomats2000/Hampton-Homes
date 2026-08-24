/**
 * Active Leases & Renewal Alerts API
 * GET /api/tenancy/leases
 * Returns active lease ledger and lease renewal countdown alerts.
 */

import { NextRequest, NextResponse } from "next/server";
import { MOCK_LEASES, getTenancySummary } from "@/lib/tenancy/tenancy-service";

export async function GET(request: NextRequest) {
  try {
    const summary = getTenancySummary(MOCK_LEASES);

    return NextResponse.json({
      leases: MOCK_LEASES,
      summary,
      fetchedAt: new Date(),
    });
  } catch (err) {
    console.error("[Leases API] Error:", err);
    return NextResponse.json({ error: "Failed to fetch tenancy leases" }, { status: 500 });
  }
}
