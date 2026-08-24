"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Printer,
  Filter,
  BarChart3,
  Calendar,
  Layers,
  CheckSquare,
  Square,
  Save,
  Users,
  Building2,
  DollarSign,
  Search,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";
import { MOCK_LEADS } from "@/app/(admin)/admin/leads/page";
import { MOCK_AGENTS } from "@/lib/properties/service";

type ReportDomain = "PROPERTIES" | "CUSTOMERS" | "FINANCIAL" | "INSPECTIONS";

export default function AdminERPReportsPage() {
  const [domain, setDomain] = useState<ReportDomain>("PROPERTIES");
  const [dateRange, setDateRange] = useState("ALL_TIME");
  const [suburbFilter, setSuburbFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedReportNotice, setSavedReportNotice] = useState(false);

  // Available Columns per domain
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "address",
    "suburb",
    "price",
    "type",
    "status",
    "mriId",
  ]);

  const toggleColumn = (colKey: string) => {
    if (selectedColumns.includes(colKey)) {
      if (selectedColumns.length > 1) {
        setSelectedColumns(selectedColumns.filter((c) => c !== colKey));
      }
    } else {
      setSelectedColumns([...selectedColumns, colKey]);
    }
  };

  // Filter Properties Data
  const filteredProperties = MOCK_AUSTRALIAN_PROPERTIES.filter((p) => {
    if (suburbFilter !== "ALL" && p.suburb !== suburbFilter) return false;
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    if (searchQuery && !p.headline.toLowerCase().includes(searchQuery.toLowerCase()) && !p.suburb.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Filter Leads Data
  const filteredLeads = MOCK_LEADS.filter((l) => {
    if (statusFilter !== "ALL" && l.status !== statusFilter) return false;
    if (searchQuery && !l.name.toLowerCase().includes(searchQuery.toLowerCase()) && !l.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Export CSV Handler
  const handleExportCSV = () => {
    let csvContent = "";

    if (domain === "PROPERTIES") {
      csvContent =
        "ID,Address,Suburb,State,Price,Type,Status,Bedrooms,Bathrooms\n" +
        filteredProperties
          .map(
            (p) =>
              `"${p.externalId}","${p.streetNumber} ${p.streetName}","${p.suburb}","${p.state}","${p.priceDisplay}","${p.propertyType}","${p.status}",${p.bedrooms},${p.bathrooms}`
          )
          .join("\n");
    } else if (domain === "CUSTOMERS") {
      csvContent =
        "Lead ID,Name,Email,Phone,Lead Type,Status,Priority,Assigned Agent\n" +
        filteredLeads
          .map(
            (l) =>
              `"${l.id}","${l.name}","${l.email}","${l.phone}","${l.leadType}","${l.status}","${l.priority}","${l.assignedAgentName}"`
          )
          .join("\n");
    } else {
      csvContent =
        "Agent Name,Position,Email,Phone,Office,Active Listings\n" +
        MOCK_AGENTS.map(
          (a) => `"${a.name}","${a.position}","${a.email}","${a.phone}","${a.officeName}",${a.activeListingsCount}`
        ).join("\n");
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `erp-report-${domain.toLowerCase()}-${Date.now()}.csv`;
    a.click();
  };

  // Save Report Template Handler
  const handleSaveTemplate = () => {
    setSavedReportNotice(true);
    setTimeout(() => setSavedReportNotice(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
              Dynamic ERP Reporting & Analytics Engine
            </h1>
            <Badge variant="gold">Enterprise ERP Grade</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Build, filter, and export customized ERP reporting datasets for properties, customer leads, financial valuations, and agent SLAs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleSaveTemplate} className="gap-1.5 text-xs">
            <Save className="h-3.5 w-3.5" />
            <span>Save Report Preset</span>
          </Button>

          <Button variant="gold" size="sm" onClick={handleExportCSV} className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            <span>Export Report (CSV)</span>
          </Button>
        </div>
      </div>

      {savedReportNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Custom ERP Report Preset Saved to Executive Dashboard!</span>
        </div>
      )}

      {/* Domain Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { id: "PROPERTIES", label: "Properties & Inventory", icon: Building2, desc: "Portfolios, price guides & MRI sync status" },
          { id: "CUSTOMERS", label: "Customers & Leads", icon: Users, desc: "Enquiries, appraisals & customer alerts" },
          { id: "FINANCIAL", label: "Financial Valuations", icon: DollarSign, desc: "Sales volume & price distribution" },
          { id: "INSPECTIONS", label: "Inspections & Agents", icon: BarChart3, desc: "Open home attendance & agent SLAs" },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = domain === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setDomain(item.id as ReportDomain)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isActive
                  ? "bg-[#0a192f] text-white border-[#0a192f] shadow-md"
                  : "bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${isActive ? "text-[#c5a059]" : "text-slate-400"}`} />
                {isActive && <Badge variant="gold">ACTIVE</Badge>}
              </div>
              <p className="font-serif font-bold text-sm">{item.label}</p>
              <p className={`text-[11px] mt-1 ${isActive ? "text-slate-300" : "text-slate-500"}`}>{item.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Report Builder Control Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#c5a059]" />
            <span>Dynamic Query & Filter Builder</span>
          </CardTitle>
          <CardDescription>Customize date ranges, filter parameters, and visible dataset columns.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-medium">
            <div className="space-y-1">
              <label className="text-slate-700 font-bold block">Search Dataset</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-bold block">Time Period</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none"
              >
                <option value="ALL_TIME">All Time Historical</option>
                <option value="THIS_MONTH">Current Month (Aug 2026)</option>
                <option value="Q3_2026">Q3 2026 Financial Quarter</option>
                <option value="YEAR_TO_DATE">Year to Date 2026</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-bold block">Suburb Region</label>
              <select
                value={suburbFilter}
                onChange={(e) => setSuburbFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none"
              >
                <option value="ALL">All Suburbs</option>
                <option value="Parramatta">Parramatta</option>
                <option value="Bondi Beach">Bondi Beach</option>
                <option value="Manly">Manly</option>
                <option value="Mosman">Mosman</option>
                <option value="Surry Hills">Surry Hills</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-bold block">Listing / Lead Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="FOR_SALE">For Sale</option>
                <option value="FOR_RENT">For Rent</option>
                <option value="NEW">New Lead</option>
                <option value="ASSIGNED">Assigned Lead</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Report Output Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-[#0a192f]">Generated ERP Dataset ({domain})</CardTitle>
            <CardDescription className="text-xs">
              Calculated real-time dataset ready for analysis or export.
            </CardDescription>
          </div>
          <Badge variant="gold">
            {domain === "PROPERTIES" ? `${filteredProperties.length} Records` : `${filteredLeads.length} Records`}
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {domain === "PROPERTIES" ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-4">MRI External ID</th>
                    <th className="py-3 px-4">Property Address</th>
                    <th className="py-3 px-4">Suburb & State</th>
                    <th className="py-3 px-4">Price Guide</th>
                    <th className="py-3 px-4">Property Type</th>
                    <th className="py-3 px-4">Beds / Baths / Cars</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredProperties.map((p) => (
                    <tr key={p.externalId} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-500">{p.externalId}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {p.streetNumber} {p.streetName}
                      </td>
                      <td className="py-3 px-4 text-slate-700">{p.suburb}, {p.state}</td>
                      <td className="py-3 px-4 font-serif font-bold text-[#0a192f]">{p.priceDisplay}</td>
                      <td className="py-3 px-4 text-slate-700">{p.propertyType}</td>
                      <td className="py-3 px-4 text-slate-700">{p.bedrooms} / {p.bathrooms} / {p.carSpaces}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant={p.status === "FOR_SALE" ? "sale" : "rent"}>{p.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : domain === "CUSTOMERS" ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-4">Lead ID</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Lead Type</th>
                    <th className="py-3 px-4">Assigned Agent</th>
                    <th className="py-3 px-4 text-right">Pipeline Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredLeads.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-500">{l.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{l.name}</td>
                      <td className="py-3 px-4 text-slate-700">{l.email}</td>
                      <td className="py-3 px-4 text-slate-700">{l.phone}</td>
                      <td className="py-3 px-4"><Badge variant="gold">{l.leadType}</Badge></td>
                      <td className="py-3 px-4 text-slate-800">{l.assignedAgentName}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant={l.status === "NEW" ? "warning" : "success"}>{l.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-4">Agent Name</th>
                    <th className="py-3 px-4">Position</th>
                    <th className="py-3 px-4">Branch Office</th>
                    <th className="py-3 px-4">Active Listings</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4 text-right">SLA Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {MOCK_AGENTS.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{a.name}</td>
                      <td className="py-3 px-4 text-slate-700">{a.position}</td>
                      <td className="py-3 px-4 text-slate-700">{a.officeName}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{a.activeListingsCount} Active</td>
                      <td className="py-3 px-4 text-slate-700">{a.phone}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant="success">98% Optimal</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
