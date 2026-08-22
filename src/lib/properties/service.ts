import { MOCK_AUSTRALIAN_PROPERTIES } from "../mri/mock-provider";
import { MRIRawProperty } from "../mri/provider.interface";

export interface AgentModel {
  id: string;
  name: string;
  slug: string;
  position: string;
  photoUrl: string;
  phone: string;
  mobile: string;
  email: string;
  officeName: string;
  bio: string;
  isFeatured: boolean;
  languages: string[];
  activeListingsCount?: number;
}

export interface OfficeModel {
  id: string;
  name: string;
  slug: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  isHeadOffice: boolean;
  description: string;
  agentCount: number;
  listingCount: number;
}

export const MOCK_AGENTS: AgentModel[] = [
  {
    id: "agent-101",
    name: "Marcus Vance",
    slug: "marcus-vance",
    position: "Senior Sales Executive & Partner",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    phone: "(02) 9891 1234",
    mobile: "0412 345 678",
    email: "marcus.vance@hamptonhomes.com.au",
    officeName: "Hampton Homes Parramatta",
    bio: "With over 15 years of real estate experience across Sydney's Western Suburbs and Parramatta CBD, Marcus has set multiple record sales. Known for integrity, market insight, and exceptional negotiation.",
    isFeatured: true,
    languages: ["English", "Mandarin"],
  },
  {
    id: "agent-102",
    name: "Elena Rostova",
    slug: "elena-rostova",
    position: "Director of Luxury Sales",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    phone: "(02) 9362 5555",
    mobile: "0498 765 432",
    email: "elena.rostova@hamptonhomes.com.au",
    officeName: "Hampton Homes Eastern Suburbs",
    bio: "Specialising in prestige waterfront properties across Bondi Beach, Mosman, and Double Bay. Elena brings unparalleled passion for architectural design and high-net-worth client representation.",
    isFeatured: true,
    languages: ["English", "Russian"],
  },
  {
    id: "agent-103",
    name: "Oliver Sterling",
    slug: "oliver-sterling",
    position: "Head of Property Management",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    phone: "(02) 9977 8888",
    mobile: "0433 111 222",
    email: "oliver.sterling@hamptonhomes.com.au",
    officeName: "Hampton Homes Manly",
    bio: "Oliver leads Northern Beaches rental operations. He ensures seamless property performance for landlords and premium tenant experiences across Manly, Freshwater, and Mosman.",
    isFeatured: false,
    languages: ["English"],
  },
];

export const MOCK_OFFICES: OfficeModel[] = [
  {
    id: "office-01",
    name: "Hampton Homes Parramatta",
    slug: "parramatta",
    address: "Level 12, 100 Church Street",
    suburb: "Parramatta",
    state: "NSW",
    postcode: "2150",
    phone: "(02) 9891 1234",
    email: "parramatta@hamptonhomes.com.au",
    isHeadOffice: false,
    description: "Serving Parramatta, Westmead, Harris Park, and the Greater Western Sydney growth corridor.",
    agentCount: 8,
    listingCount: 24,
  },
  {
    id: "office-02",
    name: "Hampton Homes Eastern Suburbs",
    slug: "eastern-suburbs",
    address: "24 Bondi Road",
    suburb: "Bondi Beach",
    state: "NSW",
    postcode: "2026",
    phone: "(02) 9362 5555",
    email: "bondi@hamptonhomes.com.au",
    isHeadOffice: true,
    description: "Our prestige coastal division representing luxury residences across Bondi, Bellevue Hill, Mosman, and Surry Hills.",
    agentCount: 12,
    listingCount: 36,
  },
  {
    id: "office-03",
    name: "Hampton Homes Manly",
    slug: "manly",
    address: "15 The Corso",
    suburb: "Manly",
    state: "NSW",
    postcode: "2095",
    phone: "(02) 9977 8888",
    email: "manly@hamptonhomes.com.au",
    isHeadOffice: false,
    description: "Northern Beaches property sales and rental specialists covering Manly, Fairlight, Freshwater, and Queenscliff.",
    agentCount: 6,
    listingCount: 18,
  },
];

export function getPropertyById(id: string): MRIRawProperty | null {
  return MOCK_AUSTRALIAN_PROPERTIES.find((p) => p.externalId === id) || null;
}

export function getPropertySlug(p: MRIRawProperty): string {
  const address = `${p.streetNumber}-${p.streetName}-${p.suburb}-${p.state}-${p.postcode}`;
  return address.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function getAgentBySlug(slug: string): AgentModel | null {
  return MOCK_AGENTS.find((a) => a.slug === slug) || null;
}

export function getOfficeBySlug(slug: string): OfficeModel | null {
  return MOCK_OFFICES.find((o) => o.slug === slug) || null;
}
