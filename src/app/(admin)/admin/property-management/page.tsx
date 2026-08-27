"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  KeyRound,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Wrench,
  DollarSign,
  Plus,
  Printer,
  Send,
  UserCheck,
  ShieldCheck,
  Search,
  Filter,
  Check,
  MessageSquare,
  Sparkles,
  Award,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  MOCK_LEASES,
  MOCK_INSPECTIONS,
  MOCK_WORK_ORDERS,
  TenantLeaseRecord,
  RoutineInspectionReport,
  TradeWorkOrder,
  getTenancySummary,
  generateInspectionReportHtml,
} from "@/lib/tenancy/tenancy-service";

export default function AdminPropertyManagementPage() {
  const [activeTab, setActiveTab] = useState<"LEASES" | "INSPECTIONS" | "WORK_ORDERS" | "STATEMENTS">("LEASES");
  const [leases, setLeases] = useState<TenantLeaseRecord[]>(MOCK_LEASES);
  const [inspections] = useState<RoutineInspectionReport[]>(MOCK_INSPECTIONS);
  const [workOrders, setWorkOrders] = useState<TradeWorkOrder[]>(MOCK_WORK_ORDERS);

  const [searchTerm, setSearchTerm] = useState("");
  const [alertFilter, setAlertFilter] = useState("ALL");

  // Modal States
  const [showAddLeaseModal, setShowAddLeaseModal] = useState(false);
  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // New Work Order Form State
  const [newWo, setNewWo] = useState<{
    title: string;
    description: string;
    category: "PLUMBING" | "ELECTRICAL" | "LOCKSMITH" | "BUILDING" | "APPLIANCE";
    priority: "ROUTINE" | "HIGH" | "EMERGENCY";
    contractorName: string;
    contractorEmail: string;
    authorizedCostLimit: string;
  }>({
    title: "",
    description: "",
    category: "PLUMBING",
    priority: "ROUTINE",
    contractorName: "Manly Plumbing Services",
    contractorEmail: "jobs@manlyplumbing.example.com.au",
    authorizedCostLimit: "500",
  });

  // Filter leases
  const filteredLeases = leases.filter((l) => {
    const matchesSearch =
      l.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.suburb.toLowerCase().includes(searchTerm.toLowerCase());

    if (alertFilter === "ALL") return matchesSearch;
    if (alertFilter === "30") return matchesSearch && l.renewalAlert === "ALERT_30_DAYS";
    if (alertFilter === "60") return matchesSearch && l.renewalAlert === "ALERT_60_DAYS";
    if (alertFilter === "90") return matchesSearch && l.renewalAlert === "ALERT_90_DAYS";
    if (alertFilter === "ARREARS") return matchesSearch && l.rentStatus.startsWith("ARREARS");
    return matchesSearch;
  });

  const tenancySummary = getTenancySummary(leases);

  const handlePrintReport = (report: RoutineInspectionReport) => {
    const html = generateInspectionReportHtml(report);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.print();
    }
  };

  const handleDispatchWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const wo: TradeWorkOrder = {
      id: `wo-${Date.now()}`,
      workOrderNumber: `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      leaseId: "lease-1001",
      propertyAddress: "27 Raglan Street, Manly NSW 2095",
      title: newWo.title || "Routine Maintenance Work Order",
      description: newWo.description || "Trade service dispatch.",
      category: newWo.category,
      priority: newWo.priority,
      status: "WORK_ORDER_DISPATCHED",
      contractorName: newWo.contractorName,
      contractorEmail: newWo.contractorEmail,
      contractorPhone: "0412 888 999",
      authorizedCostLimit: Number(newWo.authorizedCostLimit) || 500,
      createdAt: new Date(),
    };

    setWorkOrders([wo, ...workOrders]);
    setShowWorkOrderModal(false);
    setSuccessNotice(`Work Order ${wo.workOrderNumber} dispatched to ${wo.contractorName}!`);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  return (
    <div className="space-y-8 max-w-7xl">

      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-[#0a192f] text-[#c5a059]">
              <KeyRound className="h-5 w-5" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">Property Management &amp; Tenancies</h1>
            <Badge variant="gold">Rental Operations Hub</Badge>
          </div>
          <p className="text-sm text-slate-500">
            Active tenant ledger, 90/60/30-day lease renewal alerts, routine inspection condition reports, and trade work order dispatching.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => setShowWorkOrderModal(true)} className="text-xs gap-1.5 border-slate-300">
            <Wrench className="h-3.5 w-3.5" />
            Issue Work Order
          </Button>
          <Button variant="gold" size="sm" onClick={() => setShowAddLeaseModal(true)} className="text-xs gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add New Tenancy Lease
          </Button>
        </div>
      </div>

      {/* ── Success Alert ──────────────────────────────────────────── */}
      {successNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* ── Top Financial Metric Cards ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200">
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Managed Tenancies</span>
              <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                <KeyRound className="h-4 w-4" />
              </div>
            </div>
            <p className="font-serif text-2xl font-bold text-slate-900">
              {tenancySummary.totalLeasesCount} Properties
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              ${tenancySummary.totalWeeklyRent.toLocaleString()} Total Weekly Rent
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Monthly Rent Volume</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <p className="font-serif text-2xl font-bold text-slate-900">
              ${Math.round(tenancySummary.totalMonthlyRent).toLocaleString("en-AU")}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              Inc. 5.5% Agency Mgmt Fee
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Lease Renewal Alerts</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">🔴 {tenancySummary.alert30Count} (30d)</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">🟡 {tenancySummary.alert60Count} (60d)</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono pt-1">
              {tenancySummary.alert90Count} Leases in 90-day review phase
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Open Work Orders</span>
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <Wrench className="h-4 w-4" />
              </div>
            </div>
            <p className="font-serif text-2xl font-bold text-slate-900">
              {workOrders.length} Active Trades
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              Plumbing, Electrical &amp; General Maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Tab Navigation ────────────────────────────────────── */}
      <div className="border-b border-slate-200 flex gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("LEASES")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "LEASES"
              ? "border-[#c5a059] text-[#0a192f]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <KeyRound className="h-4 w-4 text-[#c5a059]" />
          <span>Active Tenancy &amp; Lease Ledger</span>
          <Badge variant="outline" className="text-[10px] bg-slate-100 font-mono">
            {leases.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("INSPECTIONS")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "INSPECTIONS"
              ? "border-[#c5a059] text-[#0a192f]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileCheck2 className="h-4 w-4 text-[#c5a059]" />
          <span>Mobile Routine Inspection Reports</span>
        </button>

        <button
          onClick={() => setActiveTab("WORK_ORDERS")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "WORK_ORDERS"
              ? "border-[#c5a059] text-[#0a192f]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Wrench className="h-4 w-4 text-[#c5a059]" />
          <span>Trade Work Order Dispatcher</span>
          <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 font-bold border-purple-200">
            {workOrders.length} Trades
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("STATEMENTS")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "STATEMENTS"
              ? "border-[#c5a059] text-[#0a192f]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <DollarSign className="h-4 w-4 text-[#c5a059]" />
          <span>Landlord Monthly Statements</span>
        </button>
      </div>

      {/* ── TAB 1: ACTIVE TENANCY & LEASE LEDGER ─────────────────── */}
      {activeTab === "LEASES" && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-serif flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-[#c5a059]" />
                  <span>Tenancy &amp; Lease Renewal Countdown Ledger</span>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Automated 90/60/30-day lease expiry alerts, rent arrears tracking, and landlord details.
                </CardDescription>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tenant or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                  />
                </div>

                <select
                  value={alertFilter}
                  onChange={(e) => setAlertFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                >
                  <option value="ALL">All Leases</option>
                  <option value="30">🔴 30-Day Alert (Urgent)</option>
                  <option value="60">🟡 60-Day Review</option>
                  <option value="90">🟢 90-Day Proposal</option>
                  <option value="ARREARS">⚠️ Arrears Only</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200 whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-4">Property &amp; Tenant</th>
                    <th className="py-3 px-4">Landlord</th>
                    <th className="py-3 px-4 font-mono">Rent Rate</th>
                    <th className="py-3 px-4">Rent Status</th>
                    <th className="py-3 px-4">Lease Expiry</th>
                    <th className="py-3 px-4">Renewal Countdown Alert</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredLeases.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-serif font-bold text-slate-900">{l.propertyAddress}</p>
                        <p className="text-[10px] text-slate-500"><strong>Tenant:</strong> {l.tenantName} ({l.tenantPhone})</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-800">{l.landlordName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Bond: {l.bondReference}</p>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                        ${l.rentAmount.toLocaleString("en-AU")}/wk
                      </td>
                      <td className="py-3 px-4">
                        {l.rentStatus === "PAID_UP_TO_DATE" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Paid Up To Date
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                            <AlertCircle className="h-3 w-3 text-red-500" /> {l.rentStatus.replace("_", " ")}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono">
                        {new Date(l.leaseEndDate).toLocaleDateString("en-AU")}
                      </td>
                      <td className="py-3 px-4">
                        {l.renewalAlert === "ALERT_30_DAYS" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-full border border-red-300">
                            🔴 30-Day Alert ({l.daysRemaining} Days Left)
                          </span>
                        )}
                        {l.renewalAlert === "ALERT_60_DAYS" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                            🟡 60-Day Review ({l.daysRemaining} Days Left)
                          </span>
                        )}
                        {l.renewalAlert === "ALERT_90_DAYS" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                            🟢 90-Day Proposal ({l.daysRemaining} Days Left)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs gap-1 text-slate-600 hover:text-slate-900"
                        >
                          <Send className="h-3.5 w-3.5 text-[#c5a059]" />
                          <span>Renewal Offer</span>
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

      {/* ── TAB 2: MOBILE ROUTINE INSPECTION REPORTS ─────────────────── */}
      {activeTab === "INSPECTIONS" && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-serif flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-[#c5a059]" />
                  <span>Routine Property Condition Reports</span>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Mobile-friendly room-by-room condition checklists, photo attachments, and digital signatures.
                </CardDescription>
              </div>

              <Badge variant="gold">Statutory Condition Standard</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {inspections.map((report) => (
              <div key={report.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#0a192f]">{report.propertyAddress}</h3>
                    <p className="text-xs text-slate-500">
                      Tenant: <strong>{report.tenantName}</strong> | Inspector: <strong>{report.inspectorName}</strong> | Date: {new Date(report.inspectionDate).toLocaleDateString("en-AU")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-bold text-emerald-700 bg-emerald-50 border-emerald-200">
                      Overall: {report.overallCondition}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handlePrintReport(report)} className="text-xs gap-1">
                      <Printer className="h-3.5 w-3.5 text-[#c5a059]" />
                      <span>Print Condition Report</span>
                    </Button>
                  </div>
                </div>

                {/* Room Checklist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {report.roomItems.map((room, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <p className="font-bold text-slate-900">{room.roomName}</p>
                      <div className="flex flex-wrap gap-2 text-[10px]">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Walls: {room.wallsRating.replace("_", " ")}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Floors: {room.floorsRating.replace("_", " ")}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Fixtures: {room.fixturesRating.replace("_", " ")}</span>
                      </div>
                      {room.comments && <p className="text-[11px] text-slate-500 italic pt-1">{room.comments}</p>}
                    </div>
                  ))}
                </div>

                {/* Digital Signatures Block */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900">Inspector Digital Sign-off</p>
                      <p className="text-[10px] text-slate-400 font-mono">Signed at {report.inspectorSignedAt ? new Date(report.inspectorSignedAt).toLocaleString("en-AU") : "Pending"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900">Tenant Acknowledgment</p>
                      <p className="text-[10px] text-slate-400 font-mono">Signed by {report.tenantName} at {report.tenantSignedAt ? new Date(report.tenantSignedAt).toLocaleString("en-AU") : "Pending"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── TAB 3: TRADE CONTRACTOR WORK ORDER DISPATCHER ────────── */}
      {activeTab === "WORK_ORDERS" && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-serif flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-[#c5a059]" />
                  <span>Trade Contractor Maintenance Work Orders</span>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Issue, authorize spending limits, and track work orders dispatched to plumbing, electrical, and building trades.
                </CardDescription>
              </div>

              <Button variant="gold" size="sm" onClick={() => setShowWorkOrderModal(true)} className="text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                <span>Issue Work Order to Trade</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200 whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-4">WO Number</th>
                    <th className="py-3 px-4">Property &amp; Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Contractor</th>
                    <th className="py-3 px-4 font-mono">Cost Limit</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {workOrders.map((wo) => (
                    <tr key={wo.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#0a192f]">
                        {wo.workOrderNumber}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="font-bold text-slate-900">{wo.title}</p>
                        <p className="text-[10px] text-slate-500 truncate">{wo.propertyAddress}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {wo.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            wo.priority === "EMERGENCY"
                              ? "bg-red-100 text-red-700"
                              : wo.priority === "HIGH"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {wo.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{wo.contractorName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{wo.contractorPhone}</p>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                        ${wo.authorizedCostLimit.toLocaleString("en-AU")}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-bold bg-purple-50 text-purple-700 border-purple-200"
                        >
                          {wo.status.replace("_", " ")}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── TAB 4: LANDLORD MONTHLY STATEMENTS ────────────────────── */}
      {activeTab === "STATEMENTS" && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-serif flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#c5a059]" />
                  <span>Landlord Monthly Disbursement Statements</span>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Monthly rent collected minus 5.5% management fee minus maintenance trade invoices.
                </CardDescription>
              </div>

              <Badge variant="gold">August 2026 Accounting Period</Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200 whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-4">Landlord Owner</th>
                    <th className="py-3 px-4">Property Address</th>
                    <th className="py-3 px-4 font-mono">Rent Collected</th>
                    <th className="py-3 px-4 font-mono">Mgmt Fee (5.5%)</th>
                    <th className="py-3 px-4 font-mono">Deductions</th>
                    <th className="py-3 px-4 font-mono text-emerald-700">Net Disbursement</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {[
                    {
                      landlord: "Lady Eleanor Sterling",
                      address: "27 Raglan Street, Manly NSW 2095",
                      rent: 9100,
                      fee: 500.5,
                      deductions: 350.0, // Plumbing work order
                      net: 8249.5,
                    },
                    {
                      landlord: "Barangaroo Holdings Pty Ltd",
                      address: "15/100 Barangaroo Avenue, Barangaroo NSW 2000",
                      rent: 15166.66,
                      fee: 834.17,
                      deductions: 0.0,
                      net: 14332.49,
                    },
                    {
                      landlord: "Dr. Arthur Pendelton",
                      address: "42 Military Road, Mosman NSW 2088",
                      rent: 7800,
                      fee: 429.0,
                      deductions: 850.0, // Hot water repair
                      net: 6521.0,
                    },
                  ].map((stmt, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{stmt.landlord}</td>
                      <td className="py-3 px-4 text-slate-600">{stmt.address}</td>
                      <td className="py-3 px-4 font-mono font-bold">${stmt.rent.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">${stmt.fee.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">${stmt.deductions.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700 text-sm">
                        ${stmt.net.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1 text-slate-600 hover:text-slate-900">
                          <Printer className="h-3.5 w-3.5 text-[#c5a059]" />
                          <span>Print Statement</span>
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

      {/* ── MODAL: Issue Work Order ────────────────────────────────── */}
      {showWorkOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 space-y-4">
            <div className="bg-[#071325] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-[#c5a059]" />
                <h3 className="font-serif font-bold text-base">Issue Work Order to Trade</h3>
              </div>
              <button
                onClick={() => setShowWorkOrderModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-md bg-white/10"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleDispatchWorkOrder} className="p-6 space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Work Order Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shower Recaulking & Silicone Seal"
                  value={newWo.title}
                  onChange={(e) => setNewWo({ ...newWo, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Category</label>
                  <select
                    value={newWo.category}
                    onChange={(e) => setNewWo({ ...newWo, category: e.target.value as "PLUMBING" | "ELECTRICAL" | "LOCKSMITH" | "BUILDING" | "APPLIANCE" })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="PLUMBING">Plumbing</option>
                    <option value="ELECTRICAL">Electrical</option>
                    <option value="LOCKSMITH">Locksmith</option>
                    <option value="BUILDING">Building Maintenance</option>
                    <option value="APPLIANCE">Appliance Repair</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Priority</label>
                  <select
                    value={newWo.priority}
                    onChange={(e) => setNewWo({ ...newWo, priority: e.target.value as "ROUTINE" | "HIGH" | "EMERGENCY" })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="ROUTINE">Routine</option>
                    <option value="HIGH">High Priority</option>
                    <option value="EMERGENCY">Emergency (24h)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Contractor Company Name *</label>
                <input
                  type="text"
                  required
                  value={newWo.contractorName}
                  onChange={(e) => setNewWo({ ...newWo, contractorName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Contractor Email</label>
                  <input
                    type="email"
                    value={newWo.contractorEmail}
                    onChange={(e) => setNewWo({ ...newWo, contractorEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Authorized Cost Limit ($)</label>
                  <input
                    type="number"
                    value={newWo.authorizedCostLimit}
                    onChange={(e) => setNewWo({ ...newWo, authorizedCostLimit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Work Description / Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Detailed instructions for tradesperson..."
                  value={newWo.description}
                  onChange={(e) => setNewWo({ ...newWo, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <Button type="submit" variant="gold" size="lg" className="w-full text-xs font-bold gap-2">
                <Wrench className="h-4 w-4" />
                <span>Dispatch Work Order to Contractor</span>
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
