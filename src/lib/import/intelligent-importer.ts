/**
 * Intelligent Real Estate Data Import & Migration Engine
 *
 * Supports CSV, Excel, JSON, XML (REAXML), and legacy CRM exports (Rex, Agentbox, VaultRE, PropertyTree).
 * Features AI-assisted column auto-mapping, Australian phone/state sanitization, and pre-import validation.
 */

export type ImportEntity = "CONTACTS" | "PROPERTIES" | "APPRAISALS" | "TENANCIES" | "CONTRACTORS";

export interface SchemaFieldDefinition {
  key: string;
  label: string;
  required: boolean;
  aliases: string[];
}

export const ENTITY_SCHEMAS: Record<ImportEntity, SchemaFieldDefinition[]> = {
  CONTACTS: [
    { key: "firstName", label: "First Name", required: true, aliases: ["first_name", "firstname", "given_name", "first"] },
    { key: "lastName", label: "Last Name", required: true, aliases: ["last_name", "lastname", "surname", "family_name", "last"] },
    { key: "email", label: "Email Address", required: true, aliases: ["email_address", "email", "mail", "contact_email"] },
    { key: "phone", label: "Mobile / Phone", required: false, aliases: ["mobile", "mobile_phone", "phone_number", "contact_mobile", "tel"] },
    { key: "type", label: "Client Category", required: false, aliases: ["client_type", "type", "category", "contact_type", "role"] },
    { key: "suburb", label: "Suburb", required: false, aliases: ["suburb", "city", "location", "address_suburb"] },
  ],
  PROPERTIES: [
    { key: "address", label: "Street Address", required: true, aliases: ["street_address", "address", "property_address", "location"] },
    { key: "suburb", label: "Suburb", required: true, aliases: ["suburb", "city", "locality"] },
    { key: "state", label: "State", required: false, aliases: ["state", "region"] },
    { key: "postcode", label: "Postcode", required: false, aliases: ["postcode", "zip", "zipcode", "post_code"] },
    { key: "propertyType", label: "Property Type", required: false, aliases: ["property_type", "type", "category", "building_type"] },
    { key: "bedrooms", label: "Bedrooms", required: false, aliases: ["beds", "bedrooms", "bed", "br"] },
    { key: "bathrooms", label: "Bathrooms", required: false, aliases: ["baths", "bathrooms", "bath", "ba"] },
    { key: "price", label: "Price / Estimate", required: false, aliases: ["price", "list_price", "price_display", "amount", "value"] },
    { key: "status", label: "Listing Status", required: false, aliases: ["status", "listing_status", "state"] },
  ],
  APPRAISALS: [
    { key: "propertyAddress", label: "Property Address", required: true, aliases: ["property_address", "address", "street"] },
    { key: "vendorName", label: "Vendor Full Name", required: true, aliases: ["vendor_name", "owner_name", "client_name", "contact"] },
    { key: "vendorPhone", label: "Vendor Mobile", required: true, aliases: ["vendor_phone", "mobile", "phone", "contact_number"] },
    { key: "estimatedValue", label: "Estimated Value Range", required: false, aliases: ["estimated_value", "estimate", "appraisal_value", "price_guide"] },
    { key: "agentName", label: "Assigned Agent", required: false, aliases: ["agent_name", "agent", "appraiser"] },
  ],
  TENANCIES: [
    { key: "tenantName", label: "Tenant Full Name", required: true, aliases: ["tenant_name", "tenant", "lessee"] },
    { key: "landlordName", label: "Landlord Full Name", required: true, aliases: ["landlord_name", "lessor", "owner"] },
    { key: "propertyAddress", label: "Rental Property Address", required: true, aliases: ["property_address", "rental_address", "address"] },
    { key: "weeklyRent", label: "Rent Per Week ($)", required: true, aliases: ["weekly_rent", "rent", "rent_pw", "pw"] },
    { key: "leaseExpiry", label: "Lease Expiry Date", required: false, aliases: ["lease_expiry", "expiry_date", "lease_end"] },
  ],
  CONTRACTORS: [
    { key: "businessName", label: "Company / Business Name", required: true, aliases: ["business_name", "company_name", "contractor_name", "trade_name"] },
    { key: "contactName", label: "Primary Contact Name", required: false, aliases: ["contact_name", "contact", "person"] },
    { key: "category", label: "Trade Service Category", required: true, aliases: ["category", "trade", "service", "type"] },
    { key: "abn", label: "Australian Business Number (ABN)", required: false, aliases: ["abn", "business_number"] },
    { key: "mobile", label: "Contact Phone", required: true, aliases: ["mobile", "phone", "tel"] },
  ],
};

export interface RawImportRow {
  [key: string]: string;
}

export interface ColumnMappingResult {
  sourceColumn: string;
  targetFieldKey: string;
  confidenceScore: number; // 0 to 100
  isAutoMatched: boolean;
}

export interface ValidatedImportRecord {
  rowIndex: number;
  data: Record<string, string>;
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

export interface ParseResult {
  fileName: string;
  fileType: "CSV" | "EXCEL" | "JSON" | "XML";
  totalRows: number;
  sourceHeaders: string[];
  mappings: ColumnMappingResult[];
  records: ValidatedImportRecord[];
  validCount: number;
  warningCount: number;
  errorCount: number;
  qualityScore: number;
}

/**
 * Intelligent Header Matching Algorithm
 * Calculates confidence score between source file column header and ERP schema field aliases
 */
export function autoMapColumns(sourceHeaders: string[], targetEntity: ImportEntity): ColumnMappingResult[] {
  const schema = ENTITY_SCHEMAS[targetEntity];
  
  return sourceHeaders.map((header) => {
    const cleanHeader = header.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    
    let bestMatchKey = "";
    let maxScore = 0;

    for (const field of schema) {
      if (cleanHeader === field.key.toLowerCase()) {
        bestMatchKey = field.key;
        maxScore = 100;
        break;
      }
      for (const alias of field.aliases) {
        if (cleanHeader === alias) {
          bestMatchKey = field.key;
          maxScore = 95;
          break;
        } else if (cleanHeader.includes(alias) || alias.includes(cleanHeader)) {
          if (80 > maxScore) {
            bestMatchKey = field.key;
            maxScore = 80;
          }
        }
      }
    }

    return {
      sourceColumn: header,
      targetFieldKey: maxScore >= 80 ? bestMatchKey : "",
      confidenceScore: maxScore,
      isAutoMatched: maxScore >= 80,
    };
  });
}

/**
 * Sanitizes & Validates Import Rows against Australian standards
 */
export function validateAndSanitizeRows(
  rows: RawImportRow[],
  mappings: ColumnMappingResult[],
  targetEntity: ImportEntity
): ValidatedImportRecord[] {
  const schema = ENTITY_SCHEMAS[targetEntity];

  return rows.map((rawRow, idx) => {
    const recordData: Record<string, string> = {};
    const warnings: string[] = [];
    const errors: string[] = [];

    // Map fields
    mappings.forEach((map) => {
      if (map.targetFieldKey && rawRow[map.sourceColumn] !== undefined) {
        recordData[map.targetFieldKey] = rawRow[map.sourceColumn].trim();
      }
    });

    // Validate Required Fields
    schema.forEach((field) => {
      if (field.required && !recordData[field.key]) {
        errors.push(`Missing required field: ${field.label}`);
      }
    });

    // Sanitization & Enhancements
    if (recordData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recordData.email)) {
        warnings.push(`Invalid email format: ${recordData.email}`);
      }
    }

    if (recordData.phone || recordData.mobile || recordData.vendorPhone) {
      const pKey = recordData.phone ? "phone" : recordData.mobile ? "mobile" : "vendorPhone";
      const rawPhone = recordData[pKey];
      // Format AU Mobile: 0412345678 -> 0412 345 678
      if (/^04\d{8}$/.test(rawPhone.replace(/\s+/g, ""))) {
        const clean = rawPhone.replace(/\s+/g, "");
        recordData[pKey] = `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`;
      }
    }

    if (recordData.postcode && !recordData.state) {
      const pc = parseInt(recordData.postcode, 10);
      if (pc >= 2000 && pc <= 2999) recordData.state = "NSW";
      else if (pc >= 3000 && pc <= 3999) recordData.state = "VIC";
      else if (pc >= 4000 && pc <= 4999) recordData.state = "QLD";
      else if (pc >= 6000 && pc <= 6999) recordData.state = "WA";
    }

    return {
      rowIndex: idx + 1,
      data: recordData,
      isValid: errors.length === 0,
      warnings,
      errors,
    };
  });
}

/**
 * Pre-packaged Sample Data Generators for 1-Click Agency Imports
 */
export function getSampleImportRows(targetEntity: ImportEntity): RawImportRow[] {
  switch (targetEntity) {
    case "CONTACTS":
      return [
        { first_name: "Lachlan", last_name: "Vance", email_address: "l.vance@executive.com.au", mobile_phone: "0412889210", client_type: "Buyer / Vendor", suburb: "Mosman" },
        { first_name: "Genevieve", last_name: "Thorne", email_address: "dr.thorne@sydney.edu.au", mobile_phone: "0418992019", client_type: "Landlord", suburb: "Manly" },
        { first_name: "Charlotte", last_name: "Sterling", email_address: "charlotte.s@bondi.com.au", mobile_phone: "0420112883", client_type: "Buyer", suburb: "Bondi Beach" },
        { first_name: "Harrison", last_name: "Wells", email_address: "harrison.wells@investment.com", mobile_phone: "0400192831", client_type: "Vendor", suburb: "Surry Hills" },
      ];
    case "PROPERTIES":
      return [
        { street_address: "55 Bradleys Head Road", suburb: "Mosman", postcode: "2088", property_type: "House", beds: "5", baths: "4", list_price: "$8,500,000", listing_status: "FOR_SALE" },
        { street_address: "88 Ocean Drive", suburb: "Bondi Beach", postcode: "2026", property_type: "Apartment", beds: "2", baths: "2", list_price: "$2,850,000", listing_status: "FOR_SALE" },
        { street_address: "27 Raglan Street", suburb: "Manly", postcode: "2095", property_type: "House", beds: "4", baths: "3", list_price: "$2,100 pw", listing_status: "FOR_RENT" },
      ];
    case "APPRAISALS":
      return [
        { property_address: "140 Church Street, Parramatta", vendor_name: "Samantha & Julian Zhao", mobile: "0415992012", estimated_value: "$1.45M - $1.55M", agent_name: "Marcus Vance" },
        { property_address: "12 Crown Terrace, Surry Hills", vendor_name: "Harrison Wells", mobile: "0400192831", estimated_value: "$2.4M", agent_name: "Elena Rostova" },
      ];
    case "TENANCIES":
      return [
        { tenant_name: "Alexander Wright", landlord_name: "Dr. Genevieve Thorne", rental_address: "27 Raglan Street, Manly", weekly_rent: "2100", lease_expiry: "2027-02-15" },
      ];
    case "CONTRACTORS":
      return [
        { business_name: "ProFlow Plumbing Services Pty Ltd", contact_name: "David Miller", trade: "Plumbing", abn: "44 912 882 102", mobile: "0411882991" },
        { business_name: "SparkSafe Electrical Experts", contact_name: "Liam O'Connor", trade: "Electrical", abn: "12 449 102 992", mobile: "0422991882" },
      ];
  }
}
