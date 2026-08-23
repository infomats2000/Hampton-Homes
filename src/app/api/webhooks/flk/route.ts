/**
 * FLK it over Webhook Handler
 * POST /api/webhooks/flk
 * Receives document signature status updates and syncs Document model.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const FLK_WEBHOOK_SECRET = process.env.FLK_WEBHOOK_SECRET ?? "";

function verifyFlkSignature(body: string, signature: string): boolean {
  if (!FLK_WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", FLK_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-flk-signature") ?? "";

  const signatureValid = verifyFlkSignature(body, signature);
  if (!signatureValid && FLK_WEBHOOK_SECRET) {
    console.warn("[FLK Webhook] Invalid signature received");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = payload.event as string;
  const documentId = payload.documentId as string | undefined;
  const correlationId = payload.id as string | undefined;

  console.log(`[FLK Webhook] Received: ${eventType} | Doc: ${documentId}`);

  try {
    // Log webhook event
    // await prisma.webhookEvent.upsert({ ... })

    switch (eventType) {
      case "document.sent":
        console.log(`[FLK] Document sent: ${documentId}`);
        // TODO: Update Document.status = SENT, sentAt
        break;

      case "document.viewed":
        console.log(`[FLK] Document viewed: ${documentId}`);
        // TODO: Update Document.status = VIEWED, viewedAt
        break;

      case "document.signed":
        console.log(`[FLK] Document signed: ${documentId}`);
        // TODO: Update Document.status = SIGNED, signedAt
        break;

      case "document.completed":
        console.log(`[FLK] Document completed: ${documentId}`);
        // TODO: Update Document.status = COMPLETED, completedAt
        break;

      case "document.declined":
        console.log(`[FLK] Document declined: ${documentId}`);
        // TODO: Update Document.status = DECLINED
        break;

      case "document.expired":
        console.log(`[FLK] Document expired: ${documentId}`);
        // TODO: Update Document.status = EXPIRED
        break;

      default:
        console.log(`[FLK] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({
      received: true,
      eventType,
      correlationId,
    });
  } catch (err) {
    console.error("[FLK Webhook] Processing error:", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
