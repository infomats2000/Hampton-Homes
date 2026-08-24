/**
 * Testimonials & Client Reviews Service
 * Provides data models and management for real estate vendor, buyer, and tenant reviews.
 */

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string; // e.g. "Vendor • Sold in Mosman"
  rating: number; // 1 to 5
  quote: string;
  avatarUrl: string;
  suburb: string;
  propertyAddress?: string;
  agentName?: string;
  status: "PUBLISHED" | "DRAFT";
  featuredOnHome: boolean;
  createdAt: string;
}

export const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "REV-1001",
    clientName: "Harrison & Victoria Wells",
    clientRole: "Vendors • Sold Waterfront Estate",
    rating: 5,
    quote:
      "Elena Rostova and the Infomats team achieved an outstanding result for our Mosman estate, setting a suburb record price prior to auction. Their MRI-driven buyer matching brought international buyers directly to our doorstep.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    suburb: "Mosman, NSW",
    propertyAddress: "55 Bradleys Head Road, Mosman",
    agentName: "Elena Rostova",
    status: "PUBLISHED",
    featuredOnHome: true,
    createdAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "REV-1002",
    clientName: "Dr. Alistair MacIntyre",
    clientRole: "Buyer • Luxury Bondi Sub-Penthouse",
    rating: 5,
    quote:
      "The digital transparency was unmatched. From instantaneous auction contract downloads to seamless eIDV verification, buying our coastal penthouse through Infomats was completely stress-free.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    suburb: "Bondi Beach, NSW",
    propertyAddress: "88 Ocean Drive, Bondi Beach",
    agentName: "Elena Rostova",
    status: "PUBLISHED",
    featuredOnHome: true,
    createdAt: "2026-08-18T14:30:00Z",
  },
  {
    id: "REV-1003",
    clientName: "Samantha & Julian Zhao",
    clientRole: "Vendors • Parramatta Luxury Residence",
    rating: 5,
    quote:
      "Marcus Vance managed our auction campaign with complete precision. The AI copywriter generated stunning listing descriptions, and we received 4 competing offers within 10 days.",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    suburb: "Parramatta, NSW",
    propertyAddress: "140 Church Street, Parramatta",
    agentName: "Marcus Vance",
    status: "PUBLISHED",
    featuredOnHome: true,
    createdAt: "2026-08-15T09:15:00Z",
  },
  {
    id: "REV-1004",
    clientName: "Oliver & Clara Thornton",
    clientRole: "Landlords • Northern Beaches Portfolio",
    rating: 5,
    quote:
      "Managing 6 executive rentals across Manly used to take hours every week. With Infomats Property Tree integration and automated Xero landlord statements, our monthly rental yield is trackable in real-time.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    suburb: "Manly, NSW",
    propertyAddress: "27 Raglan Street, Manly",
    agentName: "Oliver Sterling",
    status: "PUBLISHED",
    featuredOnHome: true,
    createdAt: "2026-08-10T11:00:00Z",
  },
];
