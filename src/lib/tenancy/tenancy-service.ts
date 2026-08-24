/**
 * Property Management & Tenancy Operations Service
 * Handles active tenant leases, 90/60/30-day lease renewal countdowns,
 * routine property condition inspection reports, trade work orders,
 * and landlord monthly income statements.
 */

import { AGENCY_NAME, AGENCY_LEGAL_NAME, AGENCY_ABN, AGENCY_PHONE, AGENCY_EMAIL } from "../agency-config";

export type RentPaymentStatus = "PAID_UP_TO_DATE" | "ARREARS_3_DAYS" | "ARREARS_7_DAYS" | "ARREARS_14_DAYS";
export type LeaseRenewalAlert = "ALERT_30_DAYS" | "ALERT_60_DAYS" | "ALERT_90_DAYS" | "HEALTHY";
export type InspectionItemRating = "CLEAN_UNDAMAGED" | "FAIR" | "MAINTENANCE_REQUIRED" | "ACTION_NEEDED";
export type WorkOrderStatus = "LOGGED" | "WORK_ORDER_DISPATCHED" | "ACCEPTED" | "WORK_COMPLETED" | "INVOICE_PAID";

export interface TenantLeaseRecord {
  id: string;
  propertyId: string;
  propertyAddress: string;
  suburb: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  landlordName: string;
  landlordEmail: string;
  rentAmount: number;
  rentFrequency: "WEEKLY" | "FORTNIGHTLY" | "MONTHLY";
  bondAmount: number;
  bondReference: string;
  leaseStartDate: Date;
  leaseEndDate: Date;
  paidToDate: Date;
  rentStatus: RentPaymentStatus;
  renewalAlert: LeaseRenewalAlert;
  daysRemaining: number;
  notes?: string;
}

export interface RoomInspectionItem {
  roomName: string; // e.g., "Kitchen", "Master Bedroom", "Bathroom"
  wallsRating: InspectionItemRating;
  floorsRating: InspectionItemRating;
  windowsRating: InspectionItemRating;
  fixturesRating: InspectionItemRating;
  comments?: string;
  photoUrls?: string[];
}

export interface RoutineInspectionReport {
  id: string;
  leaseId: string;
  propertyAddress: string;
  tenantName: string;
  inspectorName: string;
  inspectionDate: Date;
  overallCondition: "EXCELLENT" | "GOOD" | "ATTENTION_REQUIRED" | "URGENT_MAINTENANCE";
  roomItems: RoomInspectionItem[];
  generalNotes?: string;
  inspectorSignedAt?: Date;
  tenantSignedAt?: Date;
}

export interface TradeWorkOrder {
  id: string;
  workOrderNumber: string; // WO-2026-XXXX format
  leaseId: string;
  propertyAddress: string;
  title: string;
  description: string;
  category: "PLUMBING" | "ELECTRICAL" | "LOCKSMITH" | "BUILDING" | "APPLIANCE" | "GENERAL";
  priority: "ROUTINE" | "HIGH" | "EMERGENCY";
  status: WorkOrderStatus;
  contractorName: string;
  contractorEmail: string;
  contractorPhone: string;
  authorizedCostLimit: number;
  invoiceAmount?: number;
  createdAt: Date;
  completedAt?: Date;
}

export const MOCK_LEASES: TenantLeaseRecord[] = [
  {
    id: "lease-1001",
    propertyId: "mri-vlt-1003",
    propertyAddress: "27 Raglan Street, Manly NSW 2095",
    suburb: "Manly",
    tenantName: "Robert Taylor",
    tenantPhone: "0433 444 555",
    tenantEmail: "robert.t@example.com.au",
    landlordName: "Lady Eleanor Sterling",
    landlordEmail: "eleanor.sterling@example.com.au",
    rentAmount: 2100,
    rentFrequency: "WEEKLY",
    bondAmount: 8400,
    bondReference: "RBB-NSW-889102",
    leaseStartDate: new Date("2025-09-15"),
    leaseEndDate: new Date(Date.now() + 86400000 * 22), // 22 Days remaining = 30-Day Alert
    paidToDate: new Date(Date.now() + 86400000 * 5),
    rentStatus: "PAID_UP_TO_DATE",
    renewalAlert: "ALERT_30_DAYS",
    daysRemaining: 22,
    notes: "Lease expiring soon. Sent 30-day renewal agreement offer at $2,250/wk.",
  },
  {
    id: "lease-1002",
    propertyId: "mri-vlt-1005",
    propertyAddress: "15/100 Barangaroo Avenue, Barangaroo NSW 2000",
    suburb: "Barangaroo",
    tenantName: "Samantha Reed",
    tenantPhone: "0422 111 888",
    tenantEmail: "samantha.reed@example.com.au",
    landlordName: "Barangaroo Holdings Pty Ltd",
    landlordEmail: "holdings@barangaroo.example.com",
    rentAmount: 3500,
    rentFrequency: "WEEKLY",
    bondAmount: 14000,
    bondReference: "RBB-NSW-991042",
    leaseStartDate: new Date("2025-11-01"),
    leaseEndDate: new Date(Date.now() + 86400000 * 54), // 54 Days remaining = 60-Day Alert
    paidToDate: new Date(Date.now() + 86400000 * 2),
    rentStatus: "PAID_UP_TO_DATE",
    renewalAlert: "ALERT_60_DAYS",
    daysRemaining: 54,
    notes: "60-day review phase. Rent increase appraisal underway.",
  },
  {
    id: "lease-1003",
    propertyId: "mri-vlt-1006",
    propertyAddress: "42 Military Road, Mosman NSW 2088",
    suburb: "Mosman",
    tenantName: "Michael Chang",
    tenantPhone: "0411 999 444",
    tenantEmail: "michael.c@example.com.au",
    landlordName: "Dr. Arthur Pendelton",
    landlordEmail: "arthur.p@example.com.au",
    rentAmount: 1800,
    rentFrequency: "WEEKLY",
    bondAmount: 7200,
    bondReference: "RBB-NSW-334102",
    leaseStartDate: new Date("2025-12-10"),
    leaseEndDate: new Date(Date.now() + 86400000 * 85), // 85 Days remaining = 90-Day Alert
    paidToDate: new Date(Date.now() - 86400000 * 4), // 4 days arrears
    rentStatus: "ARREARS_3_DAYS",
    renewalAlert: "ALERT_90_DAYS",
    daysRemaining: 85,
    notes: "Automated SMS rent reminder sent for 4-day arrears.",
  },
];

export const MOCK_INSPECTIONS: RoutineInspectionReport[] = [
  {
    id: "insp-1001",
    leaseId: "lease-1001",
    propertyAddress: "27 Raglan Street, Manly NSW 2095",
    tenantName: "Robert Taylor",
    inspectorName: "Oliver Sterling (Property Manager)",
    inspectionDate: new Date(Date.now() - 86400000 * 5),
    overallCondition: "EXCELLENT",
    roomItems: [
      { roomName: "Entrance & Hallway", wallsRating: "CLEAN_UNDAMAGED", floorsRating: "CLEAN_UNDAMAGED", windowsRating: "CLEAN_UNDAMAGED", fixturesRating: "CLEAN_UNDAMAGED", comments: "Spotless entry." },
      { roomName: "Kitchen & Dining", wallsRating: "CLEAN_UNDAMAGED", floorsRating: "CLEAN_UNDAMAGED", windowsRating: "CLEAN_UNDAMAGED", fixturesRating: "CLEAN_UNDAMAGED", comments: "Stone benchtop clean, stainless steel appliances pristine." },
      { roomName: "Living Room", wallsRating: "CLEAN_UNDAMAGED", floorsRating: "CLEAN_UNDAMAGED", windowsRating: "CLEAN_UNDAMAGED", fixturesRating: "CLEAN_UNDAMAGED", comments: "Hardwood floors well maintained." },
      { roomName: "Master Bathroom", wallsRating: "CLEAN_UNDAMAGED", floorsRating: "FAIR", windowsRating: "CLEAN_UNDAMAGED", fixturesRating: "MAINTENANCE_REQUIRED", comments: "Minor shower seal wear noticed. Recommended re-sealing." },
    ],
    generalNotes: "Tenant maintains property in exceptional order. Highly recommended for lease renewal.",
    inspectorSignedAt: new Date(Date.now() - 86400000 * 5),
    tenantSignedAt: new Date(Date.now() - 86400000 * 5),
  },
];

export const MOCK_WORK_ORDERS: TradeWorkOrder[] = [
  {
    id: "wo-1001",
    workOrderNumber: "WO-2026-4412",
    leaseId: "lease-1001",
    propertyAddress: "27 Raglan Street, Manly NSW 2095",
    title: "Shower Recaulking & Silicone Seal Renewal",
    description: "Re-caulk master bathroom shower enclosure silicone seal to prevent water seepage behind tiles.",
    category: "PLUMBING",
    priority: "ROUTINE",
    status: "WORK_ORDER_DISPATCHED",
    contractorName: "Manly Plumbing & Gas Services",
    contractorEmail: "jobs@manlyplumbing.example.com.au",
    contractorPhone: "0412 888 999",
    authorizedCostLimit: 350,
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "wo-1002",
    workOrderNumber: "WO-2026-4413",
    leaseId: "lease-1003",
    propertyAddress: "42 Military Road, Mosman NSW 2088",
    title: "Emergency Hot Water System Thermostat Repair",
    description: "Tenant reported zero hot water supply. Thermostat or heating element requires immediate inspection.",
    category: "PLUMBING",
    priority: "EMERGENCY",
    status: "ACCEPTED",
    contractorName: "Mosman Express Plumbers",
    contractorEmail: "dispatch@mosmanplumbing.example.com.au",
    contractorPhone: "0418 777 666",
    authorizedCostLimit: 850,
    createdAt: new Date(Date.now() - 86400000 * 1),
  },
];

/**
 * Calculates tenancy summary metrics.
 */
export function getTenancySummary(leases: TenantLeaseRecord[] = MOCK_LEASES) {
  const totalWeeklyRent = leases.reduce((acc, l) => acc + l.rentAmount, 0);
  const totalMonthlyRent = totalWeeklyRent * 4.333;
  const alert30Count = leases.filter((l) => l.renewalAlert === "ALERT_30_DAYS").length;
  const alert60Count = leases.filter((l) => l.renewalAlert === "ALERT_60_DAYS").length;
  const alert90Count = leases.filter((l) => l.renewalAlert === "ALERT_90_DAYS").length;
  const arrearsCount = leases.filter((l) => l.rentStatus.startsWith("ARREARS")).length;

  return {
    totalLeasesCount: leases.length,
    totalWeeklyRent,
    totalMonthlyRent,
    alert30Count,
    alert60Count,
    alert90Count,
    arrearsCount,
  };
}

/**
 * Generates statutory Routine Inspection Report HTML for printing.
 */
export function generateInspectionReportHtml(report: RoutineInspectionReport): string {
  const rowsXml = report.roomItems
    .map(
      (item) => `
    <tr>
      <td style="font-weight: bold;">${item.roomName}</td>
      <td>${item.wallsRating.replace("_", " ")}</td>
      <td>${item.floorsRating.replace("_", " ")}</td>
      <td>${item.windowsRating.replace("_", " ")}</td>
      <td>${item.fixturesRating.replace("_", " ")}</td>
      <td>${item.comments || "N/A"}</td>
    </tr>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Routine Inspection Report — ${report.propertyAddress}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; font-size: 12px; color: #0f172a; margin: 40px; }
    .header { border-bottom: 2px solid #071325; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; }
    .brand { font-size: 18px; font-weight: bold; color: #071325; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; margin-bottom: 15px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .table th { background: #071325; color: #fff; text-align: left; padding: 8px; font-size: 11px; }
    .table td { padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
    .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 40px; }
    .sig-box { border-top: 1px solid #000; padding-top: 5px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">${AGENCY_LEGAL_NAME}</div>
      <div>Property Management Division | ABN ${AGENCY_ABN}</div>
    </div>
    <div style="text-align: right;">
      <h2 style="margin:0; color:#c5a059;">ROUTINE CONDITION REPORT</h2>
      <div>Date: ${new Date(report.inspectionDate).toLocaleDateString("en-AU")}</div>
    </div>
  </div>

  <div class="grid">
    <div class="box">
      <strong>PROPERTY ADDRESS:</strong><br>${report.propertyAddress}<br><br>
      <strong>TENANT NAME:</strong> ${report.tenantName}
    </div>
    <div class="box">
      <strong>INSPECTOR:</strong> ${report.inspectorName}<br><br>
      <strong>OVERALL CONDITION:</strong> <span style="font-weight:bold; color:#059669;">${report.overallCondition}</span>
    </div>
  </div>

  <table class="table">
    <thead>
      <tr>
        <th>Room / Area</th>
        <th>Walls</th>
        <th>Floors</th>
        <th>Windows</th>
        <th>Fixtures</th>
        <th>Inspector Comments</th>
      </tr>
    </thead>
    <tbody>
      ${rowsXml}
    </tbody>
  </table>

  <div class="box" style="margin-top: 20px;">
    <strong>GENERAL NOTES & RECOMMENDATIONS:</strong><br>
    ${report.generalNotes || "No further action required."}
  </div>

  <div class="sig-grid">
    <div class="sig-box">
      Inspector Signature: ${report.inspectorName}<br>
      Signed At: ${report.inspectorSignedAt ? new Date(report.inspectorSignedAt).toLocaleString("en-AU") : "Pending"}
    </div>
    <div class="sig-box">
      Tenant Acknowledgment Signature: ${report.tenantName}<br>
      Signed At: ${report.tenantSignedAt ? new Date(report.tenantSignedAt).toLocaleString("en-AU") : "Pending"}
    </div>
  </div>
</body>
</html>`;
}
