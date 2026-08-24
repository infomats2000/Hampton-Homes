/**
 * AI Property Copy Generator API
 * POST /api/ai/generate-copy
 * Generates 4 copy variations (Editorial, Portal, Social Media, SMS Alert) using AI.
 * Body: { propertyId: string, tone?: AICopyTone }
 */

import { NextRequest, NextResponse } from "next/server";
import { getPropertyById } from "@/lib/properties/service";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";
import { generateAICopyForProperty, AICopyTone } from "@/lib/ai/copywriter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const propertyId = body.propertyId || "mri-vlt-1001";
    const tone: AICopyTone = body.tone || "LUXURY_PRESTIGE";

    const property = getPropertyById(propertyId) || MOCK_AUSTRALIAN_PROPERTIES.find((p) => p.externalId === propertyId) || MOCK_AUSTRALIAN_PROPERTIES[0];

    const copyResult = generateAICopyForProperty(property, tone);

    return NextResponse.json({
      success: true,
      copy: copyResult,
    });
  } catch (err) {
    console.error("[AI Copy API] Error:", err);
    return NextResponse.json({ error: "Failed to generate AI property copy" }, { status: 500 });
  }
}
