/**
 * Settlement Milestone Matrix & Contract Progression Tracker
 * Tracks statutory milestone dates, cooling-off periods, finance approval,
 * building/pest clearance, and settlement day countdowns.
 */

export type SettlementStage =
  | "EXCHANGED"
  | "COOLING_OFF"
  | "FINANCE_PENDING"
  | "BUILDING_PEST_PENDING"
  | "UNCONDITIONAL"
  | "SETTLED"
  | "COLLAPSED";

export interface SettlementDeal {
  id: string;
  propertyId: string;
  headline: string;
  propertyAddress: string;
  vendorName: string;
  buyerName: string;
  listingAgentName: string;
  salePrice: number;
  depositAmount: number;
  depositStatus: "HELD" | "PARTIAL" | "PENDING";

  // Statutory Milestone Dates
  exchangeDate: Date;
  coolingOffExpiryDate?: Date;
  financeApprovalDueDate?: Date;
  buildingPestDueDate?: Date;
  unconditionalTargetDate: Date;
  settlementDate: Date;

  // Milestone Completion Status
  coolingOffSatisfied: boolean;
  financeApproved: boolean;
  buildingPestPassed: boolean;
  isUnconditional: boolean;
  isSettled: boolean;

  stage: SettlementStage;
  notes?: string;
}

export const MOCK_SETTLEMENT_DEALS: SettlementDeal[] = [
  {
    id: "deal-1001",
    propertyId: "mri-vlt-1001",
    headline: "Architectural Parramatta Family Residence",
    propertyAddress: "142 Church Street, Parramatta NSW 2150",
    vendorName: "Sarah Jenkins",
    buyerName: "David Miller",
    listingAgentName: "Marcus Vance",
    salePrice: 1480000,
    depositAmount: 148000,
    depositStatus: "HELD",
    exchangeDate: new Date(Date.now() - 86400000 * 10),
    coolingOffExpiryDate: new Date(Date.now() - 86400000 * 5),
    financeApprovalDueDate: new Date(Date.now() + 86400000 * 4),
    buildingPestDueDate: new Date(Date.now() + 86400000 * 2),
    unconditionalTargetDate: new Date(Date.now() + 86400000 * 5),
    settlementDate: new Date(Date.now() + 86400000 * 25),
    coolingOffSatisfied: true,
    financeApproved: false,
    buildingPestPassed: true,
    isUnconditional: false,
    isSettled: false,
    stage: "FINANCE_PENDING",
    notes: "Finance approval expected from ANZ Bank by Friday.",
  },
  {
    id: "deal-1002",
    propertyId: "mri-vlt-1002",
    headline: "Prestige Coastal Apartment Overlooking Bondi",
    propertyAddress: "88 Ocean Drive, Bondi Beach NSW 2026",
    vendorName: "Alexander Vance",
    buyerName: "Sophie Zhang",
    listingAgentName: "Elena Rostova",
    salePrice: 2850000,
    depositAmount: 285000,
    depositStatus: "HELD",
    exchangeDate: new Date(Date.now() - 86400000 * 14),
    coolingOffExpiryDate: new Date(Date.now() - 86400000 * 14), // Auction sale = unconditional immediately
    unconditionalTargetDate: new Date(Date.now() - 86400000 * 14),
    settlementDate: new Date(Date.now() + 86400000 * 16),
    coolingOffSatisfied: true,
    financeApproved: true,
    buildingPestPassed: true,
    isUnconditional: true,
    isSettled: false,
    stage: "UNCONDITIONAL",
    notes: "Auction sale. Contract unconditional. Settlement booked for 16 days.",
  },
  {
    id: "deal-1003",
    propertyId: "mri-vlt-1004",
    headline: "Prestige Waterfront Villa with Private Jetty",
    propertyAddress: "12/45 Spit Road, Mosman NSW 2088",
    vendorName: "Lady Eleanor Sterling",
    buyerName: "Harrison Vance",
    listingAgentName: "Elena Rostova",
    salePrice: 8500000,
    depositAmount: 5000,
    depositStatus: "PARTIAL",
    exchangeDate: new Date(Date.now() - 86400000 * 2),
    coolingOffExpiryDate: new Date(Date.now() + 86400000 * 3),
    unconditionalTargetDate: new Date(Date.now() + 86400000 * 12),
    settlementDate: new Date(Date.now() + 86400000 * 42),
    coolingOffSatisfied: false,
    financeApproved: false,
    buildingPestPassed: false,
    isUnconditional: false,
    isSettled: false,
    stage: "COOLING_OFF",
    notes: "Cooling-off expires at 5:00 PM in 3 days. Balance 10% deposit due.",
  },
];

/**
 * Calculates days remaining until settlement date.
 */
export function getDaysToSettlement(settlementDate: Date): number {
  const diffTime = new Date(settlementDate).getTime() - new Date().getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Returns settlement metrics summary.
 */
export function getSettlementPipelineSummary(deals: SettlementDeal[] = MOCK_SETTLEMENT_DEALS) {
  const pendingDeals = deals.filter((d) => !d.isSettled && d.stage !== "COLLAPSED");
  const totalVolume = pendingDeals.reduce((acc, d) => acc + d.salePrice, 0);
  const totalDepositsHeld = pendingDeals.reduce((acc, d) => acc + d.depositAmount, 0);
  const unconditionalCount = pendingDeals.filter((d) => d.isUnconditional).length;
  const coolingOffCount = pendingDeals.filter((d) => d.stage === "COOLING_OFF").length;

  return {
    totalPendingDeals: pendingDeals.length,
    totalVolume,
    totalDepositsHeld,
    unconditionalCount,
    coolingOffCount,
  };
}
