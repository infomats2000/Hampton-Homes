import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSubscriptionConfig } from "@/lib/features";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const subscription = await getSubscriptionConfig();

    const res = NextResponse.json({
      success: true,
      user,
      subscription: user
        ? {
            tier: subscription.tier,
            clientName: subscription.clientName,
            clientStatus: subscription.clientStatus,
            features: user.roles.includes("SUPER_ADMIN")
              ? Object.keys(subscription.features).reduce(
                  (acc, k) => ({ ...acc, [k]: true }),
                  {} as typeof subscription.features
                )
              : subscription.features,
          }
        : null,
    });

    // Short private cache to eliminate UI header/navbar duplicate roundtrips
    res.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
