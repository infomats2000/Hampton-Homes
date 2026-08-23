/**
 * PropertyMe Integration Provider
 * Property management, tenancy records, lease information.
 * API docs: https://developer.propertyme.com
 */

import type { IntegrationProvider, ProviderHealthResult } from "../core/provider-registry";

export interface PropertyMeTenancy {
  id: string;
  propertyAddress: string;
  tenantName: string;
  tenantEmail?: string;
  tenantPhone?: string;
  leaseStart: string;
  leaseEnd: string;
  weeklyRent: number;
  bondAmount: number;
  status: "ACTIVE" | "VACATING" | "VACATED" | "PENDING";
  managerId?: string;
}

export interface PropertyMeProperty {
  id: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  carSpaces?: number;
  managingAgent?: string;
  ownerName?: string;
  ownerEmail?: string;
  weeklyRent?: number;
  currentTenancy?: PropertyMeTenancy;
}

export class PropertyMeProvider implements IntegrationProvider {
  key = "PROPERTYME" as const;
  displayName = "PropertyMe";
  description = "Property management & tenancy records";

  private apiKey: string;
  private agencyId: string;
  private baseUrl = "https://api.propertyme.com/v1";

  constructor(apiKey: string, agencyId: string) {
    this.apiKey = apiKey;
    this.agencyId = agencyId;
  }

  private headers() {
    return {
      "X-API-Key": this.apiKey,
      "X-Agency-Id": this.agencyId,
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
   * List managed properties
   */
  async listProperties(limit = 50, offset = 0): Promise<PropertyMeProperty[]> {
    const res = await fetch(
      `${this.baseUrl}/properties?limit=${limit}&offset=${offset}`,
      { headers: this.headers() }
    );
    if (!res.ok) throw new Error(`PropertyMe API error: ${res.status}`);
    const data = await res.json();
    return data.properties ?? [];
  }

  /**
   * Get a specific property by PropertyMe ID
   */
  async getProperty(propertyMeId: string): Promise<PropertyMeProperty> {
    const res = await fetch(`${this.baseUrl}/properties/${propertyMeId}`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`PropertyMe API error: ${res.status}`);
    return res.json();
  }

  /**
   * List active tenancies
   */
  async listTenancies(status?: string): Promise<PropertyMeTenancy[]> {
    const params = status ? `?status=${status}` : "";
    const res = await fetch(`${this.baseUrl}/tenancies${params}`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`PropertyMe API error: ${res.status}`);
    const data = await res.json();
    return data.tenancies ?? [];
  }

  /**
   * Get a specific tenancy record
   */
  async getTenancy(tenancyId: string): Promise<PropertyMeTenancy> {
    const res = await fetch(`${this.baseUrl}/tenancies/${tenancyId}`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`PropertyMe API error: ${res.status}`);
    return res.json();
  }

  /**
   * Convert a PropertyMe tenancy tenant to an internal Lead payload
   */
  tenancyToLead(tenancy: PropertyMeTenancy) {
    return {
      name: tenancy.tenantName,
      email: tenancy.tenantEmail ?? "",
      phone: tenancy.tenantPhone ?? "",
      leadType: "TENANT" as const,
      status: "NEW" as const,
      source: "PROPERTYME",
      notes: `PropertyMe tenancy at ${tenancy.propertyAddress}. Lease: ${tenancy.leaseStart} – ${tenancy.leaseEnd}. Weekly rent: $${tenancy.weeklyRent}.`,
    };
  }
}
