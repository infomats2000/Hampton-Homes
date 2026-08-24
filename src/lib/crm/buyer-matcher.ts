/**
 * Smart Buyer-Property Matching Algorithm
 * Matches new property listings against buyer search criteria (budget, suburbs, bedrooms)
 * and calculates a Buyer Match Score (0 - 100%).
 */

import { MRIRawProperty } from "../mri/provider.interface";
import { MOCK_AUSTRALIAN_PROPERTIES } from "../mri/mock-provider";

export interface BuyerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  maxBudget: number;
  minBedrooms: number;
  preferredSuburbs: string[];
  preferredTypes: string[];
  buyerIntent: "HOT_BUYER" | "WARM_BUYER" | "CASUAL_LOOKER";
  preApprovedFinance: boolean;
}

export interface BuyerMatchResult {
  buyer: BuyerProfile;
  matchScore: number; // 0 - 100%
  matchReasons: string[];
  isHotMatch: boolean;
}

export const MOCK_BUYERS: BuyerProfile[] = [
  {
    id: "buyer-101",
    name: "David Miller",
    email: "david.miller@example.com.au",
    phone: "0411 222 333",
    maxBudget: 1600000,
    minBedrooms: 3,
    preferredSuburbs: ["Parramatta", "Harris Park", "Westmead"],
    preferredTypes: ["House", "Townhouse"],
    buyerIntent: "HOT_BUYER",
    preApprovedFinance: true,
  },
  {
    id: "buyer-102",
    name: "Sophie Zhang",
    email: "sophie.zhang@example.com.au",
    phone: "0422 333 444",
    maxBudget: 3000000,
    minBedrooms: 2,
    preferredSuburbs: ["Bondi Beach", "Mosman", "Double Bay"],
    preferredTypes: ["Apartment", "House"],
    buyerIntent: "HOT_BUYER",
    preApprovedFinance: true,
  },
  {
    id: "buyer-103",
    name: "Robert Taylor",
    email: "robert.t@example.com.au",
    phone: "0433 444 555",
    maxBudget: 2200000,
    minBedrooms: 3,
    preferredSuburbs: ["Manly", "Freshwater", "Fairlight"],
    preferredTypes: ["House", "Townhouse", "Villa"],
    buyerIntent: "WARM_BUYER",
    preApprovedFinance: false,
  },
  {
    id: "buyer-104",
    name: "Harrison Vance",
    email: "harrison.vance@example.com.au",
    phone: "0499 888 777",
    maxBudget: 9000000,
    minBedrooms: 4,
    preferredSuburbs: ["Mosman", "Bellevue Hill", "Vaucluse"],
    preferredTypes: ["House", "Villa"],
    buyerIntent: "HOT_BUYER",
    preApprovedFinance: true,
  },
];

/**
 * Calculates match score between a buyer profile and a property listing.
 */
export function matchBuyerToProperty(buyer: BuyerProfile, property: MRIRawProperty): BuyerMatchResult {
  let score = 0;
  const matchReasons: string[] = [];

  // 1. Suburb Match (35 points)
  const suburbMatch = buyer.preferredSuburbs.some(
    (s) => s.toLowerCase() === property.suburb.toLowerCase()
  );
  if (suburbMatch) {
    score += 35;
    matchReasons.push(`Suburb match (${property.suburb})`);
  }

  // 2. Budget Match (30 points)
  if (property.priceNumeric <= buyer.maxBudget) {
    score += 30;
    matchReasons.push(`Within max budget ($${property.priceNumeric.toLocaleString()} <= $${buyer.maxBudget.toLocaleString()})`);
  } else if (property.priceNumeric <= buyer.maxBudget * 1.1) {
    score += 15;
    matchReasons.push("Within 10% budget stretch range");
  }

  // 3. Bedroom Match (20 points)
  if (property.bedrooms >= buyer.minBedrooms) {
    score += 20;
    matchReasons.push(`Bedrooms meet minimum (${property.bedrooms} >= ${buyer.minBedrooms})`);
  }

  // 4. Pre-approved Finance Bonus (15 points)
  if (buyer.preApprovedFinance) {
    score += 15;
    matchReasons.push("Pre-approved finance confirmed");
  }

  const finalScore = Math.min(100, score);
  const isHotMatch = finalScore >= 75 && buyer.buyerIntent === "HOT_BUYER";

  return {
    buyer,
    matchScore: finalScore,
    matchReasons,
    isHotMatch,
  };
}

/**
 * Returns all buyer matches for a property, sorted by match score.
 */
export function getTopBuyerMatchesForProperty(propertyId: string): BuyerMatchResult[] {
  const property = MOCK_AUSTRALIAN_PROPERTIES.find((p) => p.externalId === propertyId) || MOCK_AUSTRALIAN_PROPERTIES[0];

  return MOCK_BUYERS.map((buyer) => matchBuyerToProperty(buyer, property)).sort(
    (a, b) => b.matchScore - a.matchScore
  );
}
