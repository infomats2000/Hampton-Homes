import { NextResponse } from "next/server";
import { triggerXeroBatchSync, MOCK_XERO_STATUS } from "@/lib/integrations/xero/xero-service";

export async function POST() {
  try {
    const result = await triggerXeroBatchSync();
    return NextResponse.json({
      success: true,
      message: "Automated Xero 2-way batch sync executed successfully.",
      status: MOCK_XERO_STATUS,
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to execute Xero sync.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
