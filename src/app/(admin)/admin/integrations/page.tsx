"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Network,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Plug2,
  Shield,
  Zap,
  Activity,
  Settings,
} from "lucide-react";

type IntegrationStatus = "CONNECTED" | "DEGRADED" | "DISCONNECTED" | "PENDING_SETUP";

interface ProviderCard {
  key: string;
  displayName: string;
  description: string;
  category: string;
  status: IntegrationStatus;
  lastSync?: string;
  recordsSynced?: number;
  color: string;
  docsUrl?: string;
}

const PROVIDERS: ProviderCard[] = [
  {
    key: "XERO",
    displayName: "Xero Accounting",
    description: "Automated 2-way sync for 10% GST, trust receipts, commissions & bills",
    category: "ERP / Accounting",
    status: "CONNECTED",
    lastSync: "12 minutes ago",
    recordsSynced: 442,
    color: "#13b5ea",
    docsUrl: "/admin/integrations/xero",
  },
  {
    key: "MRI_VAULT",
    displayName: "MRI Vault",
    description: "Sales listings & property data sync",
    category: "CRM",
    status: "CONNECTED",
    lastSync: "2 minutes ago",
    recordsSynced: 284,
    color: "#059669",
    docsUrl: "https://www.mrisoftware.com",
  },
  {
    key: "MRI_PROPERTY_TREE",
    displayName: "MRI Property Tree",
    description: "Rental & property management sync",
    category: "CRM",
    status: "CONNECTED",
    lastSync: "5 minutes ago",
    recordsSynced: 156,
    color: "#059669",
    docsUrl: "https://www.mrisoftware.com",
  },
  {
    key: "HOMEPASS",
    displayName: "Homepass",
    description: "Open home check-in & visitor registration",
    category: "Open Homes",
    status: "PENDING_SETUP",
    color: "#00a8e1",
    docsUrl: "https://homepass.com.au",
  },
  {
    key: "FLK",
    displayName: "FLK it over",
    description: "Digital agreements, leasing & e-signatures",
    category: "Documents",
    status: "PENDING_SETUP",
    color: "#6366f1",
    docsUrl: "https://flkitover.com",
  },
  {
    key: "CORELOGIC",
    displayName: "CoreLogic / RP Data",
    description: "Licensed property intelligence & valuations",
    category: "Property Data",
    status: "PENDING_SETUP",
    color: "#dc2626",
    docsUrl: "https://developer.corelogic.com.au",
  },
  {
    key: "PROPERTYME",
    displayName: "PropertyMe",
    description: "Property management & tenancy records",
    category: "Property Management",
    status: "PENDING_SETUP",
    color: "#0ea5e9",
    docsUrl: "https://propertyme.com.au",
  },
  {
    key: "GOOGLE",
    displayName: "Google Workspace",
    description: "Google Contacts & Calendar OAuth 2.0 sync",
    category: "Contacts & Calendar",
    status: "PENDING_SETUP",
    color: "#4285f4",
  },
  {
    key: "MICROSOFT",
    displayName: "Microsoft Outlook",
    description: "MS Graph Contacts & Outlook Calendar sync",
    category: "Contacts & Calendar",
    status: "PENDING_SETUP",
    color: "#0078d4",
  },
  {
    key: "APPLE",
    displayName: "Apple Contacts & Calendar",
    description: "vCard & iCal export for Apple ecosystem",
    category: "Contacts & Calendar",
    status: "CONNECTED",
    lastSync: "On demand",
    color: "#555555",
  },
];

const STATUS_CONFIG: Record<IntegrationStatus, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  CONNECTED: {
    label: "Connected",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  DEGRADED: {
    label: "Degraded",
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  DISCONNECTED: {
    label: "Disconnected",
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  PENDING_SETUP: {
    label: "Setup Required",
    icon: Clock,
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
  },
};

export default function IntegrationsPage() {
  const [filter, setFilter] = useState<"ALL" | IntegrationStatus>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const categories = ["ALL", ...Array.from(new Set(PROVIDERS.map((p) => p.category)))];

  const connectedCount = PROVIDERS.filter((p) => p.status === "CONNECTED").length;
  const pendingCount = PROVIDERS.filter((p) => p.status === "PENDING_SETUP").length;
  const degradedCount = PROVIDERS.filter((p) => p.status === "DEGRADED").length;

  const filtered = PROVIDERS.filter((p) => {
    const statusOk = filter === "ALL" || p.status === filter;
    const categoryOk = categoryFilter === "ALL" || p.category === categoryFilter;
    return statusOk && categoryOk;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center">
              <Network className="h-5 w-5 text-[#c5a059]" />
            </div>
            <h1 className="text-2xl font-bold text-white">Real Estate Integration Hub</h1>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Central control panel for all third-party integrations. Connect Homepass, FLK, CoreLogic, PropertyMe,
            Google, Microsoft, and Apple to power your agency workflows.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors border border-slate-700">
            <RefreshCw className="h-4 w-4" />
            Health Check All
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Integrations", value: PROVIDERS.length, icon: Plug2, color: "text-slate-300" },
          { label: "Connected", value: connectedCount, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Setup Required", value: pendingCount, icon: Clock, color: "text-amber-400" },
          { label: "Issues", value: degradedCount, icon: AlertTriangle, color: "text-red-400" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#0d2444]/80 border border-slate-800 rounded-xl p-4 flex items-center gap-4"
            >
              <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Source-of-Truth Legend */}
      <div className="bg-[#0d2444]/60 border border-[#c5a059]/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-4 w-4 text-[#c5a059]" />
          <h2 className="text-sm font-semibold text-[#c5a059] uppercase tracking-wide">
            Source-of-Truth Engine
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {[
            { domain: "Sales Listings", primary: "MRI Vault" },
            { domain: "Rental Marketing", primary: "MRI Property Tree" },
            { domain: "Open Home Attendees", primary: "Homepass" },
            { domain: "Property Intelligence", primary: "CoreLogic / RP Data" },
            { domain: "Digital Documents", primary: "FLK it over" },
            { domain: "Tenancy Records", primary: "PropertyMe" },
          ].map((sot) => (
            <div key={sot.domain} className="flex items-center justify-between gap-2 bg-slate-800/40 rounded-lg px-3 py-2">
              <span className="text-slate-400">{sot.domain}</span>
              <span className="text-white font-medium">{sot.primary}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          {(["ALL", "CONNECTED", "PENDING_SETUP", "DEGRADED", "DISCONNECTED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === s
                  ? "bg-[#c5a059] text-slate-900"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {s === "ALL" ? "All" : STATUS_CONFIG[s as IntegrationStatus]?.label ?? s}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap sm:ml-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                categoryFilter === cat
                  ? "bg-slate-600 text-white"
                  : "bg-slate-800/50 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Provider Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((provider) => {
          const statusCfg = STATUS_CONFIG[provider.status];
          const StatusIcon = statusCfg.icon;

          return (
            <div
              key={provider.key}
              className="bg-[#0d2444]/80 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 hover:border-slate-600 transition-all group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: provider.color + "20", border: `1px solid ${provider.color}40` }}
                  >
                    <Zap className="h-5 w-5" style={{ color: provider.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{provider.displayName}</h3>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                      {provider.category}
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.color}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  {statusCfg.label}
                </span>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed">{provider.description}</p>

              {/* Sync Info */}
              {provider.status === "CONNECTED" && (
                <div className="flex items-center justify-between text-xs bg-slate-800/40 rounded-lg px-3 py-2">
                  <span className="text-slate-400">Last sync</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-medium">{provider.lastSync}</span>
                    {provider.recordsSynced && (
                      <span className="text-slate-500">· {provider.recordsSynced} records</span>
                    )}
                  </div>
                </div>
              )}

              {/* Card Footer */}
              <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-800">
                <Link
                  href={`/admin/integrations/${provider.key.toLowerCase()}`}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Configure
                </Link>
                {provider.docsUrl && (
                  <a
                    href={provider.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded-lg text-xs transition-colors"
                    title="View documentation"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Webhook Endpoints Reference */}
      <div className="bg-[#0d2444]/60 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-[#c5a059]" />
          <h2 className="text-sm font-semibold text-white">Webhook Endpoints</h2>
        </div>
        <div className="space-y-2">
          {[
            { provider: "Homepass", endpoint: "/api/webhooks/homepass", secret: "HOMEPASS_WEBHOOK_SECRET" },
            { provider: "FLK it over", endpoint: "/api/webhooks/flk", secret: "FLK_WEBHOOK_SECRET" },
            { provider: "PropertyMe", endpoint: "/api/webhooks/propertyme", secret: "PROPERTYME_WEBHOOK_SECRET" },
          ].map((w) => (
            <div
              key={w.provider}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/60 rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-white">{w.provider}</span>
                <ChevronRight className="h-3 w-3 text-slate-600" />
                <code className="text-xs text-[#c5a059] font-mono">{w.endpoint}</code>
              </div>
              <code className="text-[10px] text-slate-500 font-mono">{w.secret}</code>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-slate-500">
          All webhooks verify HMAC-SHA256 signatures. Set environment variables in your Vercel dashboard.
          Export endpoints: <code className="text-slate-400">/api/contacts/[id]/vcard</code> ·{" "}
          <code className="text-slate-400">/api/appointments/[id]/ics</code>
        </p>
      </div>
    </div>
  );
}
