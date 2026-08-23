/**
 * CoreLogic / RP Data Integration Provider
 * Licensed Australian property intelligence — sales history, valuations, comparable sales.
 * IMPORTANT: All data defaults to INTERNAL_ONLY visibility per CoreLogic licensing terms.
 * API docs: https://developer.corelogic.com.au
 */

import type { IntegrationProvider, ProviderHealthResult } from "../core/provider-registry";

export interface CoreLogicPropertySummary {
  propertyId: string;
  addressFull: string;
  suburb: string;
  state: string;
  postcode: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  landAreaSqm?: number;
  buildingAreaSqm?: number;
}

export interface CoreLogicValuation {
  estimatedValue: number;
  estimatedValueLow: number;
  estimatedValueHigh: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  valuationDate: string;
  rentalEstimate?: number;
  rentalYield?: number;
}

export interface CoreLogicSaleHistory {
  saleDate: string;
  salePrice: number;
  saleType: string; // AUCTION | PRIVATE_TREATY | EXPRESSIONS_OF_INTEREST
  daysOnMarket?: number;
  agencyName?: string;
}

export interface CoreLogicComparableSale {
  addressFull: string;
  suburb: string;
  saleDate: string;
  salePrice: number;
  bedrooms?: number;
  bathrooms?: number;
  landAreaSqm?: number;
  distanceKm?: number;
}

export interface CoreLogicPropertyReport {
  summary: CoreLogicPropertySummary;
  valuation?: CoreLogicValuation;
  saleHistory: CoreLogicSaleHistory[];
  comparableSales: CoreLogicComparableSale[];
  landValue?: number;
  zoning?: string;
  /** ALWAYS keep as INTERNAL_ONLY unless explicitly authorised */
  visibility: "INTERNAL_ONLY" | "AGENT_ONLY" | "MANAGEMENT_ONLY";
}

export class CoreLogicProvider implements IntegrationProvider {
  key = "CORELOGIC" as const;
  displayName = "CoreLogic / RP Data";
  description = "Licensed property intelligence & valuations";

  private clientId: string;
  private clientSecret: string;
  private baseUrl = "https://api.corelogic.com.au/sandbox/au/properties";
  private tokenUrl = "https://api.corelogic.com.au/access/oauth/token";
  private accessToken?: string;
  private tokenExpiresAt?: number;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt - 60_000) {
      return this.accessToken;
    }
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");
    const res = await fetch(this.tokenUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    if (!res.ok) throw new Error(`CoreLogic token error: ${res.status}`);
    const data = await res.json();
    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + data.expires_in * 1000;
    return this.accessToken!;
  }

  private async headers() {
    const token = await this.getAccessToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async healthCheck(): Promise<ProviderHealthResult> {
    const start = Date.now();
    try {
      await this.getAccessToken();
      return {
        provider: this.key,
        status: "CONNECTED",
        latencyMs: Date.now() - start,
        message: "OAuth token obtained successfully",
        checkedAt: new Date(),
      };
    } catch (err) {
      return {
        provider: this.key,
        status: "DISCONNECTED",
        latencyMs: Date.now() - start,
        message: err instanceof Error ? err.message : "Auth failed",
        checkedAt: new Date(),
      };
    }
  }

  /**
   * Look up a property by full address and retrieve property report.
   * IMPORTANT: Result must always default to INTERNAL_ONLY per licensing.
   */
  async getPropertyReport(addressFull: string): Promise<CoreLogicPropertyReport | null> {
    try {
      const headers = await this.headers();
      const searchRes = await fetch(
        `${this.baseUrl}/suggest?query=${encodeURIComponent(addressFull)}&limit=1`,
        { headers }
      );
      if (!searchRes.ok) return null;
      const searchData = await searchRes.json();
      const propertyId = searchData?.suggestions?.[0]?.propertyId;
      if (!propertyId) return null;

      const [summaryRes, valuationRes, salesRes, comparablesRes] = await Promise.all([
        fetch(`${this.baseUrl}/${propertyId}/summary`, { headers }),
        fetch(`${this.baseUrl}/${propertyId}/avm`, { headers }),
        fetch(`${this.baseUrl}/${propertyId}/sale-history`, { headers }),
        fetch(`${this.baseUrl}/${propertyId}/comparables`, { headers }),
      ]);

      const summary = summaryRes.ok ? await summaryRes.json() : null;
      const valuation = valuationRes.ok ? await valuationRes.json() : null;
      const salesData = salesRes.ok ? await salesRes.json() : null;
      const comparablesData = comparablesRes.ok ? await comparablesRes.json() : null;

      return {
        summary: {
          propertyId,
          addressFull,
          suburb: summary?.suburb ?? "",
          state: summary?.state ?? "",
          postcode: summary?.postcode ?? "",
          propertyType: summary?.propertyType ?? "Unknown",
          bedrooms: summary?.bedrooms,
          bathrooms: summary?.bathrooms,
          landAreaSqm: summary?.landAreaSqm,
          buildingAreaSqm: summary?.buildingAreaSqm,
        },
        valuation: valuation
          ? {
              estimatedValue: valuation.mid,
              estimatedValueLow: valuation.low,
              estimatedValueHigh: valuation.high,
              confidence: valuation.confidence ?? "MEDIUM",
              valuationDate: valuation.valuationDate ?? new Date().toISOString(),
              rentalEstimate: valuation.rentalMid,
              rentalYield: valuation.rentalYield,
            }
          : undefined,
        saleHistory: (salesData?.sales ?? []).map((s: Record<string, unknown>) => ({
          saleDate: s.saleDate as string,
          salePrice: s.price as number,
          saleType: s.saleType as string,
          daysOnMarket: s.daysOnMarket as number | undefined,
          agencyName: s.agencyName as string | undefined,
        })),
        comparableSales: (comparablesData?.comparables ?? []).map((c: Record<string, unknown>) => ({
          addressFull: c.address as string,
          suburb: c.suburb as string,
          saleDate: c.saleDate as string,
          salePrice: c.price as number,
          bedrooms: c.bedrooms as number | undefined,
          bathrooms: c.bathrooms as number | undefined,
          landAreaSqm: c.landAreaSqm as number | undefined,
          distanceKm: c.distanceKm as number | undefined,
        })),
        landValue: summary?.landValue,
        zoning: summary?.zoning,
        // Licensed data MUST default to INTERNAL_ONLY
        visibility: "INTERNAL_ONLY",
      };
    } catch {
      return null;
    }
  }
}
