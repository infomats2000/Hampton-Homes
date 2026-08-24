"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radio,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCode2,
  Download,
  ExternalLink,
  ShieldCheck,
  Send,
  Eye,
  Search,
  SlidersHorizontal,
  Info,
  Check,
  Copy,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";
import { MRIRawProperty } from "@/lib/mri/provider.interface";
import { buildSingleReaxmlListing, buildFullReaxmlFeed } from "@/lib/syndication/reaxml-builder";
import { validateListingForSyndication, ValidationReport } from "@/lib/syndication/validator";

export default function AdminSyndicationPage() {
  const [properties, setProperties] = useState<MRIRawProperty[]>(MOCK_AUSTRALIAN_PROPERTIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [syncing, setSyncing] = useState(false);
  const [lastGlobalSync, setLastGlobalSync] = useState<Date>(new Date());
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // Modal & Drawer State
  const [selectedPropertyForXml, setSelectedPropertyForXml] = useState<MRIRawProperty | null>(null);
  const [selectedPropertyForAudit, setSelectedPropertyForAudit] = useState<MRIRawProperty | null>(null);
  const [copiedXml, setCopiedXml] = useState(false);

  // Filter listings
  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.streetName.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "ALL") return matchesSearch;
    if (statusFilter === "SALE") return matchesSearch && p.listingType.includes("SALE");
    if (statusFilter === "RENT") return matchesSearch && p.listingType.includes("RENT");
    if (statusFilter === "COMMERCIAL") return matchesSearch && p.listingType.includes("COMMERCIAL");
    return matchesSearch;
  });

  const handleGlobalSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastGlobalSync(new Date());
      setSyncSuccessMessage(`Successfully pushed ${properties.length} active listings to realestate.com.au & Domain.com.au!`);
      setTimeout(() => setSyncSuccessMessage(null), 5000);
    }, 1500);
  };

  const handleCopyXml = (xml: string) => {
    navigator.clipboard.writeText(xml);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  };

  const handleDownloadFullFeed = () => {
    const xml = buildFullReaxmlFeed(properties);
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reaxml-feed-${new Date().toISOString().slice(0, 10)}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl">

      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-[#0a192f] text-[#c5a059]">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">Portal Syndication &amp; REAXML Engine</h1>
            <Badge variant="gold">REAXML v2 &amp; Domain Connect</Badge>
          </div>
          <p className="text-sm text-slate-500">
            Automated multi-portal listing distribution for realestate.com.au, Domain.com.au, CommercialRealEstate, and RealEstateView.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleDownloadFullFeed} className="text-xs gap-1.5 border-slate-300">
            <Download className="h-3.5 w-3.5" />
            Download REAXML Feed
          </Button>
          <Button variant="gold" size="sm" onClick={handleGlobalSync} disabled={syncing} className="text-xs gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Syncing Portals..." : "Sync All Listings Now"}</span>
          </Button>
        </div>
      </div>

      {/* ── Success Alert ──────────────────────────────────────────── */}
      {syncSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>{syncSuccessMessage}</span>
        </div>
      )}

      {/* ── Portal Health Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            name: "realestate.com.au",
            sub: "REA Group (REAXML v2)",
            status: "LIVE",
            badgeColor: "bg-red-500",
            activeCount: properties.length,
            syncTime: "2 mins ago",
          },
          {
            name: "Domain.com.au",
            sub: "Domain Connect API v2",
            status: "LIVE",
            badgeColor: "bg-emerald-500",
            activeCount: properties.length,
            syncTime: "Just now",
          },
          {
            name: "Commercial RealEstate",
            sub: "CRE Commercial Feed",
            status: "LIVE",
            badgeColor: "bg-sky-500",
            activeCount: properties.filter((p) => p.listingType.startsWith("COMMERCIAL")).length,
            syncTime: "10 mins ago",
          },
          {
            name: "RealEstateView",
            sub: "REV Syndication Feed",
            status: "LIVE",
            badgeColor: "bg-amber-500",
            activeCount: properties.length,
            syncTime: "15 mins ago",
          },
        ].map((portal, idx) => (
          <Card key={idx} className="relative overflow-hidden border border-slate-200">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${portal.badgeColor}`} />
                  <p className="font-serif font-bold text-sm text-slate-900">{portal.name}</p>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border-emerald-200">
                  {portal.status}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500">{portal.sub}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Active Listings: <strong className="text-slate-900">{portal.activeCount}</strong></span>
                <span className="text-[10px] text-slate-400 font-mono">{portal.syncTime}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Listing Syndication Matrix ──────────────────────────────── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#c5a059]" />
                <span>Listing Syndication Matrix</span>
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Real-time portal status and pre-flight feed validation audit for all active agency listings.
              </CardDescription>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search address or suburb..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
              >
                <option value="ALL">All Categories</option>
                <option value="SALE">Residential Sale</option>
                <option value="RENT">Residential Rent</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200 whitespace-nowrap">
                <tr>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Feed Readiness</th>
                  <th className="py-3 px-4">REA Status</th>
                  <th className="py-3 px-4">Domain Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredProperties.map((prop) => {
                  const audit = validateListingForSyndication(prop);
                  return (
                    <tr key={prop.externalId} className="hover:bg-slate-50/80 transition-colors">
                      {/* Property Thumbnail & Address */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.photos[0]}
                            alt={prop.headline}
                            className="h-10 w-12 object-cover rounded-md shadow-xs shrink-0 bg-slate-100"
                          />
                          <div className="min-w-0">
                            <p className="font-serif font-bold text-slate-900 truncate max-w-xs">{prop.headline}</p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {prop.streetNumber} {prop.streetName}, {prop.suburb} {prop.state}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold">
                          {prop.listingType.replace("_", " ")}
                        </Badge>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        {prop.priceDisplay}
                      </td>

                      {/* Feed Readiness Score */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className={`font-bold ${audit.isReady ? "text-emerald-600" : "text-amber-600"}`}>
                              {audit.isReady ? "Ready to Feed" : `${audit.issues.filter(i => i.severity === "ERROR").length} Errors`}
                            </span>
                            <span className="font-mono text-slate-400">{audit.score}%</span>
                          </div>
                          <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${audit.score > 80 ? "bg-emerald-500" : audit.score > 50 ? "bg-amber-500" : "bg-red-500"}`}
                              style={{ width: `${audit.score}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* REA Status */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          <span>Live on REA</span>
                        </span>
                      </td>

                      {/* Domain Status */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          <span>Live on Domain</span>
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPropertyForAudit(prop)}
                            className="h-8 px-2 text-[11px] gap-1 text-slate-600 hover:text-slate-900"
                            title="Audit Feed Readiness"
                          >
                            <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                            <span>Audit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPropertyForXml(prop)}
                            className="h-8 px-2 text-[11px] gap-1 text-slate-600 hover:text-slate-900"
                            title="Inspect REAXML Code"
                          >
                            <FileCode2 className="h-3.5 w-3.5 text-sky-600" />
                            <span>XML</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── MODAL: REAXML Code Inspector ──────────────────────────── */}
      {selectedPropertyForXml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 space-y-4">
            <div className="bg-[#071325] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode2 className="h-5 w-5 text-[#c5a059]" />
                <h3 className="font-serif font-bold text-base">REAXML v2 Code Inspector</h3>
              </div>
              <button
                onClick={() => setSelectedPropertyForXml(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-md bg-white/10"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <p><strong>Property:</strong> {selectedPropertyForXml.headline}</p>
                <p className="font-mono text-slate-400">ID: PROP-{selectedPropertyForXml.externalId}</p>
              </div>

              <div className="relative">
                <pre className="text-[10px] font-mono bg-slate-900 text-emerald-400 rounded-xl p-4 overflow-x-auto max-h-96 leading-relaxed">
                  {buildSingleReaxmlListing(selectedPropertyForXml)}
                </pre>
                <button
                  onClick={() => handleCopyXml(buildSingleReaxmlListing(selectedPropertyForXml))}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg bg-[#c5a059] text-slate-900 hover:bg-[#d4af37] transition"
                >
                  {copiedXml ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedXml ? "Copied!" : "Copy REAXML"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Feed Readiness Audit Drawer ────────────────────── */}
      {selectedPropertyForAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 space-y-4">
            <div className="bg-[#071325] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#c5a059]" />
                <h3 className="font-serif font-bold text-base">Pre-flight Feed Validation Report</h3>
              </div>
              <button
                onClick={() => setSelectedPropertyForAudit(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-md bg-white/10"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <p className="font-serif font-bold text-slate-900 text-sm">{selectedPropertyForAudit.headline}</p>
                  <p className="text-slate-500 text-[11px]">{selectedPropertyForAudit.streetNumber} {selectedPropertyForAudit.streetName}, {selectedPropertyForAudit.suburb}</p>
                </div>
                {(() => {
                  const audit = validateListingForSyndication(selectedPropertyForAudit);
                  return (
                    <div className="text-right">
                      <p className={`font-bold text-sm ${audit.isReady ? "text-emerald-600" : "text-amber-600"}`}>
                        {audit.isReady ? "Ready for Portals" : "Attention Required"}
                      </p>
                      <p className="text-slate-400 font-mono text-[10px]">Readiness Score: {audit.score}/100</p>
                    </div>
                  );
                })()}
              </div>

              {/* Audit Issues List */}
              <div className="space-y-3">
                <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Diagnostic Issues Checklist</p>
                {(() => {
                  const audit = validateListingForSyndication(selectedPropertyForAudit);
                  if (audit.issues.length === 0) {
                    return (
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        <span>All portal requirements passed cleanly. Listing is 100% compliant for REA &amp; Domain.</span>
                      </div>
                    );
                  }
                  return audit.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                        issue.severity === "ERROR"
                          ? "bg-red-50 border-red-200 text-red-900"
                          : issue.severity === "WARNING"
                          ? "bg-amber-50 border-amber-200 text-amber-900"
                          : "bg-sky-50 border-sky-200 text-sky-900"
                      }`}
                    >
                      {issue.severity === "ERROR" ? (
                        <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      ) : issue.severity === "WARNING" ? (
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold uppercase text-[10px]">{issue.portal} Portal</span>
                          <span className="text-[10px] opacity-75 font-mono">• {issue.field}</span>
                        </div>
                        <p className="mt-0.5 leading-relaxed">{issue.message}</p>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
