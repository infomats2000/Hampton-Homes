/**
 * PropertyMe Webhook Handler
 * POST /api/webhooks/propertyme
 * Receives managed property and tenancy sync events.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PROPERTYME_WEBHOOK_SECRET = process.env.PROPERTYME_WEBHOOK_SECRET ?? "";

function verifyPropertyMeSignature(body: string, signature: string): boolean {
  if (!PROPERTYME_WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", PROPERTYME_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-propertyme-signature") ?? "";

  const signatureValid = verifyPropertyMeSignature(body, signature);
  if (!signatureValid && PROPERTYME_WEBHOOK_SECRET) {
    console.warn("[PropertyMe Webhook] Invalid signature received");
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

  console.log(`[PropertyMe Webhook] Received: ${eventType} | ID: ${correlationId}`);

  try {
    switch (eventType) {
      case "tenancy.created":
      case "tenancy.updated":
        console.log(`[PropertyMe] Tenancy event: ${eventType}`);
        // TODO: Sync tenancy data to internal Lead/Contact
        break;

      case "property.created":
      case "property.updated":
        console.log(`[PropertyMe] Property sync event: ${eventType}`);
        // TODO: Update Property record from PropertyMe data
        break;

      case "tenancy.vacating":
      case "tenancy.vacated":
        console.log(`[PropertyMe] Tenant leaving: ${eventType}`);
        // TODO: Update tenancy status, create follow-up Lead
        break;

      case "inspection.scheduled":
      case "inspection.completed":
        console.log(`[PropertyMe] Inspection event: ${eventType}`);
        // TODO: Sync to Appointment model
        break;

      default:
        console.log(`[PropertyMe] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true, eventType, correlationId });
  } catch (err) {
    console.error("[PropertyMe Webhook] Processing error:", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
