/**
 * Statutory Trust Receipt Download API
 * GET /api/financial/trust-receipt/[id]
 * Serves statutory HTML/Text Trust Receipt for printing or PDF save.
 */

import { NextRequest, NextResponse } from "next/server";
import { MOCK_TRUST_RECEIPTS, generateStatutoryTrustReceiptHtml } from "@/lib/financial/trust-accounting";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const receipt = MOCK_TRUST_RECEIPTS.find((r) => r.id === id || r.receiptNumber.toLowerCase() === id.toLowerCase());

    if (!receipt) {
      return NextResponse.json({ error: "Trust receipt not found" }, { status: 404 });
    }

    const html = generateStatutoryTrustReceiptHtml(receipt);

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="trust-receipt-${receipt.receiptNumber}.html"`,
      },
    });
  } catch (err) {
    console.error(`[Trust Receipt API] Error for receipt ${id}:`, err);
    return NextResponse.json({ error: "Failed to generate trust receipt" }, { status: 500 });
  }
}
