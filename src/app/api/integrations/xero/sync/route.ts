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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to execute Xero sync." },
      { status: 500 }
    );
  }
}
