/**
 * Statutory Trust Accounting Engine
 * Compliant with Australian State Real Estate Legislation
 * (e.g. NSW Property and Stock Agents Act 2002, VIC Estate Agents Act 1980).
 */

import { AGENCY_NAME, AGENCY_LEGAL_NAME, AGENCY_ABN, AGENCY_LICENCE, AGENCY_PHONE } from "../agency-config";

export type TrustDepositType = "HOLDING_DEPOSIT" | "FULL_DEPOSIT" | "BALANCE_DEPOSIT" | "RENTAL_BOND";
export type TrustPaymentMethod = "EFT" | "BANK_CHEQUE" | "TRUST_TRANSFER" | "DEPOSIT_BOND";
export type TrustTransactionStatus = "HELD" | "RECONCILED" | "DISBURSED" | "REFUNDED";

export interface TrustReceiptItem {
  id: string;
  receiptNumber: string; // TAR-2026-XXXX format
  propertyId: string;
  propertyAddress: string;
  payerName: string;
  payerRole: "BUYER" | "TENANT" | "VENDOR";
  amount: number;
  depositType: TrustDepositType;
  paymentMethod: TrustPaymentMethod;
  bankReference: string;
  receivedAt: Date;
  status: TrustTransactionStatus;
  isReconciled: boolean;
  reconciledAt?: Date;
  disbursedAt?: Date;
  disbursedToName?: string;
  notes?: string;
}

export const MOCK_TRUST_RECEIPTS: TrustReceiptItem[] = [
  {
    id: "trust-1001",
    receiptNumber: "TAR-2026-8812",
    propertyId: "mri-vlt-1001",
    propertyAddress: "142 Church Street, Parramatta NSW 2150",
    payerName: "David Miller",
    payerRole: "BUYER",
    amount: 148000,
    depositType: "FULL_DEPOSIT",
    paymentMethod: "EFT",
    bankReference: "EFT-889102-MILLER",
    receivedAt: new Date(Date.now() - 86400000 * 3),
    status: "RECONCILED",
    isReconciled: true,
    reconciledAt: new Date(Date.now() - 86400000 * 2),
    notes: "10% contract deposit received into Westpac Statutory Trust Account.",
  },
  {
    id: "trust-1002",
    receiptNumber: "TAR-2026-8813",
    propertyId: "mri-vlt-1002",
    propertyAddress: "88 Ocean Drive, Bondi Beach NSW 2026",
    payerName: "Sophie Zhang",
    payerRole: "BUYER",
    amount: 285000,
    depositType: "FULL_DEPOSIT",
    paymentMethod: "EFT",
    bankReference: "EFT-991042-ZHANG",
    receivedAt: new Date(Date.now() - 86400000 * 5),
    status: "HELD",
    isReconciled: true,
    reconciledAt: new Date(Date.now() - 86400000 * 4),
    notes: "10% auction deposit held pending settlement.",
  },
  {
    id: "trust-1003",
    receiptNumber: "TAR-2026-8814",
    propertyId: "mri-vlt-1003",
    propertyAddress: "27 Raglan Street, Manly NSW 2095",
    payerName: "Robert Taylor",
    payerRole: "TENANT",
    amount: 8400,
    depositType: "RENTAL_BOND",
    paymentMethod: "EFT",
    bankReference: "BOND-771029-TAYLOR",
    receivedAt: new Date(Date.now() - 86400000 * 7),
    status: "RECONCILED",
    isReconciled: true,
    reconciledAt: new Date(Date.now() - 86400000 * 6),
    notes: "4 weeks rental bond lodged for Manly tenancy.",
  },
  {
    id: "trust-1004",
    receiptNumber: "TAR-2026-8815",
    propertyId: "mri-vlt-1004",
    propertyAddress: "12/45 Spit Road, Mosman NSW 2088",
    payerName: "Harrison Vance",
    payerRole: "BUYER",
    amount: 5000,
    depositType: "HOLDING_DEPOSIT",
    paymentMethod: "EFT",
    bankReference: "EFT-112049-VANCE",
    receivedAt: new Date(Date.now() - 86400000 * 1),
    status: "HELD",
    isReconciled: false,
    notes: "Initial holding deposit subject to cooling-off period.",
  },
];

/**
 * Calculates trust account summary metrics.
 */
export function getTrustAccountSummary(receipts: TrustReceiptItem[] = MOCK_TRUST_RECEIPTS) {
  const totalHeld = receipts
    .filter((r) => r.status === "HELD" || r.status === "RECONCILED")
    .reduce((acc, r) => acc + r.amount, 0);

  const totalReconciled = receipts
    .filter((r) => r.isReconciled)
    .reduce((acc, r) => acc + r.amount, 0);

  const unreconciledCount = receipts.filter((r) => !r.isReconciled).length;
  const holdingDepositsCount = receipts.filter((r) => r.depositType === "HOLDING_DEPOSIT").length;

  return {
    totalHeld,
    totalReconciled,
    unreconciledCount,
    holdingDepositsCount,
    totalTransactions: receipts.length,
  };
}

/**
 * Generates a formatted statutory HTML/Text Trust Receipt for printing.
 */
export function generateStatutoryTrustReceiptHtml(receipt: TrustReceiptItem): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Statutory Trust Receipt ${receipt.receiptNumber}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; font-size: 13px; color: #0f172a; margin: 40px; }
    .header { border-bottom: 2px solid #071325; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; }
    .brand { font-[#071325]; font-size: 20px; font-weight: bold; }
    .title { font-size: 16px; font-weight: bold; color: #b38b38; text-align: right; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .table th { background: #071325; color: #fff; text-align: left; padding: 8px 12px; }
    .table td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
    .amount { font-size: 18px; font-weight: bold; color: #071325; text-align: right; }
    .footer { margin-top: 40px; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">${AGENCY_LEGAL_NAME}</div>
      <div>ABN: ${AGENCY_ABN} | Licence: ${AGENCY_LICENCE}</div>
      <div>Phone: ${AGENCY_PHONE}</div>
    </div>
    <div class="title">
      STATUTORY TRUST RECEIPT<br>
      <span style="font-size: 12px; font-family: monospace;">${receipt.receiptNumber}</span>
    </div>
  </div>

  <div class="grid">
    <div class="box">
      <strong>RECEIVED FROM (PAYER):</strong><br>
      ${receipt.payerName} (${receipt.payerRole})<br>
      Bank Ref: ${receipt.bankReference}
    </div>
    <div class="box">
      <strong>TRANSACTION DETAILS:</strong><br>
      Date Received: ${new Date(receipt.receivedAt).toLocaleDateString("en-AU")}<br>
      Payment Method: ${receipt.paymentMethod}<br>
      Status: ${receipt.status}
    </div>
  </div>

  <div class="box">
    <strong>PROPERTY ADDRESS:</strong><br>
    ${receipt.propertyAddress}
  </div>

  <table class="table">
    <thead>
      <tr>
        <th>Description</th>
        <th>Deposit Type</th>
        <th style="text-align: right;">Amount (AUD)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${receipt.notes || "Trust Account Deposit"}</td>
        <td>${receipt.depositType.replace("_", " ")}</td>
        <td class="amount">$${receipt.amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <p>This is an official statutory trust receipt issued pursuant to Australian Real Estate Trust Account Regulations.</p>
    <p>Account: ${AGENCY_LEGAL_NAME} Statutory Client Trust Account | Westpac Banking Corporation</p>
  </div>
</body>
</html>`;
}
