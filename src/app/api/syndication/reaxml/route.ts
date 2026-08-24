/**
 * REAXML Agency Feed Export API
 * GET /api/syndication/reaxml
 * Serves the full agency REAXML v2 feed for REA Group SFTP / automated scrapers.
 */

import { NextRequest, NextResponse } from "next/server";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";
import { buildFullReaxmlFeed } from "@/lib/syndication/reaxml-builder";

export async function GET(request: NextRequest) {
  try {
    const xml = buildFullReaxmlFeed(MOCK_AUSTRALIAN_PROPERTIES);

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Content-Disposition": 'inline; filename="reaxml-feed.xml"',
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch (err) {
    console.error("[REAXML Feed API] Error generating XML:", err);
    return NextResponse.json({ error: "Failed to generate REAXML feed" }, { status: 500 });
  }
}
