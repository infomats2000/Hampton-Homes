import { MRIRawProperty } from "../mri/provider.interface";
import { AgentModel, OfficeModel } from "../properties/service";

/**
 * Generates Schema.org JSON-LD for RealEstateListing / Residence
 * Fulfills Section 50 of prompt
 */
export function generatePropertySchema(property: MRIRawProperty) {
  return {
    "@context": "https://schema.org",
    "@type": property.propertyType === "Apartment" ? "Apartment" : "SingleFamilyResidence",
    name: property.headline,
    description: property.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${property.streetNumber} ${property.streetName}`,
      addressLocality: property.suburb,
      addressRegion: property.state,
      postalCode: property.postcode,
      addressCountry: "AU",
    },
    numberOfBedrooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    image: property.photos,
    offers: {
      "@type": "Offer",
      price: property.priceNumeric || 0,
      priceCurrency: "AUD",
      availability: property.status === "FOR_SALE" || property.status === "FOR_RENT"
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
    },
  };
}

/**
 * Generates Schema.org JSON-LD for RealEstateAgent
 */
export function generateAgentSchema(agent: AgentModel) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: agent.name,
    jobTitle: agent.position,
    telephone: agent.phone,
    email: agent.email,
    image: agent.photoUrl,
    worksFor: {
      "@type": "Organization",
      name: "Hampton Homes Real Estate",
    },
  };
}
