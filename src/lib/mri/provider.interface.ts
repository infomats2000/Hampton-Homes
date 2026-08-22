// Property CRM Integration Interface for Hampton Homes
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
  listingType: "RESIDENTIAL_SALE" | "RESIDENTIAL_RENT" | "COMMERCIAL_SALE" | "COMMERCIAL_RENT";
  status: "FOR_SALE" | "FOR_RENT" | "UNDER_OFFER" | "SOLD" | "LEASED" | "WITHDRAWN";
  headline: string;
  description: string;
  priceDisplay: string;
  priceNumeric: number;
  primaryAgentName: string;
  primaryAgentEmail: string;
  officeName: string;
  photos: string[];
  inspections?: Array<{ startTime: string; endTime: string }>;
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
