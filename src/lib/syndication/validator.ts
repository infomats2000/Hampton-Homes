/**
 * Portal Syndication Feed Validator
 * Audits property listings against REA Group & Domain schema requirements
 * to prevent portal rejection before sending.
 */

import { MRIRawProperty } from "../mri/provider.interface";

export type ValidationSeverity = "ERROR" | "WARNING" | "INFO";

export interface ValidationIssue {
  portal: "REA" | "DOMAIN" | "BOTH";
  field: string;
  message: string;
  severity: ValidationSeverity;
}

export interface ValidationReport {
  propertyId: string;
  headline: string;
  isReady: boolean;
  score: number; // 0 - 100 readiness score
  issues: ValidationIssue[];
  auditedAt: Date;
}

export function validateListingForSyndication(property: MRIRawProperty): ValidationReport {
  const issues: ValidationIssue[] = [];

  // 1. Mandatory Fields (Errors)
  if (!property.headline || property.headline.trim().length < 5) {
    issues.push({
      portal: "BOTH",
      field: "headline",
      message: "Headline is required and must be at least 5 characters.",
      severity: "ERROR",
    });
  }

  if (property.headline && property.headline.length > 100) {
    issues.push({
      portal: "REA",
      field: "headline",
      message: "Headline exceeds REA limit of 100 characters.",
      severity: "WARNING",
    });
  }

  if (!property.description || property.description.trim().length < 20) {
    issues.push({
      portal: "BOTH",
      field: "description",
      message: "Description must be at least 20 characters.",
      severity: "ERROR",
    });
  }

  if (!property.photos || property.photos.length === 0) {
    issues.push({
      portal: "BOTH",
      field: "photos",
      message: "At least 1 property photo is required for portal publishing.",
      severity: "ERROR",
    });
  }

  if (property.photos && property.photos.length < 3) {
    issues.push({
      portal: "BOTH",
      field: "photos",
      message: "Recommended to have at least 3 photos for optimal buyer engagement.",
      severity: "WARNING",
    });
  }

  if (!property.priceDisplay || property.priceDisplay.trim().length === 0) {
    issues.push({
      portal: "BOTH",
      field: "priceDisplay",
      message: "Price display text is required.",
      severity: "ERROR",
    });
  }

  if (!property.priceNumeric || property.priceNumeric <= 0) {
    issues.push({
      portal: "DOMAIN",
      field: "priceNumeric",
      message: "Domain API requires a numeric price value for search indexing.",
      severity: "WARNING",
    });
  }

  if (!property.suburb || !property.postcode || !property.streetName) {
    issues.push({
      portal: "BOTH",
      field: "address",
      message: "Street name, suburb, and postcode are all mandatory.",
      severity: "ERROR",
    });
  }

  // 2. Floorplan & Video Recommendations (Warnings)
  const hasFloorplan = property.photos.some((url) => url.toLowerCase().includes("floorplan"));
  if (!hasFloorplan) {
    issues.push({
      portal: "REA",
      field: "floorplan",
      message: "No floorplan object found. Listings with floorplans get 40% more enquiry.",
      severity: "INFO",
    });
  }

  // 3. Agent Info
  if (!property.primaryAgentName) {
    issues.push({
      portal: "BOTH",
      field: "primaryAgentName",
      message: "Primary agent name is required.",
      severity: "ERROR",
    });
  }

  if (!property.primaryAgentEmail) {
    issues.push({
      portal: "BOTH",
      field: "primaryAgentEmail",
      message: "Primary agent email is required for enquiry forwarding.",
      severity: "WARNING",
    });
  }

  // Calculate readiness score
  const errorCount = issues.filter((i) => i.severity === "ERROR").length;
  const warningCount = issues.filter((i) => i.severity === "WARNING").length;

  const score = Math.max(0, 100 - errorCount * 30 - warningCount * 10);
  const isReady = errorCount === 0;

  return {
    propertyId: property.externalId,
    headline: property.headline,
    isReady,
    score,
    issues,
    auditedAt: new Date(),
  };
}
