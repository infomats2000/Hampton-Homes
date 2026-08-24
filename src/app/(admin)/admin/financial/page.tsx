"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  Building2,
  FileText,
  Calculator,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Download,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Search,
  Filter,
  Check,
  Sparkles,
  Users,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  MOCK_TRUST_RECEIPTS,
  TrustReceiptItem,
  getTrustAccountSummary,
  generateStatutoryTrustReceiptHtml,
} from "@/lib/financial/trust-accounting";
import {
  MOCK_COMMISSION_STATEMENTS,
  calculateCommissionBreakdown,
  CommissionBreakdownResult,
} from "@/lib/financial/commission-calculator";
import {
  MOCK_SETTLEMENT_DEALS,
  SettlementDeal,
  getDaysToSettlement,
  getSettlementPipelineSummary,
} from "@/lib/financial/settlement-tracker";

export default function AdminFinancialPage() {
  const [activeTab, setActiveTab] = useState<"TRUST" | "COMMISSION" | "SETTLEMENT">("TRUST");
  const [trustReceipts, setTrustReceipts] = useState<TrustReceiptItem[]>(MOCK_TRUST_RECEIPTS);
  const [settlementDeals] = useState<SettlementDeal[]>(MOCK_SETTLEMENT_DEALS);

  // Trust Deposit Drawer State
  const [showLogDepositModal, setShowLogDepositModal] = useState(false);
  const [logSuccessMessage, setLogSuccessMessage] = useState<string | null>(null);
  const [newDeposit, setNewDeposit] = useState({
    payerName: "",
    payerRole: "BUYER" as const,
    propertyAddress: "142 Church Street, Parramatta NSW 2150",
    amount: "10000",
    depositType: "HOLDING_DEPOSIT" as const,
    paymentMethod: "EFT" as const,
    bankReference: "EFT-" + Math.floor(100000 + Math.random() * 900000),
    notes: "",
  });

  // Commission Calculator Interactive State
  const [calcSalePrice, setCalcSalePrice] = useState<number>(1850000);
  const [calcCommRate, setCalcCommRate] = useState<number>(2.2);
  const [calcFranchiseRoyalty, setCalcFranchiseRoyalty] = useState<number>(8.0);
  const [calcListingSplit, setCalcListingSplit] = useState<number>(40.0);
  const [calcSellingSplit, setCalcSellingSplit] = useState<number>(35.0);
  const [calcReferralFee, setCalcReferralFee] = useState<number>(0.0);

  const calcResult: CommissionBreakdownResult = calculateCommissionBreakdown({
    salePrice: calcSalePrice,
    commissionRatePercent: calcCommRate,
    franchiseRoyaltyPercent: calcFranchiseRoyalty,
    listingAgentSplitPercent: calcListingSplit,
    sellingAgentSplitPercent: calcSellingSplit,
    externalReferralFeePercent: calcReferralFee,
  });

  const trustSummary = getTrustAccountSummary(trustReceipts);
  const settlementSummary = getSettlementPipelineSummary(settlementDeals);

  const handlePrintReceipt = (receipt: TrustReceiptItem) => {
    const html = generateStatutoryTrustReceiptHtml(receipt);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.print();
    }
  };

  const handleCreateDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReceipt: TrustReceiptItem = {
      id: `trust-${Date.now()}`,
      receiptNumber: `TAR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      propertyId: "mri-vlt-1001",
      propertyAddress: newDeposit.propertyAddress,
      payerName: newDeposit.payerName || "Anonymous Payer",
      payerRole: newDeposit.payerRole,
      amount: Number(newDeposit.amount) || 5000,
      depositType: newDeposit.depositType,
      paymentMethod: newDeposit.paymentMethod,
      bankReference: newDeposit.bankReference,
      receivedAt: new Date(),
      status: "HELD",
      isReconciled: false,
      notes: newDeposit.notes || "Trust account deposit logged via financial dashboard.",
    };

    setTrustReceipts([newReceipt, ...trustReceipts]);
    setShowLogDepositModal(false);
    setLogSuccessMessage(`Statutory Trust Receipt ${newReceipt.receiptNumber} generated successfully!`);
    setTimeout(() => setLogSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-8 max-w-7xl">

      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-[#0a192f] text-[#c5a059]">
              <DollarSign className="h-5 w-5" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">Trust Accounting &amp; Financial Engine</h1>
            <Badge variant="gold">Section 58 Statutory Compliant</Badge>
          </div>
          <p className="text-sm text-slate-500">
            Statutory client trust account ledger, multi-tier agent commission splits with 10% GST, and settlement milestone matrix.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => setActiveTab("COMMISSION")} className="text-xs gap-1.5 border-slate-300">
            <Calculator className="h-3.5 w-3.5" />
            Commission Calculator
          </Button>
          <Button variant="gold" size="sm" onClick={() => setShowLogDepositModal(true)} className="text-xs gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Log Trust Deposit
          </Button>
        </div>
      </div>

      {/* ── Success Alert ──────────────────────────────────────────── */}
      {logSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>{logSuccessMessage}</span>
        </div>
      )}

      {/* ── Top Financial Metric Cards ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200">
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Statutory Trust Held</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <p className="font-serif text-2xl font-bold text-slate-900">
              ${trustSummary.totalHeld.toLocaleString("en-AU")}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              {trustSummary.totalTransactions} Total Trust Receipts | Westpac Trust Account
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">YTD Gross Commission</span>
              <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="font-serif text-2xl font-bold text-slate-900">
              $138,160.00
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              Inc. $12,560.00 GST | Avg Rate 2.2%
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Pending Settlement Volume</span>
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <p className="font-serif text-2xl font-bold text-slate-900">
              ${(settlementSummary.totalVolume / 1000000).toFixed(2)}M
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              {settlementSummary.totalPendingDeals} Sales Contracts | {settlementSummary.unconditionalCount} Unconditional
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Net Agency Retention</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <p className="font-serif text-2xl font-bold text-slate-900">
              $41,448.00
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              After Agent Splits (75%) &amp; Royalty (8%)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Tab Navigation ────────────────────────────────────── */}
      <div className="border-b border-slate-200 flex gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("TRUST")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "TRUST"
              ? "border-[#c5a059] text-[#0a192f]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-[#c5a059]" />
          <span>Statutory Trust Account Ledger</span>
          <Badge variant="outline" className="text-[10px] bg-slate-100 font-mono">
            {trustReceipts.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("COMMISSION")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "COMMISSION"
              ? "border-[#c5a059] text-[#0a192f]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calculator className="h-4 w-4 text-[#c5a059]" />
          <span>Commission Split &amp; GST Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab("SETTLEMENT")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "SETTLEMENT"
              ? "border-[#c5a059] text-[#0a192f]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calendar className="h-4 w-4 text-[#c5a059]" />
          <span>Settlement Milestone Matrix</span>
          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 font-bold border-emerald-200">
            {settlementDeals.length} Deals
          </Badge>
        </button>
      </div>

      {/* ── TAB 1: STATUTORY TRUST ACCOUNT LEDGER ─────────────────── */}
      {activeTab === "TRUST" && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-serif flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#c5a059]" />
                  <span>Statutory Client Trust Account Journal</span>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Westpac Statutory Real Estate Trust Account • Account BSB: 032-000 | Account No: 123456
                </CardDescription>
              </div>

              <Button variant="gold" size="sm" onClick={() => setShowLogDepositModal(true)} className="text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                <span>Log New Trust Deposit</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200 whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-4">Receipt No</th>
                    <th className="py-3 px-4">Date Received</th>
                    <th className="py-3 px-4">Payer / Customer</th>
                    <th className="py-3 px-4">Property Address</th>
                    <th className="py-3 px-4">Deposit Type</th>
                    <th className="py-3 px-4 font-mono">Amount (AUD)</th>
                    <th className="py-3 px-4">Reconciliation</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {trustReceipts.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#0a192f]">
                        {r.receiptNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(r.receivedAt).toLocaleDateString("en-AU")}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{r.payerName}</p>
                        <p className="text-[10px] text-slate-400">{r.payerRole}</p>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                        {r.propertyAddress}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {r.depositType.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                        ${r.amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">
                        {r.isReconciled ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" /> Reconciled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Clock className="h-3 w-3" /> Pending Bank
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePrintReceipt(r)}
                          className="h-8 px-2 text-xs gap-1 text-slate-600 hover:text-slate-900"
                        >
                          <Printer className="h-3.5 w-3.5 text-[#c5a059]" />
                          <span>Print Receipt</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── TAB 2: INTERACTIVE COMMISSION SPLIT & GST CALCULATOR ──── */}
      {activeTab === "COMMISSION" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Inputs Card */}
          <Card className="lg:col-span-1 border-l-4 border-l-[#c5a059]">
            <CardHeader>
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#c5a059]" />
                <span>Commission Calculator Parameters</span>
              </CardTitle>
              <CardDescription className="text-xs">Adjust sale price, commission rates, franchise royalties, and agent splits.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold flex justify-between">
                  <span>Property Sale Price (AUD)</span>
                  <span className="font-mono text-[#c5a059] font-bold">${calcSalePrice.toLocaleString("en-AU")}</span>
                </label>
                <input
                  type="number"
                  step="50000"
                  value={calcSalePrice}
                  onChange={(e) => setCalcSalePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold flex justify-between">
                  <span>Gross Commission Rate (%)</span>
                  <span className="font-mono text-slate-900">{calcCommRate}%</span>
                </label>
                <input
                  type="range"
                  min="1.0"
                  max="4.0"
                  step="0.1"
                  value={calcCommRate}
                  onChange={(e) => setCalcCommRate(Number(e.target.value))}
                  className="w-full accent-[#c5a059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Franchise Royalty %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcFranchiseRoyalty}
                    onChange={(e) => setCalcFranchiseRoyalty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Referral Fee %</label>
                  <input
                    type="number"
                    step="1"
                    value={calcReferralFee}
                    onChange={(e) => setCalcReferralFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Listing Agent Split %</label>
                  <input
                    type="number"
                    step="5"
                    value={calcListingSplit}
                    onChange={(e) => setCalcListingSplit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Selling Agent Split %</label>
                  <input
                    type="number"
                    step="5"
                    value={calcSellingSplit}
                    onChange={(e) => setCalcSellingSplit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Results Grid */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#071325] text-white shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-serif flex items-center justify-between">
                  <span>Commission &amp; GST Payout Breakdown</span>
                  <Badge variant="gold">10% GST Applied</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Gross Commission (Inc. GST)</p>
                    <p className="font-serif text-2xl font-bold text-[#c5a059]">
                      ${calcResult.grossCommissionTotal.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">10% Australian GST (Tax)</p>
                    <p className="font-mono text-xl font-bold text-slate-300">
                      ${calcResult.gstAmount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Net Commission (Ex. GST)</p>
                    <p className="font-mono text-xl font-bold text-slate-300">
                      ${calcResult.netCommissionExGst.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Agent Splits Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-900">
                  <div className="p-4 rounded-xl bg-white space-y-1">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Listing Agent ({calcListingSplit}%)</p>
                    <p className="font-serif text-lg font-bold text-emerald-700">
                      ${calcResult.listingAgentPayout.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[9px] text-slate-400">Direct agent payout</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white space-y-1">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Selling Agent ({calcSellingSplit}%)</p>
                    <p className="font-serif text-lg font-bold text-emerald-700">
                      ${calcResult.sellingAgentPayout.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[9px] text-slate-400">Buyer agent payout</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-100 space-y-1 border border-slate-300">
                    <p className="text-[10px] font-bold uppercase text-slate-600">House Retention (Net)</p>
                    <p className="font-serif text-lg font-bold text-[#0a192f]">
                      ${calcResult.houseRetention.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[9px] text-slate-500">Agency profit margin</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Commission Statements Table */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-serif font-bold">Recent Agent Commission Statements</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200 whitespace-nowrap">
                      <tr>
                        <th className="py-2.5 px-4">Agent Name</th>
                        <th className="py-2.5 px-4">Property</th>
                        <th className="py-2.5 px-4">Role</th>
                        <th className="py-2.5 px-4 font-mono">Gross Comm</th>
                        <th className="py-2.5 px-4 font-mono">Agent Payout</th>
                        <th className="py-2.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {MOCK_COMMISSION_STATEMENTS.map((c) => (
                        <tr key={c.id}>
                          <td className="py-2.5 px-4 font-bold text-slate-900">{c.agentName}</td>
                          <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate">{c.propertyAddress}</td>
                          <td className="py-2.5 px-4 text-[10px] font-bold">{c.agentRole.replace("_", " ")}</td>
                          <td className="py-2.5 px-4 font-mono text-slate-900">${c.grossCommission.toLocaleString()}</td>
                          <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">${c.agentPayout.toLocaleString()}</td>
                          <td className="py-2.5 px-4">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-bold ${
                                c.status === "PAID"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {c.status.replace("_", " ")}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB 3: SETTLEMENT MILESTONE MATRIX ────────────────────── */}
      {activeTab === "SETTLEMENT" && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-serif flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#c5a059]" />
                  <span>Contract Settlement Milestone Matrix</span>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Tracks statutory milestone progression from Exchange to Settlement Day for all active sales contracts.
                </CardDescription>
              </div>

              <Badge variant="gold">{settlementDeals.length} Deals in Progress</Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200 whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-4">Property / Deal</th>
                    <th className="py-3 px-4">Parties</th>
                    <th className="py-3 px-4 font-mono">Sale Price</th>
                    <th className="py-3 px-4">Deposit Status</th>
                    <th className="py-3 px-4">Milestone Progress</th>
                    <th className="py-3 px-4 font-mono">Days to Settlement</th>
                    <th className="py-3 px-4">Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {settlementDeals.map((deal) => {
                    const daysLeft = getDaysToSettlement(deal.settlementDate);
                    return (
                      <tr key={deal.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-serif font-bold text-slate-900">{deal.headline}</p>
                          <p className="text-[10px] text-slate-400">{deal.propertyAddress}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-slate-900"><strong>Vendor:</strong> {deal.vendorName}</p>
                          <p className="text-slate-500"><strong>Buyer:</strong> {deal.buyerName}</p>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          ${deal.salePrice.toLocaleString("en-AU")}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold ${
                              deal.depositStatus === "HELD"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            ${deal.depositAmount.toLocaleString()} ({deal.depositStatus})
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className={deal.coolingOffSatisfied ? "text-emerald-600 font-bold" : "text-slate-400"}>
                              Cooling-Off
                            </span>
                            <span>•</span>
                            <span className={deal.financeApproved ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                              Finance
                            </span>
                            <span>•</span>
                            <span className={deal.isUnconditional ? "text-emerald-600 font-bold" : "text-slate-400"}>
                              Unconditional
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span className="inline-flex items-center gap-1 font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                            <Clock className="h-3 w-3 text-[#c5a059]" />
                            {daysLeft} Days
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="gold"
                            className="text-[10px]"
                          >
                            {deal.stage.replace("_", " ")}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── MODAL: Log New Trust Deposit ──────────────────────────── */}
      {showLogDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 space-y-4">
            <div className="bg-[#071325] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#c5a059]" />
                <h3 className="font-serif font-bold text-base">Log Statutory Trust Deposit</h3>
              </div>
              <button
                onClick={() => setShowLogDepositModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-md bg-white/10"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateDeposit} className="p-6 space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Payer / Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Miller"
                  value={newDeposit.payerName}
                  onChange={(e) => setNewDeposit({ ...newDeposit, payerName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Payer Role</label>
                  <select
                    value={newDeposit.payerRole}
                    onChange={(e) => setNewDeposit({ ...newDeposit, payerRole: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="BUYER">Buyer</option>
                    <option value="TENANT">Tenant</option>
                    <option value="VENDOR">Vendor</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Deposit Type</label>
                  <select
                    value={newDeposit.depositType}
                    onChange={(e) => setNewDeposit({ ...newDeposit, depositType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="HOLDING_DEPOSIT">Holding Deposit</option>
                    <option value="FULL_DEPOSIT">10% Full Deposit</option>
                    <option value="BALANCE_DEPOSIT">Balance Deposit</option>
                    <option value="RENTAL_BOND">Rental Bond</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Deposit Amount (AUD) *</label>
                  <input
                    type="number"
                    required
                    value={newDeposit.amount}
                    onChange={(e) => setNewDeposit({ ...newDeposit, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Payment Method</label>
                  <select
                    value={newDeposit.paymentMethod}
                    onChange={(e) => setNewDeposit({ ...newDeposit, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="EFT">Electronic Funds Transfer (EFT)</option>
                    <option value="BANK_CHEQUE">Bank Cheque</option>
                    <option value="TRUST_TRANSFER">Trust Transfer</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Bank Reference Number</label>
                <input
                  type="text"
                  value={newDeposit.bankReference}
                  onChange={(e) => setNewDeposit({ ...newDeposit, bankReference: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Property Address</label>
                <input
                  type="text"
                  value={newDeposit.propertyAddress}
                  onChange={(e) => setNewDeposit({ ...newDeposit, propertyAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <Button type="submit" variant="gold" size="lg" className="w-full text-xs font-bold gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Issue Statutory Trust Receipt</span>
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
