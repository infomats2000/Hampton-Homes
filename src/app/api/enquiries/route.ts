import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendEnquiryNotifications } from "@/lib/email/enquiry-notifications";

const enquirySchema = z.object({
  listingId: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(8).max(30),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(0).optional().default(""),
});

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, "property-enquiry", 5, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many enquiries. Please try again later." }, { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } });
  }

  const parsed = enquirySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check your enquiry details." }, { status: 400 });
  const input = parsed.data;

  const listing = await prisma.listing.findFirst({
    where: { id: input.listingId, publishedAt: { lte: new Date() }, status: { notIn: ["DRAFT", "WITHDRAWN", "OFF_MARKET"] } },
    include: { property: true, agents: { where: { isPrimary: true }, take: 1, include: { agent: { include: { user: true, office: true } } } } },
  });
  if (!listing) return NextResponse.json({ error: "This property is no longer accepting enquiries." }, { status: 404 });

  const assignment = listing.agents[0]?.agent;
  const lead = await prisma.$transaction(async (tx) => {
    const created = await tx.lead.create({
      data: {
        name: input.name, email: input.email.toLowerCase(), phone: input.phone,
        leadType: listing.listingType.includes("RENT") ? "TENANT" : "PROPERTY_ENQUIRY",
        status: assignment ? "ASSIGNED" : "NEW", priority: "HIGH", source: "WEBSITE_PROPERTY_ENQUIRY",
        notes: input.message, propertyId: listing.propertyId, agentId: assignment?.id, officeId: assignment?.officeId,
        activities: { create: [
          { actionType: "CREATED", description: "Property enquiry submitted through the website", actorName: "Website" },
          ...(assignment ? [{ actionType: "ASSIGNED", description: `Automatically assigned to ${assignment.user.firstName} ${assignment.user.lastName}`, actorName: "System" }] : []),
        ] },
      },
    });
    await tx.enquiry.create({ data: { listingId: listing.id, leadId: created.id, name: input.name, email: input.email.toLowerCase(), phone: input.phone, message: input.message } });
    return created;
  });

  const address = `${listing.property.streetNumber ?? ""} ${listing.property.streetName}, ${listing.property.suburb} ${listing.property.state}`.trim();
  const emailQueued = assignment ? await sendEnquiryNotifications({
    customerName: input.name, customerEmail: input.email, customerPhone: input.phone, message: input.message,
    propertyAddress: address, agentName: `${assignment.user.firstName} ${assignment.user.lastName}`, agentEmail: assignment.user.email,
  }) : false;

  return NextResponse.json({ success: true, leadId: lead.id, emailQueued }, { status: 201 });
}
