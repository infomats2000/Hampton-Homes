"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Search,
  Shield,
  Eye,
  EyeOff,
  DollarSign,
  Calendar,
  BarChart3,
  ChevronRight,
  MapPin,
  Home,
  Bed,
  Bath,
  Car,
  Maximize,
  Clock,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ComparableSale {
  address: string;
  suburb: string;
  saleDate: string;
  salePrice: number;
  bedrooms?: number;
  bathrooms?: number;
  distanceKm?: number;
}

interface PropertyReport {
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  carSpaces?: number;
  landAreaSqm?: number;
  buildingAreaSqm?: number;
  estimatedValue: number;
  estimatedValueLow: number;
  estimatedValueHigh: number;
  rentalEstimate?: number;
  rentalYield?: number;
  lastSaleDate?: string;
  lastSalePrice?: number;
  daysOnMarket?: number;
  landValue?: number;
  zoning?: string;
  comparableSales: ComparableSale[];
  fetchedAt: string;
  visibility: "INTERNAL_ONLY" | "AGENT_ONLY";
}

const DEMO_REPORTS: PropertyReport[] = [
  {
    address: "42 Harbour View Drive",
    suburb: "Mosman",
    state: "NSW",
    postcode: "2088",
    propertyType: "House",
    bedrooms: 5,
    bathrooms: 3,
    carSpaces: 2,
    landAreaSqm: 680,
    buildingAreaSqm: 420,
    estimatedValue: 6_200_000,
    estimatedValueLow: 5_800_000,
    estimatedValueHigh: 6_600_000,
    rentalEstimate: 4200,
    rentalYield: 3.5,
    lastSaleDate: "2021-03-15",
    lastSalePrice: 4_850_000,
    daysOnMarket: 34,
    landValue: 3_200_000,
    zoning: "R2 Low Density Residential",
    comparableSales: [
      { address: "38 Harbour View Drive", suburb: "Mosman", saleDate: "2026-06-20", salePrice: 6_100_000, bedrooms: 5, bathrooms: 3, distanceKm: 0.1 },
      { address: "12 Sirius Cove Rd", suburb: "Mosman", saleDate: "2026-05-10", salePrice: 5_950_000, bedrooms: 4, bathrooms: 3, distanceKm: 0.4 },
      { address: "7 Awaba Street", suburb: "Mosman", saleDate: "2026-04-05", salePrice: 6_350_000, bedrooms: 5, bathrooms: 4, distanceKm: 0.6 },
    ],
    fetchedAt: "2026-08-22T10:00:00Z",
    visibility: "INTERNAL_ONLY",
  },
  {
    address: "7/15 Neutral Bay Avenue",
    suburb: "Neutral Bay",
    state: "NSW",
    postcode: "2089",
    propertyType: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    carSpaces: 1,
    landAreaSqm: undefined,
    buildingAreaSqm: 78,
    estimatedValue: 1_150_000,
    estimatedValueLow: 1_050_000,
    estimatedValueHigh: 1_250_000,
    rentalEstimate: 680,
    rentalYield: 3.1,
    lastSaleDate: "2019-11-30",
    lastSalePrice: 850_000,
    daysOnMarket: 19,
    zoning: "B4 Mixed Use",
    comparableSales: [
      { address: "5/20 Ben Boyd Road", suburb: "Neutral Bay", saleDate: "2026-07-15", salePrice: 1_120_000, bedrooms: 2, bathrooms: 1, distanceKm: 0.2 },
      { address: "12/8 Kurraba Road", suburb: "Neutral Bay", saleDate: "2026-06-01", salePrice: 1_195_000, bedrooms: 2, bathrooms: 2, distanceKm: 0.3 },
    ],
    fetchedAt: "2026-08-21T14:30:00Z",
    visibility: "AGENT_ONLY",
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(value);
}

export default function PropertyIntelligencePage() {
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<PropertyReport | null>(DEMO_REPORTS[0]);
  const [showValues, setShowValues] = useState(true);

  const filtered = DEMO_REPORTS.filter(
    (r) =>
      !search ||
      r.address.toLowerCase().includes(search.toLowerCase()) ||
      r.suburb.toLowerCase().includes(search.toLowerCase())
  );

  const r = selectedReport;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-[#c5a059]" />
            </div>
            <h1 className="text-2xl font-bold text-white">Property Intelligence</h1>
          </div>
          <p className="text-slate-400 text-sm">
            CoreLogic / RP Data licensed property reports — valuations, comparable sales & market insights
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-xs">
          <Lock className="h-3.5 w-3.5" />
          Licensed Data — Internal Use Only
        </div>
      </div>

      {/* Licensing Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3 shadow-xs">
        <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">CoreLogic / RP Data Licensing Compliance</p>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            All property intelligence data is sourced from CoreLogic and governed by strict licensing terms.
            Valuation estimates and comparable sales data are for <strong className="font-bold text-amber-950">internal agency use only</strong> and
            must never be displayed to the public without explicit authorisation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Property List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by address or suburb..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
            />
          </div>

          <div className="space-y-3">
            {filtered.map((report) => (
              <button
                key={report.address}
                onClick={() => setSelectedReport(report)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedReport?.address === report.address
                    ? "bg-[#0a192f] text-white border-[#0a192f] shadow-md"
                    : "bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`font-bold text-sm ${selectedReport?.address === report.address ? "text-white" : "text-[#0a192f]"}`}>
                      {report.address}
                    </p>
                    <p className={`text-xs mt-0.5 ${selectedReport?.address === report.address ? "text-slate-300" : "text-slate-500"}`}>
                      {report.suburb} {report.state} {report.postcode}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                        {report.visibility === "INTERNAL_ONLY" ? "Internal Only" : "Agent Only"}
                      </span>
                      <span className={selectedReport?.address === report.address ? "text-slate-300" : "text-slate-500"}>
                        {report.propertyType}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 mt-1 ${selectedReport?.address === report.address ? "text-[#c5a059]" : "text-slate-400"}`} />
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-xs">
            <p className="text-xs text-slate-500 mb-2 font-medium">Lookup a new property from CoreLogic</p>
            <a
              href="/admin/integrations/corelogic"
              className="text-xs text-sky-700 font-bold hover:underline flex items-center justify-center gap-1"
            >
              Configure CoreLogic API
              <ChevronRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Right: Report Detail */}
        {r ? (
          <div className="lg:col-span-2 space-y-5">
            {/* Property Summary */}
            <Card className="border border-slate-200 shadow-xs">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#0a192f]">{r.address}</h2>
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {r.suburb} {r.state} {r.postcode} · {r.propertyType}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowValues(!showValues)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    {showValues ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {showValues ? "Hide Values" : "Show Values"}
                  </button>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {[
                    { icon: Bed, label: "Bedrooms", value: r.bedrooms ?? "—" },
                    { icon: Bath, label: "Bathrooms", value: r.bathrooms ?? "—" },
                    { icon: Car, label: "Car Spaces", value: r.carSpaces ?? "—" },
                    { icon: Maximize, label: "Land", value: r.landAreaSqm ? `${r.landAreaSqm}m²` : "—" },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="bg-slate-50 rounded-xl border border-slate-200/80 p-3 text-center">
                        <Icon className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                        <p className="font-serif text-lg font-bold text-[#0a192f]">{stat.value}</p>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Valuation */}
                <div className="bg-[#071325] text-white border border-slate-800 rounded-2xl p-5 shadow-md">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="h-4 w-4 text-[#c5a059]" />
                    <h3 className="font-serif font-bold text-white text-sm">Estimated Market Value</h3>
                    <span className="ml-auto text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                      INTERNAL ONLY
                    </span>
                  </div>
                  {showValues ? (
                    <>
                      <p className="font-serif text-4xl font-bold text-[#c5a059] mb-2">{formatCurrency(r.estimatedValue)}</p>
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
                        <span>Low: <span className="text-white font-bold">{formatCurrency(r.estimatedValueLow)}</span></span>
                        <span>High: <span className="text-white font-bold">{formatCurrency(r.estimatedValueHigh)}</span></span>
                      </div>
                      {r.rentalEstimate && (
                        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-4 text-xs font-medium text-slate-300">
                          <span>Rental Estimate: <span className="text-white font-bold">${r.rentalEstimate}/wk</span></span>
                          {r.rentalYield && <span>Yield: <span className="text-emerald-400 font-bold">{r.rentalYield}% p.a.</span></span>}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400">
                      <EyeOff className="h-4 w-4" />
                      <span className="text-sm">Values hidden</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sale History */}
            <Card className="border border-slate-200 shadow-xs">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-[#c5a059]" />
                  <h3 className="font-serif font-bold text-[#0a192f] text-sm">Sale History</h3>
                </div>
                {r.lastSaleDate && r.lastSalePrice && (
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-[#0a192f]">{showValues ? formatCurrency(r.lastSalePrice) : "••••••••"}</p>
                      <p className="text-xs text-slate-500">Last sale · {r.lastSaleDate}</p>
                    </div>
                    {r.daysOnMarket && (
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#0a192f]">{r.daysOnMarket} days</p>
                        <p className="text-xs text-slate-500">Days on market</p>
                      </div>
                    )}
                  </div>
                )}
                {r.landValue && (
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold text-slate-600">Land Value</p>
                    <p className="text-sm font-bold text-[#0a192f]">{showValues ? formatCurrency(r.landValue) : "••••••••"}</p>
                  </div>
                )}
                {r.zoning && (
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold text-slate-600">Zoning</p>
                    <p className="text-sm font-bold text-[#0a192f]">{r.zoning}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comparable Sales */}
            <Card className="border border-slate-200 shadow-xs">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-[#c5a059]" />
                  <h3 className="font-serif font-bold text-[#0a192f] text-sm">Comparable Sales</h3>
                </div>
                <div className="space-y-2">
                  {r.comparableSales.map((sale, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3">
                      <div>
                        <p className="text-xs font-bold text-[#0a192f]">{sale.address}</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                          <span>{sale.suburb}</span>
                          {sale.bedrooms && <span>{sale.bedrooms}bd</span>}
                          {sale.bathrooms && <span>{sale.bathrooms}ba</span>}
                          {sale.distanceKm && <span>{sale.distanceKm}km away</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-[#0a192f]">{showValues ? formatCurrency(sale.salePrice) : "••••••••"}</p>
                        <p className="text-[10px] text-slate-500">{sale.saleDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Report Footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Data fetched: {new Date(r.fetchedAt).toLocaleString("en-AU")}
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Source: CoreLogic / RP Data
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center bg-white border border-slate-200 rounded-2xl min-h-64 shadow-xs">
            <div className="text-center text-slate-400">
              <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-40 text-slate-400" />
              <p className="font-semibold text-slate-600">Select a property to view intelligence report</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
