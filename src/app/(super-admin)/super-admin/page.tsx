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
  Save,
  LogOut,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  const [activePlan, setActivePlan] = useState<PlanTierPreset["code"]>("GOLD_ENTERPRISE");
  const [clientName, setClientName] = useState("Hampton Homes ERP");
  const [clientStatus, setClientStatus] = useState<"ACTIVE" | "SUSPENDED" | "TRIAL">("ACTIVE");
  const [expiryDate, setExpiryDate] = useState("2028-12-31");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 14 Granular Feature Flags State
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

  // Check auth session & fetch features from DB on mount
  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        if (meData.user?.roles?.includes("SUPER_ADMIN")) {
          setIsAuthenticated(true);
        }

        const featRes = await fetch("/api/admin/features");
        const featData = await featRes.json();
        if (featData.success && featData.config) {
          setActivePlan(featData.config.tier);
          setClientName(featData.config.clientName);
          setClientStatus(featData.config.clientStatus);
          setExpiryDate(featData.config.expiryDate);
          setFeatures(featData.config.features);
        }
      } catch (err) {
        console.error("Failed to load super admin config:", err);
      }
    }
    loadData();
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "super2026" || passcode === "SuperAdmin123!" || passcode === "admin") {
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

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

  const handleSaveToDatabase = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/admin/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: activePlan,
          clientName,
          clientStatus,
          expiryDate,
          features,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      alert("Failed to save changes to database.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
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
NEXT_PUBLIC_FEATURE_SUBURB_GUIDES=${features.suburbGuides}
NEXT_PUBLIC_FEATURE_PROPERTY_INTELLIGENCE=${features.propertyIntelligence}
NEXT_PUBLIC_FEATURE_DOCUMENTS=${features.digitalDocuments}`;
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
              Sign in as Super Admin to manage client subscriptions and feature access control.
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
                <p className="text-xs text-rose-400 font-semibold mt-1">Invalid Passcode (Hint: SuperAdmin123!)</p>
              )}
            </div>

            <Button type="submit" variant="gold" size="lg" className="w-full font-bold">
              Unlock Super Admin Controls →
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link href="/login" className="text-xs text-slate-400 hover:text-white">
              ← Return to standard login
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Platform Control Centre
              </h1>
              <p className="text-xs text-slate-400">
                Client Subscription Tiers &amp; Granular ERP Module Licensing
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="outline" className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800">
              Open Admin ERP →
            </Button>
          </Link>
          <Button
            onClick={handleSaveToDatabase}
            variant="gold"
            disabled={saving}
            className="text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
          >
            {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>{saving ? "Saving to Neon DB..." : "Save & Sync to Database"}</span>
          </Button>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-xs text-slate-400 hover:text-rose-400"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="max-w-7xl mx-auto p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>
            <strong>Success!</strong> Subscription settings and module feature flags have been saved to your live Neon PostgreSQL database.
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Subscription Presets & Granular Modules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Presets Selector */}
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between font-serif">
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  Subscription Plan Presets
                </span>
                <Badge variant="outline" className="border-slate-700 text-slate-300 font-mono text-[10px]">
                  Active: {activePlan}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PLAN_PRESETS.map((preset) => (
                  <button
                    key={preset.code}
                    onClick={() => applyPreset(preset.code)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      activePlan === preset.code
                        ? "bg-amber-500/10 border-amber-500/80 shadow-lg shadow-amber-500/10"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{preset.name.split(" ")[0]}</span>
                      <span className="text-xs font-mono font-bold text-amber-400">{preset.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">{preset.name.split("(")[1]?.replace(")", "") || "Tier"}</p>
                    <div className="text-[10px] text-slate-500">
                      {preset.unlockedFeatures.length} features included
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Granular Module Toggles */}
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between font-serif">
                <span className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-amber-400" />
                  Granular ERP Modules &amp; Feature Flags
                </span>
                <span className="text-xs text-slate-400">
                  {Object.values(features).filter(Boolean).length} of {Object.keys(features).length} Enabled
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(features).map(([key, isEnabled]) => (
                  <div
                    key={key}
                    onClick={() => toggleFeature(key)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isEnabled
                        ? "bg-slate-950 border-emerald-500/40 hover:border-emerald-500"
                        : "bg-slate-950/40 border-slate-800/80 opacity-60 hover:opacity-90"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isEnabled
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {isEnabled ? <Check className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isEnabled ? "Module Active for Client" : "Locked (Subscription Required)"}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-9 h-5 rounded-full relative transition-colors ${
                        isEnabled ? "bg-emerald-500" : "bg-slate-800"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                          isEnabled ? "left-4.5" : "left-1"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Client Metadata & Environment Config Block */}
        <div className="space-y-6">
          {/* Client Metadata Card */}
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 font-serif">
                <Building2 className="h-4 w-4 text-amber-400" />
                Client Account Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Agency Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Subscription Status</label>
                <select
                  value={clientStatus}
                  onChange={(e) => setClientStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                >
                  <option value="ACTIVE">ACTIVE (Full Service)</option>
                  <option value="TRIAL">TRIAL (14 Days)</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">License Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Environment Variable Exporter */}
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 font-serif">
                <Copy className="h-4 w-4 text-amber-400" />
                .env.local Config Exporter
              </CardTitle>
              <Button
                onClick={copyEnvToClipboard}
                size="sm"
                variant="outline"
                className="text-[10px] h-7 border-slate-700 text-slate-300"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400 mr-1" /> : null}
                <span>{copied ? "Copied!" : "Copy .env"}</span>
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="p-3 bg-slate-950 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto max-h-56 border border-slate-800">
                {generateEnvBlock()}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
