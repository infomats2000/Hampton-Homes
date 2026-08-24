"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Building2,
  DollarSign,
  FileText,
  KeyRound,
  Wrench,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_XERO_STATUS,
  MOCK_XERO_MAPPINGS,
  MOCK_XERO_SYNC_RECORDS,
  XeroSyncRecord,
  XeroAccountMapping,
} from "@/lib/integrations/xero/xero-service";

export default function XeroIntegrationPage() {
  const [syncRecords, setSyncRecords] = useState<XeroSyncRecord[]>(MOCK_XERO_SYNC_RECORDS);
  const [mappings, setMappings] = useState<XeroAccountMapping>(MOCK_XERO_MAPPINGS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("ALL");
  const [autoSync, setAutoSync] = useState(true);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncSuccessMsg("");
    try {
      const res = await fetch("/api/integrations/xero/sync", { method: "POST" });
      const data = await res.json();
      if (data.success && data.result.newRecords) {
        setSyncRecords([...data.result.newRecords, ...syncRecords]);
        setSyncSuccessMsg(`Successfully synced 1 new transaction ($${data.result.totalGrossSynced.toLocaleString("en-AU")}) to Xero!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredRecords = syncRecords.filter((rec) => {
    if (moduleFilter !== "ALL" && rec.sourceModule !== moduleFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        rec.contactName.toLowerCase().includes(term) ||
        rec.xeroInvoiceNumber.toLowerCase().includes(term) ||
        rec.sourceId.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const totalGross = syncRecords.reduce((acc, r) => acc + r.grossAmount, 0);
  const totalGst = syncRecords.reduce((acc, r) => acc + r.gstAmount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/integrations" className="text-xs font-medium text-slate-500 hover:text-slate-800">
              Integrations Hub
            </Link>
            <span className="text-slate-400">/</span>
            <Badge variant="gold">Official Integration</Badge>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#0a192f] mt-1.5 flex items-center gap-3">
            <span>Xero Accounting Automated 2-Way Sync</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time Australian statutory sync for Sales Commissions, 10% GST, Trust Account Receipts, Landlord Fees &amp; Trade Bills.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="gold"
            size="lg"
            disabled={isSyncing}
            onClick={handleManualSync}
            className="gap-2 text-xs font-bold shadow-md"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing to Xero..." : "Sync Now to Xero"}</span>
          </Button>
        </div>
      </div>

      {syncSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{syncSuccessMsg}</span>
          </div>
          <button onClick={() => setSyncSuccessMsg("")} className="text-emerald-500 hover:text-emerald-700">✕</button>
        </div>
      )}

      {/* OAuth Connection Status & Auto-Sync Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border border-slate-200 lg:col-span-2 shadow-xs">
          <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center font-bold text-lg">
                X
              </div>
              <div>
                <CardTitle className="text-base font-serif text-[#0a192f]">
                  {MOCK_XERO_STATUS.tenantName}
                </CardTitle>
                <p className="text-xs text-slate-500 font-mono">Tenant ID: {MOCK_XERO_STATUS.tenantId}</p>
              </div>
            </div>

            <Badge variant="sale" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
              🟢 CONNECTED &amp; ACTIVE
            </Badge>
          </CardHeader>

          <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <p className="text-slate-500 font-semibold uppercase text-[10px]">Last Batch Sync</p>
              <p className="font-mono font-bold text-slate-800">
                {new Date(MOCK_XERO_STATUS.lastSyncedAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="text-[10px] text-emerald-600 font-medium">Auto-triggered via API</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <p className="text-slate-500 font-semibold uppercase text-[10px]">OAuth 2.0 Token</p>
              <p className="font-mono font-bold text-emerald-700">Valid (30 Days)</p>
              <p className="text-[10px] text-slate-400">Auto-refreshed seamlessly</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <p className="text-slate-500 font-semibold uppercase text-[10px]">Total Synced Volume</p>
              <p className="font-mono font-bold text-[#0a192f]">
                ${totalGross.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">Includes ${totalGst.toLocaleString("en-AU")} GST</p>
            </div>
          </CardContent>
        </Card>

        {/* Auto-Sync Toggle Control */}
        <Card className="border border-slate-200 shadow-xs flex flex-col justify-between">
          <CardHeader className="p-5 border-b border-slate-100">
            <CardTitle className="text-base font-serif text-[#0a192f]">
              Automated Background Sync
            </CardTitle>
            <p className="text-xs text-slate-500">
              Sync transactions instantly when approved or every 15 minutes.
            </p>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-800">Auto-Sync Engine</p>
                <p className="text-[10px] text-slate-500">Interval: Every 15 minutes</p>
              </div>
              <button
                onClick={() => setAutoSync(!autoSync)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  autoSync ? "bg-emerald-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    autoSync ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="text-[11px] text-slate-600 space-y-1">
              <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <Check className="h-3.5 w-3.5" />
                <span>GST ($ / 11) auto-calculated for ATO BAS lodgement</span>
              </p>
              <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <Check className="h-3.5 w-3.5" />
                <span>Statutory Trust receipts tagged as non-taxable liability</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4 Automatic Module Sync Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">ACCREC</Badge>
          </div>
          <h3 className="font-serif font-bold text-sm text-[#0a192f]">Sales Commissions</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Syncs gross commission, 10% Australian GST ($ / 11), 8% franchise royalties, and agent split expenses.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">TRUST</Badge>
          </div>
          <h3 className="font-serif font-bold text-sm text-[#0a192f]">Statutory Trust Account</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Syncs client holding deposits, 10% contract balance deposits, and vendor disbursements to Xero Bank Statements.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <KeyRound className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">210 FEE</Badge>
          </div>
          <h3 className="font-serif font-bold text-sm text-[#0a192f]">Property Management</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Syncs monthly rent collected, 5.5% management fee income, and landlord monthly statement disbursements.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Wrench className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">ACCPAY</Badge>
          </div>
          <h3 className="font-serif font-bold text-sm text-[#0a192f]">Trade Work Orders</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Syncs plumbing, electrical, and locksmith contractor repair bills directly into Xero Accounts Payable with ABNs.
          </p>
        </div>
      </div>

      {/* Chart of Accounts Mapping Section */}
      <Card className="border border-slate-200 shadow-xs">
        <CardHeader className="p-5 border-b border-slate-100">
          <CardTitle className="text-base font-serif text-[#0a192f]">
            Xero Chart of Accounts (COA) Account Mapping
          </CardTitle>
          <p className="text-xs text-slate-500">
            Map Infomats Real Estate ERP financial categories to your agency&apos;s Xero ledger accounts.
          </p>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label htmlFor="coa-commission" className="font-bold text-slate-700">Sales Commission Revenue</label>
              <input
                id="coa-commission"
                type="text"
                value={mappings.salesCommissionAccount}
                onChange={e => setMappings({ ...mappings, salesCommissionAccount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="coa-trust" className="font-bold text-slate-700">Statutory Trust Account Liability</label>
              <input
                id="coa-trust"
                type="text"
                value={mappings.trustAccountLiability}
                onChange={e => setMappings({ ...mappings, trustAccountLiability: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="coa-pm" className="font-bold text-slate-700">Property Management Fee Income</label>
              <input
                id="coa-pm"
                type="text"
                value={mappings.managementFeeAccount}
                onChange={e => setMappings({ ...mappings, managementFeeAccount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="coa-royalty" className="font-bold text-slate-700">Franchise Royalty Expense</label>
              <input
                id="coa-royalty"
                type="text"
                value={mappings.franchiseRoyaltyAccount}
                onChange={e => setMappings({ ...mappings, franchiseRoyaltyAccount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="coa-agent" className="font-bold text-slate-700">Agent Commission Split Expense</label>
              <input
                id="coa-agent"
                type="text"
                value={mappings.agentSplitAccount}
                onChange={e => setMappings({ ...mappings, agentSplitAccount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Xero Audit Journal Table */}
      <Card className="border border-slate-200 shadow-xs">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-base font-serif text-[#0a192f]">
            Live Xero Sync Audit Journal
          </CardTitle>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                id="xero-search"
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search contact, invoice..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
              />
            </div>

            <select
              id="xero-module-filter"
              value={moduleFilter}
              onChange={e => setModuleFilter(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Modules</option>
              <option value="COMMISSION">Sales Commission</option>
              <option value="TRUST_ACCOUNT">Trust Account</option>
              <option value="PROPERTY_MANAGEMENT">Property Management</option>
              <option value="WORK_ORDER">Work Orders</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 whitespace-nowrap">
                <tr>
                  <th className="py-3 px-4">Xero Invoice #</th>
                  <th className="py-3 px-4">Module &amp; Reference</th>
                  <th className="py-3 px-4">Contact / Party Name</th>
                  <th className="py-3 px-4 text-right">Gross Amount</th>
                  <th className="py-3 px-4 text-right">GST (10%)</th>
                  <th className="py-3 px-4 text-right">Net Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Xero Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0a192f] whitespace-nowrap">
                      {rec.xeroInvoiceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px]">
                          {rec.sourceModule.replace("_", " ")}
                        </Badge>
                        <span className="font-mono text-[11px] text-slate-500">{rec.sourceId}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {rec.contactName}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      ${rec.grossAmount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-600">
                      ${rec.gstAmount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                      ${rec.netAmount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-[11px] font-bold border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        SYNCED
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {rec.xeroUrl ? (
                        <a
                          href={rec.xeroUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-800 hover:underline"
                        >
                          <span>Open in Xero</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
