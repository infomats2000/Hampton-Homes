/**
 * Single Listing REAXML Snippet Export API
 * GET /api/syndication/reaxml/[id]
 * Returns REAXML v2 representation for a single property ID.
 */

import { NextRequest, NextResponse } from "next/server";
import { getPropertyById } from "@/lib/properties/service";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";
import { buildSingleReaxmlListing } from "@/lib/syndication/reaxml-builder";

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

    const xmlSnippet = buildSingleReaxmlListing(property);
    const fullDoc = `<?xml version="1.0" encoding="UTF-8"?>\n<propertyList date="${new Date().toISOString()}">\n${xmlSnippet}\n</propertyList>`;

    return new NextResponse(fullDoc, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Content-Disposition": `inline; filename="reaxml-${id}.xml"`,
      },
    });
  } catch (err) {
    console.error(`[REAXML Single API] Error for property ${id}:`, err);
    return NextResponse.json({ error: "Failed to generate REAXML snippet" }, { status: 500 });
  }
}
