/**
 * Portal Push Syndication API
 * POST /api/syndication/push
 * Triggers listing syndication push to Domain Connect API and REAXML feed generator.
 * Body (optional): { propertyId?: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { runSyndicationPush } from "@/lib/syndication/syndication-service";

export async function POST(request: NextRequest) {
  try {
    let body: { propertyId?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Empty body is acceptable — syncs all listings
    }

    const result = await runSyndicationPush(body.propertyId);

    return NextResponse.json({
      success: true,
      message: `Successfully pushed ${result.pushedCount} listing(s) to portals.`,
      pushedCount: result.pushedCount,
      details: result.results,
      syncedAt: new Date(),
    });
  } catch (err) {
    console.error("[Syndication Push API] Error:", err);
    return NextResponse.json({ error: "Failed to push listings to portals" }, { status: 500 });
  }
}
