import { NextRequest, NextResponse } from "next/server";
import { getSubscriptionConfig, updateSubscriptionConfig, TIER_PRESETS, SubscriptionTier } from "@/lib/features";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const config = await getSubscriptionConfig();
    return NextResponse.json({ success: true, config, presets: TIER_PRESETS });
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
    const { tier, clientName, clientStatus, expiryDate, features } = body;

    let updatedFeatures = features;
    if (tier && TIER_PRESETS[tier as SubscriptionTier] && !features) {
      updatedFeatures = TIER_PRESETS[tier as SubscriptionTier];
    }

    const updated = await updateSubscriptionConfig({
      tier,
      clientName,
      clientStatus,
      expiryDate,
      features: updatedFeatures,
    });

    return NextResponse.json({ success: true, config: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
