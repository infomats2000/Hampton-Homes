/**
 * Agent Daily Task Matrix API
 * GET /api/crm/daily-tasks
 * Returns agent daily task matrix and action list.
 */

import { NextRequest, NextResponse } from "next/server";
import { MOCK_AGENT_TASKS, getTaskMatrixSummary } from "@/lib/crm/task-matrix";

export async function GET(request: NextRequest) {
  try {
    const summary = getTaskMatrixSummary(MOCK_AGENT_TASKS);

    return NextResponse.json({
      tasks: MOCK_AGENT_TASKS,
      summary,
      fetchedAt: new Date(),
    });
  } catch (err) {
    console.error("[Daily Tasks API] Error:", err);
    return NextResponse.json({ error: "Failed to fetch daily tasks" }, { status: 500 });
  }
}
