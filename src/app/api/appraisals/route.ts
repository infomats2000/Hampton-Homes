import { NextRequest, NextResponse } from "next/server";

import { appraisalRequestSchema } from "@/lib/appraisals/appraisal-input";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, "appraisal-request", 5, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many appraisal requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const parsed = appraisalRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your appraisal details.", details: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;
  const result = await prisma.$transaction(async (tx) => {
    const lead = await tx.lead.create({
      data: {
        name: input.ownerName,
        email: input.ownerEmail.toLowerCase(),
        phone: input.ownerPhone,
        leadType: "APPRAISAL",
        status: "NEW",
        priority: input.sellingTimeframe === "IMMEDIATELY" ? "URGENT" : "HIGH",
        source: "WEBSITE_APPRAISAL",
        notes: `Appraisal requested for ${input.address}, ${input.suburb} ${input.state} ${input.postcode}.`,
        activities: {
          create: {
            actionType: "CREATED",
            description: "Property appraisal requested through the website",
            actorName: "Website",
          },
        },
      },
    });

    const appraisal = await tx.appraisalRequest.create({
      data: {
        leadId: lead.id,
        address: input.address,
        suburb: input.suburb,
        state: input.state.toUpperCase(),
        postcode: input.postcode,
        propertyType: input.propertyType,
        bedrooms: input.bedrooms,
        bathrooms: input.bathrooms,
        sellingTimeframe: input.sellingTimeframe,
      },
    });
    return { appraisalId: appraisal.id, leadId: lead.id };
  });

  return NextResponse.json({ success: true, ...result }, { status: 201 });
}
