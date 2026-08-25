/**
 * Central Contacts Service & vCard Export Helper
 * Infomats Real Estate ERP
 */

export type ContactSource = "MRI" | "HOMEPASS" | "PROPERTYME" | "GOOGLE" | "MICROSOFT" | "MANUAL";
export type ContactType = "LEAD" | "AGENT" | "CUSTOMER" | "TENANT";

export interface UnifiedContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  type: ContactType;
  sources: ContactSource[];
  company?: string;
  title?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  lastActivity?: string;
  matchFlags?: number;
  notes?: string;
}

export const UNIFIED_CONTACTS_DB: UnifiedContact[] = [
  {
    id: "1",
    firstName: "James",
    lastName: "Carrington",
    email: "james.carrington@gmail.com",
    mobile: "+61 411 234 567",
    phone: "+61 2 9900 1122",
    type: "LEAD",
    sources: ["MRI", "HOMEPASS"],
    suburb: "Mosman",
    state: "NSW",
    postcode: "2088",
    company: "Carrington Holdings",
    lastActivity: "2 hours ago",
    matchFlags: 0,
    notes: "Interested in 4-bed waterfront luxury home in Mosman.",
  },
  {
    id: "2",
    firstName: "Sophia",
    lastName: "Williams",
    email: "sophia.w@outlook.com",
    mobile: "+61 421 345 678",
    phone: "+61 2 9911 2233",
    type: "LEAD",
    sources: ["MRI"],
    suburb: "Cremorne",
    state: "NSW",
    postcode: "2090",
    company: "Williams Design Co",
    lastActivity: "Yesterday",
    matchFlags: 1,
    notes: "Attended Open Home at 14 Military Rd.",
  },
  {
    id: "3",
    firstName: "Liam",
    lastName: "Chen",
    email: "liam.chen@example.com.au",
    mobile: "+61 400 123 456",
    type: "TENANT",
    sources: ["PROPERTYME"],
    suburb: "Neutral Bay",
    state: "NSW",
    postcode: "2089",
    company: "Chen Tech",
    lastActivity: "3 days ago",
    matchFlags: 0,
    notes: "Current Tenant at 8/42 Ben Boyd Rd.",
  },
  {
    id: "4",
    firstName: "Olivia",
    lastName: "Martinez",
    email: "olivia.m@gmail.com",
    mobile: "+61 431 456 789",
    type: "CUSTOMER",
    sources: ["MRI", "GOOGLE"],
    suburb: "Kirribilli",
    state: "NSW",
    postcode: "2061",
    lastActivity: "1 week ago",
    matchFlags: 0,
    notes: "Vendor client for upcoming auction.",
  },
  {
    id: "5",
    firstName: "Noah",
    lastName: "Thompson",
    email: "noah.t@icloud.com",
    mobile: "+61 405 567 890",
    type: "LEAD",
    sources: ["HOMEPASS"],
    suburb: "Manly",
    state: "NSW",
    postcode: "2095",
    lastActivity: "2 weeks ago",
    matchFlags: 0,
    notes: "Enquired on beachfront penthouse.",
  },
  {
    id: "6",
    firstName: "Emma",
    lastName: "Davies",
    email: "emma.davies@company.com.au",
    mobile: "+61 412 678 901",
    type: "LEAD",
    sources: ["MRI", "MICROSOFT"],
    suburb: "Balmain",
    state: "NSW",
    postcode: "2041",
    lastActivity: "3 weeks ago",
    matchFlags: 2,
    notes: "Potential duplicate contact merged from Outlook.",
  },
  {
    id: "7",
    firstName: "William",
    lastName: "Johnson",
    email: "wjohnson@email.com",
    mobile: "+61 422 789 012",
    type: "AGENT",
    sources: ["MRI", "GOOGLE"],
    suburb: "Sydney",
    state: "NSW",
    postcode: "2000",
    company: "Infomats Real Estate",
    title: "Senior Sales Executive",
    lastActivity: "1 hour ago",
    matchFlags: 0,
    notes: "Listing Agent for North Shore sector.",
  },
  {
    id: "8",
    firstName: "Ava",
    lastName: "Brown",
    email: "ava.b@rentals.com",
    mobile: "+61 433 890 123",
    type: "TENANT",
    sources: ["PROPERTYME", "MRI"],
    suburb: "Paddington",
    state: "NSW",
    postcode: "2021",
    lastActivity: "Today",
    matchFlags: 0,
    notes: "Approved applicant for 12 Oxford St.",
  },
];

export function getContactById(id: string): UnifiedContact | undefined {
  return UNIFIED_CONTACTS_DB.find((c) => c.id === id);
}
