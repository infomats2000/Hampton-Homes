// Property CRM Integration Interface for Infomats Real Estate Platform
export interface MRISyncResult {
  success: boolean;
  jobId: string;
  recordsProcessed: number;
  recordsUpdated: number;
  recordsFailed: number;
  errors: Array<{ externalId: string; message: string }>;
}

export interface MRIRawProperty {
  externalId: string;
  provider: "VAULT" | "PROPERTY_TREE";
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postcode: string;
  bedrooms: number;
  bathrooms: number;
  carSpaces: number;
  landAreaSqm?: number;
  buildingAreaSqm?: number;
  propertyType: string; // House, Apartment, Townhouse, Villa
  listingType: "RESIDENTIAL_SALE" | "RESIDENTIAL_RENT" | "COMMERCIAL_SALE" | "COMMERCIAL_RENT" | "PROJECT";
  status: "DRAFT" | "COMING_SOON" | "FOR_SALE" | "FOR_RENT" | "AUCTION" | "UNDER_OFFER" | "UNDER_CONTRACT" | "SOLD" | "LEASED" | "WITHDRAWN" | "OFF_MARKET";
  headline: string;
  description: string;
  priceDisplay: string;
  priceNumeric: number;
  primaryAgentName: string;
  primaryAgentEmail: string;
  officeName: string;
  photos: string[];
  inspections?: Array<{ startTime: string; endTime: string }>;
  auctionDate?: string;
  auctionLocation?: string;
  updatedAt: string;
}

export interface PropertyCRMProvider {
  providerName: "VAULT" | "PROPERTY_TREE" | "MOCK";
  connect(): Promise<boolean>;
  testConnection(): Promise<{ connected: boolean; latencyMs: number; message: string }>;
  getProperties(): Promise<MRIRawProperty[]>;
  getProperty(externalId: string): Promise<MRIRawProperty | null>;
  pushEnquiry(enquiry: { externalListingId: string; name: string; email: string; phone: string; message: string }): Promise<{ success: boolean; mriRefId?: string }>;
  syncChanges(): Promise<MRISyncResult>;
}
