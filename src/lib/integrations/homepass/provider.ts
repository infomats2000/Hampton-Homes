/**
 * Homepass Integration Provider
 * Open home check-in, visitor registration, prospect capture & MRI lead push.
 * API docs: https://developers.homepass.com.au
 */

import type { IntegrationProvider, ProviderHealthResult } from "../core/provider-registry";

interface HomepassVisitor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  interestedIn?: string;
  registeredAt: string;
}

interface HomepassOpenHome {
  id: string;
  propertyAddress: string;
  startTime: string;
  endTime: string;
  agentId?: string;
  visitors: HomepassVisitor[];
}

export class HomepassProvider implements IntegrationProvider {
  key = "HOMEPASS" as const;
  displayName = "Homepass";
  description = "Open home check-in & visitor registration";

  private apiKey: string;
  private baseUrl = "https://api.homepass.com.au/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  async healthCheck(): Promise<ProviderHealthResult> {
    const start = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}/health`, {
        headers: this.headers(),
        signal: AbortSignal.timeout(5000),
      });
      const latencyMs = Date.now() - start;
      return {
        provider: this.key,
        status: res.ok ? "CONNECTED" : "DEGRADED",
        latencyMs,
        message: res.ok ? "API reachable" : `HTTP ${res.status}`,
        checkedAt: new Date(),
      };
    } catch (err) {
      return {
        provider: this.key,
        status: "DISCONNECTED",
        latencyMs: Date.now() - start,
        message: err instanceof Error ? err.message : "Unknown error",
        checkedAt: new Date(),
      };
    }
  }

  /**
   * Fetch all visitors for a given open home event
   */
  async getOpenHomeVisitors(eventId: string): Promise<HomepassVisitor[]> {
    const res = await fetch(`${this.baseUrl}/open-homes/${eventId}/visitors`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`Homepass API error: ${res.status}`);
    const data = await res.json();
    return data.visitors ?? [];
  }

  /**
   * Register a new visitor for an open home event
   */
  async registerVisitor(
    eventId: string,
    visitor: Omit<HomepassVisitor, "id" | "registeredAt">
  ): Promise<HomepassVisitor> {
    const res = await fetch(`${this.baseUrl}/open-homes/${eventId}/visitors`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(visitor),
    });
    if (!res.ok) throw new Error(`Homepass visitor registration failed: ${res.status}`);
    return res.json();
  }

  /**
   * Convert a Homepass visitor to an internal Lead payload
   */
  visitorToLead(visitor: HomepassVisitor, propertyAddress: string) {
    return {
      name: `${visitor.firstName} ${visitor.lastName}`,
      email: visitor.email,
      phone: visitor.phone ?? "",
      leadType: "INSPECTION" as const,
      status: "NEW" as const,
      source: "HOMEPASS",
      notes: `Open home visitor at ${propertyAddress}. Registered: ${visitor.registeredAt}${visitor.interestedIn ? `. Interest: ${visitor.interestedIn}` : ""}`,
    };
  }
}
