/**
 * AI Real Estate Copywriting Engine
 * Generates tailored Australian property listing copy across multiple formats
 * (Prestige Editorial, Portal Summary, Social Media Caption, SMS Alert).
 */

import { MRIRawProperty } from "../mri/provider.interface";
import { AGENCY_NAME } from "../agency-config";

export interface AICopyResult {
  propertyId: string;
  headline: string;
  editorialCopy: string;      // Long-form brochure & web description
  portalSummaryCopy: string;  // Bullet-point & punchy summary for REA/Domain
  socialMediaCaption: string; // Instagram/Facebook post with emojis & hashtags
  smsBuyerAlert: string;      // Short 160-char SMS alert for hot buyer matching
  generatedAt: Date;
}

export type AICopyTone = "LUXURY_PRESTIGE" | "EMOTIONAL_FAMILY" | "INVESTOR_YIELD" | "MODERN_MINIMALIST";

/**
 * Generates AI copy variations based on property features and selected tone.
 */
export function generateAICopyForProperty(
  property: MRIRawProperty,
  tone: AICopyTone = "LUXURY_PRESTIGE"
): AICopyResult {
  const beds = property.bedrooms || 3;
  const baths = property.bathrooms || 2;
  const cars = property.carSpaces || 2;
  const suburb = property.suburb;
  const type = property.propertyType;
  const price = property.priceDisplay;

  // 1. Editorial Long-form Copy
  let editorialCopy = "";
  if (tone === "LUXURY_PRESTIGE") {
    editorialCopy = `Commanding an elevated position in one of ${suburb}'s most coveted enclaves, this magnificent ${type.toLowerCase()} exemplifies architectural mastery and refined elegance. Designed for sophisticated living, the residence offers ${beds} expansive bedrooms, ${baths} opulent bathrooms, and ${cars}-car garaging. Spanning seamless indoor-outdoor entertainments areas, the property combines natural light, premium finishes, and peaceful privacy. Proudly presented by ${AGENCY_NAME}.`;
  } else if (tone === "EMOTIONAL_FAMILY") {
    editorialCopy = `Welcome home to a sanctuary designed for cherished family memories. Nestled in a quiet, family-friendly pocket of ${suburb}, this beautiful ${type.toLowerCase()} offers ${beds} spacious bedrooms, ${baths} pristine bathrooms, and room for ${cars} vehicles. Enjoy sun-drenched living areas, a private backyard ideal for children and pets, and close proximity to top schools and local parks. Contact ${AGENCY_NAME} today to arrange your private viewing.`;
  } else {
    editorialCopy = `A prime investment opportunity in high-growth ${suburb}. This well-appointed ${type.toLowerCase()} features ${beds} bedrooms, ${baths} bathrooms, and ${cars} secure parking spaces. Offering strong rental yield potential, low maintenance appeal, and immediate proximity to transport, shopping, and dining hubs. Presented exclusively by ${AGENCY_NAME}.`;
  }

  // 2. Portal Summary (REA/Domain style)
  const portalSummaryCopy = `• Prime ${suburb} Location | ${price}
• ${beds} Spacious Bedrooms | ${baths} Designer Bathrooms | ${cars} Secure Car Spaces
• Light-filled open plan living & dining area
• Gourmet kitchen with stone benchtops & premium appliances
• Covered outdoor alfresco entertaining area
• Moments to schools, cafes, transport & coastal lifestyle
• Represented exclusively by ${AGENCY_NAME}`;

  // 3. Social Media Caption
  const socialMediaCaption = `✨ JUST LISTED in ${suburb}! ✨\n\n🏡 ${property.headline}\n📍 ${property.streetName}, ${suburb}\n🛏 ${beds} Bed | 🛁 ${baths} Bath | 🚗 ${cars} Car\n💰 ${price}\n\nExperience luxury coastal living at its finest. DM us for full floorplan & private inspection times!\n\n#${suburb.replace(/\s+/g, "")}RealEstate #${AGENCY_NAME.replace(/\s+/g, "")} #PropertyForSale #SydneyProperty #PrestigeHomes #RealEstateAustralia`;

  // 4. SMS Buyer Alert (short 160-char format)
  const smsBuyerAlert = `HOT MATCH: New ${beds}b/${baths}b ${type} in ${suburb}! ${price}. Off-market inspection this Sat. Reply INFO or call ${AGENCY_NAME}.`;

  return {
    propertyId: property.externalId,
    headline: property.headline,
    editorialCopy,
    portalSummaryCopy,
    socialMediaCaption,
    smsBuyerAlert,
    generatedAt: new Date(),
  };
}
