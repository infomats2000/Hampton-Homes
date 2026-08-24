/**
 * Feed Readiness Validation API
 * GET /api/syndication/validate/[id]
 * Audits a listing against REA Group and Domain portal rules before sending.
 */

import { NextRequest, NextResponse } from "next/server";
import { getPropertyById } from "@/lib/properties/service";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";
import { validateListingForSyndication } from "@/lib/syndication/validator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const property = getPropertyById(id) || MOCK_AUSTRALIAN_PROPERTIES.find((p) => p.externalId === id);

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const report = validateListingForSyndication(property);
    return NextResponse.json(report);
  } catch (err) {
    console.error(`[Validation API] Error for property ${id}:`, err);
    return NextResponse.json({ error: "Failed to audit property feed" }, { status: 500 });
  }
}
