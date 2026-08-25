import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSubscriptionConfig } from "@/lib/features";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const subscription = await getSubscriptionConfig();

    return NextResponse.json({
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
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
