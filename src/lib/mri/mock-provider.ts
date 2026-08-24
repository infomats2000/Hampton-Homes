import { AGENCY_NAME } from "../agency-config";
import { PropertyCRMProvider, MRIRawProperty, MRISyncResult } from "./provider.interface";

export const MOCK_AUSTRALIAN_PROPERTIES: MRIRawProperty[] = [
  {
    externalId: "mri-vlt-1001",
    provider: "VAULT",
    streetNumber: "142",
    streetName: "Church Street",
    suburb: "Parramatta",
    state: "NSW",
    postcode: "2150",
    bedrooms: 3,
    bathrooms: 2,
    carSpaces: 2,
    landAreaSqm: 450,
    buildingAreaSqm: 180,
    propertyType: "House",
    listingType: "RESIDENTIAL_SALE",
    status: "FOR_SALE",
    headline: "Luxurious Modern Residence in the Heart of Parramatta CBD",
    description: "Designed for seamless indoor-outdoor living, this impeccably presented three-bedroom family home offers spacious light-filled interiors, high ceilings, custom cabinetry, and a gourmet marble kitchen equipped with premium Miele appliances.",
    priceDisplay: "$1,450,000 - $1,550,000",
    priceNumeric: 1480000,
    primaryAgentName: "Marcus Vance",
    primaryAgentEmail: "marcus.vance@infomats.com.au",
    officeName: `${AGENCY_NAME} Parramatta`,
    photos: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    ],
    inspections: [
      { startTime: "2026-08-29T10:00:00+10:00", endTime: "2026-08-29T10:30:00+10:00" },
      { startTime: "2026-09-02T17:30:00+10:00", endTime: "2026-09-02T18:00:00+10:00" },
    ],
    updatedAt: "2026-08-22T09:00:00Z",
  },
  {
    externalId: "mri-vlt-1002",
    provider: "VAULT",
    streetNumber: "88",
    streetName: "Ocean Drive",
    suburb: "Bondi Beach",
    state: "NSW",
    postcode: "2026",
    bedrooms: 2,
    bathrooms: 2,
    carSpaces: 1,
    buildingAreaSqm: 110,
    propertyType: "Apartment",
    listingType: "RESIDENTIAL_SALE",
    status: "FOR_SALE",
    headline: "Coastal Luxury Apartment with Panoramic Pacific Ocean Views",
    description: "Positioned directly opposite the iconic sands of Bondi Beach, this sub-penthouse sanctuary features floor-to-ceiling glass, expansive entertainer's terrace, timber flooring, and direct elevator access.",
    priceDisplay: "$2,850,000",
    priceNumeric: 2850000,
    primaryAgentName: "Elena Rostova",
    primaryAgentEmail: "elena.rostova@infomats.com.au",
    officeName: `${AGENCY_NAME} Eastern Suburbs`,
    photos: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    ],
    inspections: [
      { startTime: "2026-08-29T11:15:00+10:00", endTime: "2026-08-29T11:45:00+10:00" },
    ],
    updatedAt: "2026-08-21T14:20:00Z",
  },
  {
    externalId: "mri-pt-2001",
    provider: "PROPERTY_TREE",
    streetNumber: "27",
    streetName: "Raglan Street",
    suburb: "Manly",
    state: "NSW",
    postcode: "2095",
    bedrooms: 4,
    bathrooms: 3,
    carSpaces: 2,
    landAreaSqm: 620,
    buildingAreaSqm: 260,
    propertyType: "House",
    listingType: "RESIDENTIAL_RENT",
    status: "FOR_RENT",
    headline: "Prestigious Family Residence Moments to Manly Wharf and Ocean Beach",
    description: "Offering the quintessential Northern Beaches lifestyle, this grand freestanding residence presents multiple living areas, a solar-heated swimming pool, landscaped subtropical gardens, and ducted air-conditioning throughout.",
    priceDisplay: "$2,100 per week",
    priceNumeric: 2100,
    primaryAgentName: "Oliver Sterling",
    primaryAgentEmail: "oliver.sterling@infomats.com.au",
    officeName: `${AGENCY_NAME} Manly`,
    photos: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80",
    ],
    inspections: [
      { startTime: "2026-08-29T09:30:00+10:00", endTime: "2026-08-29T10:00:00+10:00" },
    ],
    updatedAt: "2026-08-22T08:15:00Z",
  },
  {
    externalId: "mri-vlt-1003",
    provider: "VAULT",
    streetNumber: "55",
    streetName: "Bradleys Head Road",
    suburb: "Mosman",
    state: "NSW",
    postcode: "2088",
    bedrooms: 5,
    bathrooms: 4,
    carSpaces: 3,
    landAreaSqm: 850,
    buildingAreaSqm: 420,
    propertyType: "House",
    listingType: "RESIDENTIAL_SALE",
    status: "UNDER_OFFER",
    headline: "Architectural Masterpiece Overlooking Sydney Harbour",
    description: "An extraordinary estate crafted with stone, steel and glass. Command unobstructed Sydney Opera House and Harbour Bridge vistas from expansive entertaining decks.",
    priceDisplay: "Auction Guide $8,500,000",
    priceNumeric: 8500000,
    primaryAgentName: "Elena Rostova",
    primaryAgentEmail: "elena.rostova@infomats.com.au",
    officeName: `${AGENCY_NAME} Mosman`,
    photos: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    ],
    updatedAt: "2026-08-20T16:00:00Z",
  },
  {
    externalId: "mri-vlt-1004",
    provider: "VAULT",
    streetNumber: "12",
    streetName: "Crown Terrace",
    suburb: "Surry Hills",
    state: "NSW",
    postcode: "2010",
    bedrooms: 3,
    bathrooms: 2,
    carSpaces: 1,
    landAreaSqm: 160,
    propertyType: "Townhouse",
    listingType: "RESIDENTIAL_SALE",
    status: "SOLD",
    headline: "Sold at Auction - Heritage Victorian Terrace with Designer Renovation",
    description: "Beautifully restored Victorian terrace blending period character with minimalist modern aesthetics. Sold prior to auction for a suburb record price.",
    priceDisplay: "Sold for $2,420,000",
    priceNumeric: 2420000,
    primaryAgentName: "Marcus Vance",
    primaryAgentEmail: "marcus.vance@infomats.com.au",
    officeName: `${AGENCY_NAME} Parramatta`,
    photos: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    ],
    updatedAt: "2026-08-19T11:00:00Z",
  },
];

export class MockMRIProvider implements PropertyCRMProvider {
  providerName: "VAULT" | "PROPERTY_TREE" | "MOCK" = "MOCK";

  async connect(): Promise<boolean> {
    return true;
  }

  async testConnection(): Promise<{ connected: boolean; latencyMs: number; message: string }> {
    return {
      connected: true,
      latencyMs: 42,
      message: "Connected to Mock MRI Vault & Property Tree Sync Engine v2.4 (Demo Mode)",
    };
  }

  async getProperties(): Promise<MRIRawProperty[]> {
    return MOCK_AUSTRALIAN_PROPERTIES;
  }

  async getProperty(externalId: string): Promise<MRIRawProperty | null> {
    return MOCK_AUSTRALIAN_PROPERTIES.find((p) => p.externalId === externalId) || null;
  }

  async pushEnquiry(enquiry: { externalListingId: string; name: string; email: string; phone: string; message: string }): Promise<{ success: boolean; mriRefId?: string }> {
    return {
      success: true,
      mriRefId: `ENQ-MRI-${Math.floor(100000 + Math.random() * 900000)}`,
    };
  }

  async syncChanges(): Promise<MRISyncResult> {
    return {
      success: true,
      jobId: `sync-job-${Date.now()}`,
      recordsProcessed: MOCK_AUSTRALIAN_PROPERTIES.length,
      recordsUpdated: MOCK_AUSTRALIAN_PROPERTIES.length,
      recordsFailed: 0,
      errors: [],
    };
  }
}

export const mriProvider = new MockMRIProvider();
