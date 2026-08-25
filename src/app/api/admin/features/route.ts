import { NextRequest, NextResponse } from "next/server";
import {
  getSubscriptionConfig,
  updateSubscriptionConfig,
  TIER_PRESETS,
  TIER_QUOTAS,
  SubscriptionTier,
  getStaffSeatUsage,
} from "@/lib/features";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const [config, seatUsage] = await Promise.all([
      getSubscriptionConfig(),
      getStaffSeatUsage(),
    ]);
    return NextResponse.json({
      success: true,
      config,
      seatUsage,
      presets: TIER_PRESETS,
      quotaPresets: TIER_QUOTAS,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.roles.includes("SUPER_ADMIN")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Super Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { tier, clientName, clientStatus, expiryDate, features, quotas } = body;

    let updatedFeatures = features;
    let updatedQuotas = quotas;

    if (tier && TIER_PRESETS[tier as SubscriptionTier] && !features) {
      updatedFeatures = TIER_PRESETS[tier as SubscriptionTier];
    }
    if (tier && TIER_QUOTAS[tier as SubscriptionTier] && !quotas) {
      updatedQuotas = TIER_QUOTAS[tier as SubscriptionTier];
    }

    const updated = await updateSubscriptionConfig({
      tier,
      clientName,
      clientStatus,
      expiryDate,
      features: updatedFeatures,
      quotas: updatedQuotas,
    });

    const seatUsage = await getStaffSeatUsage();

    return NextResponse.json({ success: true, config: updated, seatUsage });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
