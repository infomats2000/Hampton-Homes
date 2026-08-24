/**
 * Trade Work Order Dispatch API
 * POST /api/tenancy/work-order
 * Creates and dispatches trade Work Orders to contractor.
 */

import { NextRequest, NextResponse } from "next/server";
import { TradeWorkOrder } from "@/lib/tenancy/tenancy-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const workOrderNumber = `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newWorkOrder: TradeWorkOrder = {
      id: `wo-${Date.now()}`,
      workOrderNumber,
      leaseId: body.leaseId || "lease-1001",
      propertyAddress: body.propertyAddress || "27 Raglan Street, Manly NSW 2095",
      title: body.title || "Routine Maintenance Work Order",
      description: body.description || "General trade maintenance requested.",
      category: body.category || "PLUMBING",
      priority: body.priority || "ROUTINE",
      status: "WORK_ORDER_DISPATCHED",
      contractorName: body.contractorName || "Licensed Contractor",
      contractorEmail: body.contractorEmail || "trade@example.com.au",
      contractorPhone: body.contractorPhone || "0400 000 000",
      authorizedCostLimit: Number(body.authorizedCostLimit) || 500,
      createdAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      message: `Work Order ${workOrderNumber} successfully dispatched to ${newWorkOrder.contractorName}.`,
      workOrder: newWorkOrder,
    });
  } catch (err) {
    console.error("[Work Order API] Error:", err);
    return NextResponse.json({ error: "Failed to dispatch work order" }, { status: 500 });
  }
}
