/**
 * Multi-Tier Commission Split & GST Calculator Engine
 * Handles gross commission, Australian 10% GST calculation, franchise royalty deductions,
 * listing/selling agent splits, conjuncting agent referral fees, and net house retention.
 */

export interface CommissionCalculationInput {
  salePrice: number;
  commissionRatePercent?: number; // e.g. 2.2%
  fixedCommissionAmount?: number; // Used if commission is fixed fee
  franchiseRoyaltyPercent?: number; // Default 8%
  listingAgentSplitPercent?: number; // Default 40% of net pool
  sellingAgentSplitPercent?: number; // Default 35% of net pool
  externalReferralFeePercent?: number; // Default 0% (e.g., 20% for conjuncting agent)
}

export interface CommissionBreakdownResult {
  salePrice: number;
  grossCommissionTotal: number; // Includes 10% GST
  gstAmount: number;            // 10/11th or 10% GST portion
  netCommissionExGst: number;   // Gross minus GST
  franchiseRoyaltyFee: number;  // Franchise royalty deduction
  externalReferralFee: number;  // External referral deduction
  distributablePool: number;    // Amount available for agent splits & house
  listingAgentPayout: number;   // Listing agent commission share
  sellingAgentPayout: number;   // Selling agent commission share
  houseRetention: number;       // Agency net retention
}

export interface AgentCommissionStatementItem {
  id: string;
  agentId: string;
  agentName: string;
  propertyAddress: string;
  settlementDate: Date;
  salePrice: number;
  grossCommission: number;
  gstAmount: number;
  agentRole: "LISTING_AGENT" | "SELLING_AGENT" | "DUAL_AGENT";
  agentPayout: number;
  status: "PENDING_SETTLEMENT" | "APPROVED" | "PAID";
}

/**
 * Calculates a complete multi-tier commission split breakdown.
 */
export function calculateCommissionBreakdown(input: CommissionCalculationInput): CommissionBreakdownResult {
  const salePrice = input.salePrice || 0;

  // 1. Gross Commission Calculation
  let grossCommissionTotal = 0;
  if (input.fixedCommissionAmount && input.fixedCommissionAmount > 0) {
    grossCommissionTotal = input.fixedCommissionAmount;
  } else {
    const rate = input.commissionRatePercent ?? 2.2;
    grossCommissionTotal = (salePrice * rate) / 100;
  }

  // 2. Australian 10% GST Component (Commission includes 10% GST)
  // GST = Gross Commission / 11
  const gstAmount = grossCommissionTotal / 11;
  const netCommissionExGst = grossCommissionTotal - gstAmount;

  // 3. Off-the-Top Deductions (Franchise Royalties & External Referrals)
  const franchiseRate = input.franchiseRoyaltyPercent ?? 8.0;
  const franchiseRoyaltyFee = (netCommissionExGst * franchiseRate) / 100;

  const referralRate = input.externalReferralFeePercent ?? 0.0;
  const externalReferralFee = (netCommissionExGst * referralRate) / 100;

  // Distributable Pool for Agency & Agents
  const distributablePool = netCommissionExGst - franchiseRoyaltyFee - externalReferralFee;

  // 4. Agent Splits
  const listingSplit = input.listingAgentSplitPercent ?? 40.0;
  const sellingSplit = input.sellingAgentSplitPercent ?? 35.0;

  const listingAgentPayout = (distributablePool * listingSplit) / 100;
  const sellingAgentPayout = (distributablePool * sellingSplit) / 100;

  // 5. House Net Retention
  const houseRetention = distributablePool - listingAgentPayout - sellingAgentPayout;

  return {
    salePrice,
    grossCommissionTotal,
    gstAmount,
    netCommissionExGst,
    franchiseRoyaltyFee,
    externalReferralFee,
    distributablePool,
    listingAgentPayout,
    sellingAgentPayout,
    houseRetention,
  };
}

export const MOCK_COMMISSION_STATEMENTS: AgentCommissionStatementItem[] = [
  {
    id: "comm-1001",
    agentId: "agent-101",
    agentName: "Marcus Vance",
    propertyAddress: "142 Church Street, Parramatta NSW",
    settlementDate: new Date("2026-09-15"),
    salePrice: 1480000,
    grossCommission: 32560,
    gstAmount: 2960,
    agentRole: "DUAL_AGENT",
    agentPayout: 17760,
    status: "PENDING_SETTLEMENT",
  },
  {
    id: "comm-1002",
    agentId: "agent-102",
    agentName: "Elena Rostova",
    propertyAddress: "88 Ocean Drive, Bondi Beach NSW",
    settlementDate: new Date("2026-09-28"),
    salePrice: 2850000,
    grossCommission: 62700,
    gstAmount: 5700,
    agentRole: "LISTING_AGENT",
    agentPayout: 20748,
    status: "APPROVED",
  },
  {
    id: "comm-1003",
    agentId: "agent-103",
    agentName: "Oliver Sterling",
    propertyAddress: "27 Raglan Street, Manly NSW",
    settlementDate: new Date("2026-08-10"),
    salePrice: 1950000,
    grossCommission: 42900,
    gstAmount: 3900,
    agentRole: "SELLING_AGENT",
    agentPayout: 12285,
    status: "PAID",
  },
];
