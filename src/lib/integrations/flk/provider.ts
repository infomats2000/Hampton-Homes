/**
 * FLK it over Integration Provider
 * Digital agreements, leasing/sales contracts, e-signatures, document status.
 * API docs: https://flkitover.com/api
 */

import type { IntegrationProvider, ProviderHealthResult } from "../core/provider-registry";

export type FlkDocumentStatus =
  | "DRAFT"
  | "SENT"
  | "VIEWED"
  | "SIGNED"
  | "COMPLETED"
  | "DECLINED"
  | "EXPIRED";

export interface FlkDocument {
  id: string;
  type: string; // LEASE | SALES_CONTRACT | MANAGEMENT_AGREEMENT | OTHER
  title: string;
  status: FlkDocumentStatus;
  signerName: string;
  signerEmail: string;
  agentName?: string;
  agentEmail?: string;
  propertyAddress?: string;
  viewUrl?: string;
  sentAt?: string;
  viewedAt?: string;
  signedAt?: string;
  completedAt?: string;
  expiresAt?: string;
}

export interface FlkCreateDocumentPayload {
  type: string;
  title: string;
  signerName: string;
  signerEmail: string;
  agentName?: string;
  agentEmail?: string;
  propertyAddress?: string;
  templateId?: string;
  expiryDays?: number;
}

export class FlkProvider implements IntegrationProvider {
  key = "FLK" as const;
  displayName = "FLK it over";
  description = "Digital agreements, leasing & e-signatures";

  private apiKey: string;
  private baseUrl = "https://api.flkitover.com/v2";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private headers() {
    return {
      "X-API-Key": this.apiKey,
      "Content-Type": "application/json",
    };
  }

  async healthCheck(): Promise<ProviderHealthResult> {
    const start = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}/status`, {
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
   * List all documents for the agency
   */
  async listDocuments(filters?: {
    status?: FlkDocumentStatus;
    limit?: number;
    offset?: number;
  }): Promise<FlkDocument[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.limit) params.set("limit", String(filters.limit));
    if (filters?.offset) params.set("offset", String(filters.offset));

    const res = await fetch(`${this.baseUrl}/documents?${params}`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`FLK API error: ${res.status}`);
    const data = await res.json();
    return data.documents ?? [];
  }

  /**
   * Create a new digital document/agreement
   */
  async createDocument(payload: FlkCreateDocumentPayload): Promise<FlkDocument> {
    const res = await fetch(`${this.baseUrl}/documents`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`FLK document creation failed: ${res.status}`);
    return res.json();
  }

  /**
   * Get a single document by FLK ID
   */
  async getDocument(flkDocumentId: string): Promise<FlkDocument> {
    const res = await fetch(`${this.baseUrl}/documents/${flkDocumentId}`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`FLK API error: ${res.status}`);
    return res.json();
  }

  /**
   * Send/resend a document to the signer
   */
  async sendDocument(flkDocumentId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${this.baseUrl}/documents/${flkDocumentId}/send`, {
      method: "POST",
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`FLK send failed: ${res.status}`);
    return res.json();
  }

  /**
   * Void/cancel an active document
   */
  async voidDocument(flkDocumentId: string, reason?: string): Promise<{ success: boolean }> {
    const res = await fetch(`${this.baseUrl}/documents/${flkDocumentId}/void`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error(`FLK void failed: ${res.status}`);
    return res.json();
  }
}
