/**
 * Smart Buyer-Property Matches API
 * GET /api/crm/buyer-matches/[propertyId]
 * Returns ranked buyer matches for a property listing.
 */

import { NextRequest, NextResponse } from "next/server";
import { getTopBuyerMatchesForProperty } from "@/lib/crm/buyer-matcher";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;

  try {
    const matches = getTopBuyerMatchesForProperty(propertyId);

    return NextResponse.json({
      propertyId,
      matchesCount: matches.length,
      hotMatchesCount: matches.filter((m) => m.isHotMatch).length,
      matches,
      fetchedAt: new Date(),
    });
  } catch (err) {
    console.error(`[Buyer Matches API] Error for ${propertyId}:`, err);
    return NextResponse.json({ error: "Failed to compute buyer matches" }, { status: 500 });
  }
}
