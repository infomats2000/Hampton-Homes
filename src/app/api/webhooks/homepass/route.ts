/**
 * Homepass Webhook Handler
 * POST /api/webhooks/homepass
 * Receives visitor check-in events, verifies HMAC signature, and creates/updates leads.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const HOMEPASS_WEBHOOK_SECRET = process.env.HOMEPASS_WEBHOOK_SECRET ?? "";

function verifyHomepassSignature(body: string, signature: string): boolean {
  if (!HOMEPASS_WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", HOMEPASS_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(`sha256=${expected}`),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!HOMEPASS_WEBHOOK_SECRET) {
    console.error("[Homepass Webhook] HOMEPASS_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("x-homepass-signature") ?? "";

  const signatureValid = verifyHomepassSignature(body, signature);
  if (!signatureValid) {
    console.warn("[Homepass Webhook] Invalid signature received");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = payload.event as string;
  const correlationId = payload.id as string | undefined;

  console.log(`[Homepass Webhook] Received: ${eventType} | ID: ${correlationId}`);

  try {
    // Log webhook event to database (when Prisma client is available)
    // await prisma.webhookEvent.upsert({
    //   where: { correlationId: correlationId ?? "no-id" },
    //   create: { provider: "HOMEPASS", eventType, status: "RECEIVED", correlationId, signatureValid, rawPayload: payload },
    //   update: { status: "RECEIVED", rawPayload: payload },
    // });

    switch (eventType) {
      case "visitor.checkin":
      case "visitor.registered": {
        const visitor = payload.visitor as Record<string, unknown> | undefined;
        const property = payload.property as Record<string, unknown> | undefined;
        console.log(
          `[Homepass] Check-in: ${visitor?.firstName} ${visitor?.lastName} at ${property?.address}`
        );
        // TODO: Create Lead from visitor data using HomepassProvider.visitorToLead()
        break;
      }
      case "open_home.created":
      case "open_home.updated": {
        console.log(`[Homepass] Open home event: ${eventType}`);
        // TODO: Sync to Appointment model
        break;
      }
      default:
        console.log(`[Homepass] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true, eventType });
  } catch (err) {
    console.error("[Homepass Webhook] Processing error:", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
