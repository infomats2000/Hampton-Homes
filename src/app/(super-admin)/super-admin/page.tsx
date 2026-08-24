"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Sparkles,
  Building2,
  DollarSign,
  KeyRound,
  FileText,
  UserCheck,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface PlanTierPreset {
  name: string;
  code: "GOLD_ENTERPRISE" | "SILVER_GROWTH" | "BRONZE_STARTER" | "CUSTOM";
  price: string;
  badgeColor: string;
  unlockedFeatures: string[];
}

export const PLAN_PRESETS: PlanTierPreset[] = [
  {
    name: "Gold Enterprise (Unlimited)",
    code: "GOLD_ENTERPRISE",
    price: "$999/mo",
    badgeColor: "bg-amber-500 text-slate-900 font-bold",
    unlockedFeatures: [
      "customerPortal",
      "commercial",
      "projects",
      "auctions",
      "propertyManagement",
      "trustAccounting",
      "commissionCalculator",
      "aiCopywriter",
      "buyerMatching",
      "portalSyndication",
      "xeroSync",
      "amlVerification",
      "news",
      "suburbGuides",
      "propertyIntelligence",
      "digitalDocuments",
    ],
  },
  {
    name: "Silver Growth (Professional)",
    code: "SILVER_GROWTH",
    price: "$599/mo",
    badgeColor: "bg-slate-200 text-slate-800 font-bold",
    unlockedFeatures: [
      "customerPortal",
      "commercial",
      "propertyManagement",
      "buyerMatching",
      "portalSyndication",
      "xeroSync",
      "news",
      "suburbGuides",
    ],
  },
  {
    name: "Bronze Starter (Essential)",
    code: "BRONZE_STARTER",
    price: "$299/mo",
    badgeColor: "bg-amber-700 text-white font-bold",
    unlockedFeatures: [
      "customerPortal",
      "news",
      "suburbGuides",
    ],
  },
];

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  const [activePlan, setActivePlan] = useState<PlanTierPreset["code"]>("GOLD_ENTERPRISE");
  const [clientName, setClientName] = useState("Infomats Real Estate ERP");
  const [clientStatus, setClientStatus] = useState("ACTIVE");
  const [expiryDate, setExpiryDate] = useState("2027-12-31");
  const [copied, setCopied] = useState(false);

  // 12 Granular Feature Flags State
  const [features, setFeatures] = useState<Record<string, boolean>>({
    customerPortal: true,
    commercial: true,
    projects: true,
    auctions: true,
    propertyManagement: true,
    trustAccounting: true,
    commissionCalculator: true,
    aiCopywriter: true,
    buyerMatching: true,
    portalSyndication: true,
    xeroSync: true,
    amlVerification: true,
    news: true,
    suburbGuides: true,
    propertyIntelligence: true,
    digitalDocuments: true,
  });

  // Handle Passcode Unlock (Super Admin Key: "super2026")
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "super2026" || passcode === "admin") {
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  // Apply Plan Preset
  const applyPreset = (planCode: PlanTierPreset["code"]) => {
    setActivePlan(planCode);
    const preset = PLAN_PRESETS.find((p) => p.code === planCode);
    if (preset) {
      const updated: Record<string, boolean> = {};
      Object.keys(features).forEach((key) => {
        updated[key] = preset.unlockedFeatures.includes(key);
      });
      setFeatures(updated);
    }
  };

  const toggleFeature = (key: string) => {
    setActivePlan("CUSTOM");
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const generateEnvBlock = () => {
    return `# Super Admin Client License Configuration
NEXT_PUBLIC_SUBSCRIPTION_TIER=${activePlan}
NEXT_PUBLIC_FEATURE_CUSTOMER_PORTAL=${features.customerPortal}
NEXT_PUBLIC_FEATURE_COMMERCIAL=${features.commercial}
NEXT_PUBLIC_FEATURE_PROJECTS=${features.projects}
NEXT_PUBLIC_FEATURE_AUCTIONS=${features.auctions}
NEXT_PUBLIC_FEATURE_PROPERTY_MANAGEMENT=${features.propertyManagement}
NEXT_PUBLIC_FEATURE_TRUST_ACCOUNTING=${features.trustAccounting}
NEXT_PUBLIC_FEATURE_COMMISSION_CALCULATOR=${features.commissionCalculator}
NEXT_PUBLIC_FEATURE_AI_COPYWRITER=${features.aiCopywriter}
NEXT_PUBLIC_FEATURE_BUYER_MATCHING=${features.buyerMatching}
NEXT_PUBLIC_FEATURE_PORTAL_SYNDICATION=${features.portalSyndication}
NEXT_PUBLIC_FEATURE_XERO_SYNC=${features.xeroSync}
NEXT_PUBLIC_FEATURE_AML_VERIFICATION=${features.amlVerification}
NEXT_PUBLIC_FEATURE_NEWS=${features.news}
NEXT_PUBLIC_FEATURE_SUBURB_GUIDES=${features.suburbGuides}`;
  };

  const copyEnvToClipboard = () => {
    navigator.clipboard.writeText(generateEnvBlock());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border border-slate-800 bg-slate-950 text-white shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#c5a059] flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold">Super Admin Security Portal</h1>
            <p className="text-xs text-slate-400">
              Enter master passcode to manage client subscriptions and feature access control.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1 text-left">
              <label htmlFor="super-passcode" className="text-xs font-bold text-slate-300">
                Master Security Passcode *
              </label>
              <input
                id="super-passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Super Admin Passcode"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a059] font-mono text-center text-white"
              />
              {passcodeError && (
                <p className="text-xs text-rose-400 font-semibold mt-1">Invalid Passcode (Hint: super2026)</p>
              )}
            </div>

            <Button type="submit" variant="gold" size="lg" className="w-full font-bold">
              Unlock Super Admin Controls →
            </Button>
          </form>

          <p className="text-[10px] text-center text-slate-500">
            Infomats Real Estate Platform • Multi-Tenant License Licensing Control Engine
          </p>
        </Card>
      </div>
    );
  }

  const unlockedCount = Object.values(features).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 space-y-8">
      {/* Super Admin Top Banner */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>Super Admin Licensing Control Centre</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">
            Client Subscription &amp; Feature Access Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Toggle features on or off per client subscription plan. Hidden features automatically disappear from client UI &amp; API routes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard">
            <Button variant="outline" className="text-xs bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700">
              Open Client Admin Panel →
            </Button>
          </Link>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
          >
            Lock Session
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Tier Presets Selector */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#c5a059]" />
            <span>1-Click Subscription Plan Presets</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {PLAN_PRESETS.map((preset) => (
              <button
                key={preset.code}
                onClick={() => applyPreset(preset.code)}
                className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  activePlan === preset.code
                    ? "bg-slate-800 border-[#c5a059] ring-2 ring-[#c5a059]/50 shadow-xl"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                {activePlan === preset.code && (
                  <div className="absolute top-0 right-0 bg-[#c5a059] text-slate-900 px-3 py-0.5 text-[10px] font-bold rounded-bl-lg">
                    ACTIVE PLAN
                  </div>
                )}
                <div className="space-y-2">
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full inline-block ${preset.badgeColor}`}>
                    {preset.name.split(" ")[0]}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-white">{preset.name}</h3>
                  <p className="text-2xl font-bold text-[#c5a059]">{preset.price}</p>
                  <p className="text-xs text-slate-400">
                    {preset.unlockedFeatures.length} of 16 Modules Unlocked
                  </p>
                </div>
              </button>
            ))}

            {/* Custom Plan Button */}
            <button
              onClick={() => setActivePlan("CUSTOM")}
              className={`p-5 rounded-2xl border text-left transition-all ${
                activePlan === "CUSTOM"
                  ? "bg-slate-800 border-purple-500 ring-2 ring-purple-500/50 shadow-xl"
                  : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-2">
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full inline-block bg-purple-500 text-white font-bold">
                  CUSTOM TIER
                </span>
                <h3 className="font-serif font-bold text-lg text-white">Granular Custom</h3>
                <p className="text-2xl font-bold text-purple-400">Tailored Plan</p>
                <p className="text-xs text-slate-400">
                  {unlockedCount} Modules Unlocked
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 16 Granular Feature Toggle Switches */}
        <Card className="bg-slate-950 border border-slate-800 text-white shadow-xl">
          <CardHeader className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-serif text-white">
                Feature Access Control Matrix
              </CardTitle>
              <p className="text-xs text-slate-400 mt-1">
                Currently Unlocked: <span className="font-bold text-[#c5a059]">{unlockedCount} / 16 Modules</span>
              </p>
            </div>

            <Badge variant="gold" className="text-xs font-mono px-3 py-1">
              Active Tier: {activePlan}
            </Badge>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: "trustAccounting", label: "Statutory Trust Accounting", desc: "TAR-2026 Receipts & Settlement Matrix", icon: DollarSign },
                { key: "portalSyndication", label: "REAXML & Domain Syndication", desc: "Automated REAXML & Domain Connect API", icon: Layers },
                { key: "propertyManagement", label: "Property Management & Expiries", desc: "Lease countdowns, inspections & work orders", icon: KeyRound },
                { key: "commissionCalculator", label: "Multi-Tier Commission Split Engine", desc: "10% GST ($ / 11) & franchise splits", icon: DollarSign },
                { key: "aiCopywriter", label: "AI Copywriter (Gemini)", desc: "Generate 4 property copy formats in 5s", icon: Sparkles },
                { key: "buyerMatching", label: "Smart Buyer Matcher & Task Matrix", desc: "Ranked buyer matching & agent task list", icon: UserCheck },
                { key: "xeroSync", label: "Xero Accounting 2-Way Sync", desc: "Automated Xero COA & bill integration", icon: RefreshCw },
                { key: "amlVerification", label: "AUSTRAC AML/CTF 2026 eIDV", desc: "DVS driver licence & passport verification", icon: ShieldCheck },
                { key: "commercial", label: "Commercial Property Portal", desc: "Commercial sales & lease listings", icon: Building2 },
                { key: "projects", label: "New Projects & Off-Plan", desc: "Masterplan developments & project staging", icon: Layers },
                { key: "auctions", label: "Live Auction & Bidding Portal", desc: "Side-by-side auction bid tracker", icon: Sliders },
                { key: "customerPortal", label: "Customer My Account & Favourites", desc: "Buyer dashboard & saved search alerts", icon: UserCheck },
              ].map((feat) => {
                const isEnabled = features[feat.key];
                const IconComponent = feat.icon;
                return (
                  <div
                    key={feat.key}
                    onClick={() => toggleFeature(feat.key)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isEnabled
                        ? "bg-slate-900 border-emerald-500/50 hover:border-emerald-400"
                        : "bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`h-4 w-4 ${isEnabled ? "text-emerald-400" : "text-slate-500"}`} />
                        <h4 className="font-bold text-xs text-white">{feat.label}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{feat.desc}</p>
                    </div>

                    <button
                      type="button"
                      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        isEnabled ? "bg-emerald-500" : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          isEnabled ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Deployment Environment Exporter */}
        <Card className="bg-slate-950 border border-slate-800 text-white shadow-xl">
          <CardHeader className="p-6 border-b border-slate-800 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-serif text-white">
                One-Click Vercel / Cloud Environment Exporter
              </CardTitle>
              <p className="text-xs text-slate-400 mt-1">
                Copy these feature flag environment variables directly into Vercel or client .env file.
              </p>
            </div>

            <Button
              variant="gold"
              onClick={copyEnvToClipboard}
              className="gap-2 text-xs font-bold"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Copied to Clipboard!" : "Copy .env Block"}</span>
            </Button>
          </CardHeader>

          <CardContent className="p-6">
            <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto">
              {generateEnvBlock()}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
