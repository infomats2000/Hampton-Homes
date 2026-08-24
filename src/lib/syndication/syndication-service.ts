/**
 * Portal Syndication Service
 * Master coordinator for REAXML generation, Domain Connect API push,
 * feed validation, and syndication status management.
 */

import { MOCK_AUSTRALIAN_PROPERTIES } from "../mri/mock-provider";
import { MRIRawProperty } from "../mri/provider.interface";
import { buildFullReaxmlFeed, buildSingleReaxmlListing } from "./reaxml-builder";
import { pushListingToDomain, DomainSyncResult } from "./domain-connect";
import { validateListingForSyndication, ValidationReport } from "./validator";

export interface PortalStatusItem {
  portalKey: "REA" | "DOMAIN" | "COMMERCIAL" | "VIEW";
  portalName: string;
  status: "LIVE" | "SYNCING" | "WARNING" | "FAILED" | "OFFLINE";
  lastSyncAt: Date;
  activeListingsCount: number;
  errorCount: number;
}

export interface ListingSyndicationRecord {
  propertyId: string;
  headline: string;
  streetAddress: string;
  suburb: string;
  listingType: string;
  status: string;
  priceDisplay: string;
  reaStatus: "LIVE" | "PENDING" | "FAILED" | "EXCLUDED";
  domainStatus: "LIVE" | "PENDING" | "FAILED" | "EXCLUDED";
  lastSyncedAt: Date;
  validationReport: ValidationReport;
}

export interface FullSyndicationSummary {
  portals: PortalStatusItem[];
  listings: ListingSyndicationRecord[];
  totalListingsCount: number;
  liveListingsCount: number;
  warningCount: number;
  lastGlobalSyncAt: Date;
}

/**
 * Returns current portal health and listing syndication matrix.
 */
export async function getSyndicationSummary(): Promise<FullSyndicationSummary> {
  const properties = MOCK_AUSTRALIAN_PROPERTIES;

  const listingsRecords: ListingSyndicationRecord[] = properties.map((p) => {
    const report = validateListingForSyndication(p);
    const reaStatus: ListingSyndicationRecord["reaStatus"] = report.isReady ? "LIVE" : "FAILED";
    const domainStatus: ListingSyndicationRecord["domainStatus"] = report.isReady ? "LIVE" : "FAILED";

    return {
      propertyId: p.externalId,
      headline: p.headline,
      streetAddress: `${p.streetNumber || ""} ${p.streetName}`.trim(),
      suburb: `${p.suburb} ${p.state}`,
      listingType: p.listingType,
      status: p.status,
      priceDisplay: p.priceDisplay,
      reaStatus,
      domainStatus,
      lastSyncedAt: new Date(Date.now() - Math.floor(Math.random() * 3600000 * 24)),
      validationReport: report,
    };
  });

  const totalListingsCount = listingsRecords.length;
  const liveListingsCount = listingsRecords.filter((l) => l.reaStatus === "LIVE" && l.domainStatus === "LIVE").length;
  const warningCount = listingsRecords.filter((l) => l.validationReport.issues.length > 0).length;

  const portals: PortalStatusItem[] = [
    {
      portalKey: "REA",
      portalName: "realestate.com.au (REA Group)",
      status: "LIVE",
      lastSyncAt: new Date(),
      activeListingsCount: liveListingsCount,
      errorCount: listingsRecords.filter((l) => l.reaStatus === "FAILED").length,
    },
    {
      portalKey: "DOMAIN",
      portalName: "Domain.com.au (Domain Connect API)",
      status: "LIVE",
      lastSyncAt: new Date(),
      activeListingsCount: liveListingsCount,
      errorCount: listingsRecords.filter((l) => l.domainStatus === "FAILED").length,
    },
    {
      portalKey: "COMMERCIAL",
      portalName: "CommercialRealEstate.com.au",
      status: "LIVE",
      lastSyncAt: new Date(),
      activeListingsCount: listingsRecords.filter((l) => l.listingType.startsWith("COMMERCIAL")).length,
      errorCount: 0,
    },
    {
      portalKey: "VIEW",
      portalName: "RealEstateView.com.au",
      status: "LIVE",
      lastSyncAt: new Date(),
      activeListingsCount: liveListingsCount,
      errorCount: 0,
    },
  ];

  return {
    portals,
    listings: listingsRecords,
    totalListingsCount,
    liveListingsCount,
    warningCount,
    lastGlobalSyncAt: new Date(),
  };
}

/**
 * Triggers full portal syndication sync for all or single listing.
 */
export async function runSyndicationPush(propertyId?: string): Promise<{
  pushedCount: number;
  results: Record<string, { domain: DomainSyncResult; reaxml: boolean }>;
}> {
  const targetProperties = propertyId
    ? MOCK_AUSTRALIAN_PROPERTIES.filter((p) => p.externalId === propertyId)
    : MOCK_AUSTRALIAN_PROPERTIES;

  const results: Record<string, { domain: DomainSyncResult; reaxml: boolean }> = {};

  for (const prop of targetProperties) {
    const domainRes = await pushListingToDomain(prop);
    const reaxmlSnippet = buildSingleReaxmlListing(prop);

    results[prop.externalId] = {
      domain: domainRes,
      reaxml: !!reaxmlSnippet,
    };
  }

  return {
    pushedCount: targetProperties.length,
    results,
  };
}

export { buildFullReaxmlFeed, buildSingleReaxmlListing, validateListingForSyndication };
