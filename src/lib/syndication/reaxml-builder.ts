/**
 * REAXML v2 Feed Builder
 * Compliant with REA Group (realestate.com.au), CommercialRealEstate,
 * and RealEstateView XML specifications.
 *
 * Spec reference: https://xml.realestate.com.au/
 */

import { MRIRawProperty } from "../mri/provider.interface";
import { AGENCY_NAME, AGENCY_EMAIL, AGENCY_PHONE } from "../agency-config";

export interface REAXMLOptions {
  agentId?: string;
  agencyName?: string;
  senderEmail?: string;
}

/**
 * Escapes special XML characters to prevent invalid markup.
 */
function escapeXml(str: string | undefined | null): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Maps internal property status to REAXML status attribute.
 */
function mapReaStatus(status: string): string {
  switch (status.toUpperCase()) {
    case "FOR_SALE":
    case "FOR_RENT":
    case "COMING_SOON":
    case "AUCTION":
      return "current";
    case "UNDER_OFFER":
    case "UNDER_CONTRACT":
      return "underOffer";
    case "SOLD":
      return "sold";
    case "LEASED":
      return "leased";
    case "WITHDRAWN":
    case "OFF_MARKET":
      return "withdrawn";
    default:
      return "current";
  }
}

/**
 * Maps internal property type to REAXML property category element.
 */
function mapReaCategory(propertyType: string): string {
  const t = propertyType.toLowerCase();
  if (t.includes("house")) return "House";
  if (t.includes("apartment") || t.includes("unit") || t.includes("flat")) return "Unit";
  if (t.includes("townhouse")) return "Townhouse";
  if (t.includes("villa")) return "Villa";
  if (t.includes("land")) return "Land";
  if (t.includes("commercial") || t.includes("office") || t.includes("retail")) return "Commercial";
  return "House";
}

/**
 * Builds a single <residential> or <commercial> REAXML element.
 */
export function buildSingleReaxmlListing(property: MRIRawProperty, options: REAXMLOptions = {}): string {
  const reaStatus = mapReaStatus(property.status);
  const category = mapReaCategory(property.propertyType);
  const isSale = property.listingType === "RESIDENTIAL_SALE" || property.listingType === "COMMERCIAL_SALE";
  const isCommercial = property.listingType.startsWith("COMMERCIAL");

  const agentId = options.agentId || process.env.REA_AGENT_ID || "AGY-AU-1001";
  const uniqueId = `PROP-${property.externalId}`;

  const imageXml = property.photos
    .map((url, idx) => `      <img id="${idx + 1}" format="jpg" url="${escapeXml(url)}" />`)
    .join("\n");

  const inspectionXml = property.inspections && property.inspections.length > 0
    ? `    <inspectionTimes>\n` +
      property.inspections
        .map((t) => `      <inspection>${escapeXml(t.startTime)} to ${escapeXml(t.endTime)}</inspection>`)
        .join("\n") +
      `\n    </inspectionTimes>`
    : "";

  if (isCommercial) {
    return `  <commercial status="${reaStatus}">
    <agentID>${escapeXml(agentId)}</agentID>
    <uniqueID>${escapeXml(uniqueId)}</uniqueID>
    <commercialCategory>${escapeXml(category)}</commercialCategory>
    <headline>${escapeXml(property.headline)}</headline>
    <description>${escapeXml(property.description)}</description>
    <address display="full">
      <suburb state="${escapeXml(property.state)}">${escapeXml(property.suburb)}</suburb>
      <postcode>${escapeXml(property.postcode)}</postcode>
      <streetNumber>${escapeXml(property.streetNumber)}</streetNumber>
      <street>${escapeXml(property.streetName)}</street>
    </address>
    <priceView>${escapeXml(property.priceDisplay)}</priceView>
    <price>${property.priceNumeric || 0}</price>
    <buildingArea unit="squareMetres">${property.buildingAreaSqm || 0}</buildingArea>
    <objects>
${imageXml}
    </objects>
  </commercial>`;
  }

  return `  <residential status="${reaStatus}">
    <agentID>${escapeXml(agentId)}</agentID>
    <uniqueID>${escapeXml(uniqueId)}</uniqueID>
    <residentialCategory>${escapeXml(category)}</residentialCategory>
    <headline>${escapeXml(property.headline)}</headline>
    <description>${escapeXml(property.description)}</description>
    <address display="full">
      <suburb state="${escapeXml(property.state)}">${escapeXml(property.suburb)}</suburb>
      <postcode>${escapeXml(property.postcode)}</postcode>
      <streetNumber>${escapeXml(property.streetNumber)}</streetNumber>
      <street>${escapeXml(property.streetName)}</street>
    </address>
    <priceView>${escapeXml(property.priceDisplay)}</priceView>
    <price>${property.priceNumeric || 0}</price>
    <features>
      <bedrooms>${property.bedrooms || 0}</bedrooms>
      <bathrooms>${property.bathrooms || 0}</bathrooms>
      <carspaces>${property.carSpaces || 0}</carspaces>
      <landArea unit="squareMetres">${property.landAreaSqm || 0}</landArea>
    </features>
${inspectionXml}
    <listingAgent>
      <name>${escapeXml(property.primaryAgentName)}</name>
      <email>${escapeXml(property.primaryAgentEmail || AGENCY_EMAIL)}</email>
      <telephone>${escapeXml(AGENCY_PHONE)}</telephone>
    </listingAgent>
    <objects>
${imageXml}
    </objects>
  </residential>`;
}

/**
 * Builds a complete REAXML v2 document containing multiple listings.
 */
export function buildFullReaxmlFeed(properties: MRIRawProperty[], options: REAXMLOptions = {}): string {
  const listingsXml = properties.map((p) => buildSingleReaxmlListing(p, options)).join("\n\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE propertyList SYSTEM "http://www.realestate.com.au/dtd/propertyList.dtd">
<propertyList date="${new Date().toISOString()}">
<!-- Generated by ${escapeXml(AGENCY_NAME)} Portal Syndication Engine -->
${listingsXml}
</propertyList>`;
}
