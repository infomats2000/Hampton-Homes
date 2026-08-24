/**
 * Agent Monthly Commission Statement API
 * GET /api/financial/commission-statement/[agentId]
 * Returns JSON or HTML monthly commission statement breakdown for an agent.
 */

import { NextRequest, NextResponse } from "next/server";
import { MOCK_COMMISSION_STATEMENTS } from "@/lib/financial/commission-calculator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;

  try {
    const statements = MOCK_COMMISSION_STATEMENTS.filter(
      (c) => c.agentId.toLowerCase() === agentId.toLowerCase() || agentId.toLowerCase() === "all"
    );

    const totalPayout = statements.reduce((acc, s) => acc + s.agentPayout, 0);
    const totalGst = statements.reduce((acc, s) => acc + s.gstAmount, 0);
    const totalGross = statements.reduce((acc, s) => acc + s.grossCommission, 0);

    return NextResponse.json({
      agentId,
      agentName: statements[0]?.agentName || "Agent",
      statementPeriod: "August 2026",
      statements,
      summary: {
        totalDealsCount: statements.length,
        totalGrossCommission: totalGross,
        totalGstAmount: totalGst,
        totalNetPayout: totalPayout,
      },
      generatedAt: new Date(),
    });
  } catch (err) {
    console.error(`[Commission Statement API] Error for agent ${agentId}:`, err);
    return NextResponse.json({ error: "Failed to generate commission statement" }, { status: 500 });
  }
}
