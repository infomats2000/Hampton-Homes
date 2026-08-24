"use client";

import React, { useState, useCallback } from "react";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Save,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  Palette,
  Image as ImageIcon,
  Server,
  Sliders,
  Shield,
  Copy,
  ChevronDown,
  ChevronRight,
  FileCode2,
  AlertTriangle,
  Sparkles,
  Hash,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  AGENCY_NAME,
  AGENCY_LEGAL_NAME,
  AGENCY_TAGLINE,
  AGENCY_ABN,
  AGENCY_LICENCE,
  AGENCY_STATE,
  AGENCY_PHONE,
  AGENCY_PHONE_DISPLAY,
  AGENCY_EMAIL,
  AGENCY_HEAD_OFFICE_ADDRESS,
  AGENCY_WEBSITE_URL,
  AGENCY_COLOR_PRIMARY,
  AGENCY_COLOR_PRIMARY_DARK,
  AGENCY_COLOR_ACCENT,
  AGENCY_LOGO_URL,
  AGENCY_OG_IMAGE_URL,
  FEATURE_CUSTOMER_PORTAL,
  FEATURE_COMMERCIAL_LISTINGS,
  FEATURE_PROJECTS,
  FEATURE_AUCTIONS,
  FEATURE_PROPERTY_MANAGEMENT,
  FEATURE_NEWS,
  FEATURE_SUBURB_GUIDES,
  FEATURE_PROPERTY_INTELLIGENCE,
  FEATURE_DIGITAL_DOCUMENTS,
} from "@/lib/agency-config";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SettingsState {
  // Identity
  agencyName: string;
  legalName: string;
  tagline: string;
  abn: string;
  licence: string;
  state: string;
  // Contact
  phone: string;
  phoneDisplay: string;
  email: string;
  headOffice: string;
  websiteUrl: string;
  // Branding
  colorPrimary: string;
  colorPrimaryDark: string;
  colorAccent: string;
  logoUrl: string;
  ogImageUrl: string;
  // MRI
  mriDemoMode: boolean;
  mriVaultApiKey: string;
  mriVaultBaseUrl: string;
  mriVaultAgencyId: string;
  mriPropertyTreeApiKey: string;
  mriPropertyTreeBaseUrl: string;
  // Webhooks
  homepassSecret: string;
  flkSecret: string;
  propertyMeSecret: string;
  // Features
  featureCustomerPortal: boolean;
  featureCommercial: boolean;
  featureProjects: boolean;
  featureAuctions: boolean;
  featurePropertyManagement: boolean;
  featureNews: boolean;
  featureSuburbGuides: boolean;
  featurePropertyIntelligence: boolean;
  featureDocuments: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, description, color = "text-[#c5a059]" }: {
  icon: React.ElementType;
  title: string;
  description: string;
  color?: string;
}) {
  return (
    <CardHeader className="pb-4">
      <CardTitle className="text-lg flex items-center gap-2.5 font-serif">
        <div className={`p-1.5 rounded-lg bg-slate-100 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span>{title}</span>
      </CardTitle>
      <CardDescription className="text-xs">{description}</CardDescription>
    </CardHeader>
  );
}

function FormField({ label, id, hint, children }: { label: string; id?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-bold text-slate-700">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-slate-400">{hint}</p>}
    </div>
  );
}

function TextInput({ id, value, onChange, type = "text", placeholder, readOnly, mono }: {
  id?: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
  mono?: boolean;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full px-3 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f] transition ${
        readOnly
          ? "bg-slate-100 border-slate-200 text-slate-500 cursor-default"
          : "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
      } ${mono ? "font-mono" : ""}`}
    />
  );
}

function SecretInput({ id, value, onChange, placeholder }: { id?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? "••••••••••••••••"}
        className="w-full px-3 py-2.5 pr-9 text-xs font-mono border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0a192f] hover:border-slate-300 transition"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
      >
        {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

function ColourInput({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <FormField label={label} hint={hint}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="h-10 w-14 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-2.5 text-xs font-mono border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
        />
        <div
          className="h-10 w-10 rounded-lg border border-slate-200 shrink-0 shadow-inner"
          style={{ backgroundColor: value }}
        />
      </div>
    </FormField>
  );
}

function FeatureToggle({ label, description, enabled, onChange }: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      onClick={() => onChange(!enabled)}
      className={`flex items-center justify-between gap-4 p-3.5 rounded-xl border cursor-pointer transition-all ${
        enabled
          ? "border-emerald-200 bg-emerald-50/60"
          : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
      }`}
    >
      <div>
        <p className={`text-xs font-bold ${enabled ? "text-emerald-800" : "text-slate-700"}`}>{label}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{description}</p>
      </div>
      <div className={`shrink-0 transition-colors ${enabled ? "text-emerald-500" : "text-slate-300"}`}>
        {enabled ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
      </div>
    </div>
  );
}

function SelectInput({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0a192f] hover:border-slate-300 transition"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ─── Live Brand Preview ────────────────────────────────────────────────────────

function BrandPreview({ s }: { s: SettingsState }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg text-[11px] font-sans">
      {/* Mini Navbar */}
      <div style={{ background: s.colorPrimaryDark }} className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded-md flex items-center justify-center font-bold text-[10px]"
            style={{ background: s.colorAccent, color: "#0a192f" }}
          >
            {s.agencyName.substring(0, 2).toUpperCase()}
          </div>
          <span className="font-bold text-white text-[10px]">{s.agencyName}</span>
        </div>
        <div className="flex gap-3 text-[9px]" style={{ color: s.colorAccent }}>
          <span>Buy</span><span>Rent</span><span>Sell</span>
        </div>
        <div
          className="text-[9px] px-2 py-0.5 rounded-full font-bold"
          style={{ background: s.colorAccent, color: "#0a192f" }}
        >
          {s.phone || "Contact"}
        </div>
      </div>

      {/* Mini Hero */}
      <div style={{ background: s.colorPrimary }} className="px-4 py-6 text-center text-white">
        <div
          className="inline-block text-[9px] px-2 py-0.5 rounded-full mb-2 font-bold"
          style={{ background: `${s.colorAccent}30`, color: s.colorAccent, border: `1px solid ${s.colorAccent}50` }}
        >
          ✦ Premier Australian Real Estate
        </div>
        <h2 className="font-serif text-sm font-bold leading-tight">{s.agencyName || "Your Agency"}</h2>
        <p className="text-[9px] mt-1 opacity-70 max-w-xs mx-auto">{s.tagline}</p>
        <div
          className="mt-3 inline-block px-3 py-1.5 rounded-lg text-[9px] font-bold"
          style={{ background: s.colorAccent, color: "#0a192f" }}
        >
          Search Properties
        </div>
      </div>

      {/* Mini Footer */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <div>
          <p className="font-bold text-slate-800 text-[9px]">{s.agencyName}</p>
          <p className="text-slate-400 text-[9px]">{s.email}</p>
        </div>
        <div style={{ color: s.colorAccent }} className="text-[9px] font-bold">{s.phone}</div>
      </div>
    </div>
  );
}

// ─── Env Var Export Panel ─────────────────────────────────────────────────────

function EnvVarPanel({ s }: { s: SettingsState }) {
  const [copied, setCopied] = useState(false);

  const envText = `# Agency Identity
NEXT_PUBLIC_AGENCY_NAME=${s.agencyName}
NEXT_PUBLIC_AGENCY_LEGAL_NAME=${s.legalName}
NEXT_PUBLIC_AGENCY_TAGLINE=${s.tagline}
NEXT_PUBLIC_AGENCY_ABN=${s.abn}
NEXT_PUBLIC_AGENCY_LICENCE=${s.licence}
NEXT_PUBLIC_AGENCY_STATE=${s.state}

# Contact
NEXT_PUBLIC_AGENCY_PHONE=${s.phone}
NEXT_PUBLIC_AGENCY_PHONE_DISPLAY=${s.phoneDisplay}
NEXT_PUBLIC_AGENCY_EMAIL=${s.email}
NEXT_PUBLIC_AGENCY_HEAD_OFFICE_ADDRESS=${s.headOffice}
NEXT_PUBLIC_AGENCY_WEBSITE_URL=${s.websiteUrl}

# Branding
NEXT_PUBLIC_AGENCY_COLOR_PRIMARY=${s.colorPrimary}
NEXT_PUBLIC_AGENCY_COLOR_PRIMARY_DARK=${s.colorPrimaryDark}
NEXT_PUBLIC_AGENCY_COLOR_ACCENT=${s.colorAccent}
NEXT_PUBLIC_AGENCY_LOGO_URL=${s.logoUrl}
NEXT_PUBLIC_AGENCY_OG_IMAGE_URL=${s.ogImageUrl}

# MRI Integration
MRI_DEMO_MODE=${s.mriDemoMode ? "true" : "false"}
MRI_VAULT_BASE_URL=${s.mriVaultBaseUrl}
MRI_VAULT_API_KEY=${s.mriVaultApiKey}
MRI_VAULT_AGENCY_ID=${s.mriVaultAgencyId}
MRI_PROPERTY_TREE_BASE_URL=${s.mriPropertyTreeBaseUrl}
MRI_PROPERTY_TREE_API_KEY=${s.mriPropertyTreeApiKey}

# Webhook Secrets
HOMEPASS_WEBHOOK_SECRET=${s.homepassSecret}
FLK_WEBHOOK_SECRET=${s.flkSecret}
PROPERTYME_WEBHOOK_SECRET=${s.propertyMeSecret}

# Feature Flags
NEXT_PUBLIC_FEATURE_CUSTOMER_PORTAL=${s.featureCustomerPortal}
NEXT_PUBLIC_FEATURE_COMMERCIAL=${s.featureCommercial}
NEXT_PUBLIC_FEATURE_PROJECTS=${s.featureProjects}
NEXT_PUBLIC_FEATURE_AUCTIONS=${s.featureAuctions}
NEXT_PUBLIC_FEATURE_PROPERTY_MANAGEMENT=${s.featurePropertyManagement}
NEXT_PUBLIC_FEATURE_NEWS=${s.featureNews}
NEXT_PUBLIC_FEATURE_SUBURB_GUIDES=${s.featureSuburbGuides}
NEXT_PUBLIC_FEATURE_PROPERTY_INTELLIGENCE=${s.featurePropertyIntelligence}
NEXT_PUBLIC_FEATURE_DOCUMENTS=${s.featureDocuments}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(envText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-l-4 border-l-violet-500">
      <SectionHeader
        icon={FileCode2}
        title=".env Export"
        description="Copy these values into your .env.local file or Vercel Environment Variables to apply all settings."
        color="text-violet-500"
      />
      <CardContent>
        <div className="relative">
          <pre className="text-[10px] font-mono bg-slate-900 text-emerald-400 rounded-xl p-4 overflow-x-auto leading-relaxed max-h-72 overflow-y-auto">
            {envText}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition"
          >
            {copied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy all"}
          </button>
        </div>
        <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
          <p className="text-[10px] font-medium leading-relaxed">
            Changes here are reflected live in this preview only. To apply them to the running app, copy the env vars above into your <strong>.env.local</strong> and restart the dev server — or update your <strong>Vercel Environment Variables</strong> and trigger a redeploy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminAgencySettingsPage() {
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const [settings, setSettings] = useState<SettingsState>({
    // Identity
    agencyName: AGENCY_NAME,
    legalName: AGENCY_LEGAL_NAME,
    tagline: AGENCY_TAGLINE,
    abn: AGENCY_ABN,
    licence: AGENCY_LICENCE,
    state: AGENCY_STATE,
    // Contact
    phone: AGENCY_PHONE,
    phoneDisplay: AGENCY_PHONE_DISPLAY,
    email: AGENCY_EMAIL,
    headOffice: AGENCY_HEAD_OFFICE_ADDRESS,
    websiteUrl: AGENCY_WEBSITE_URL,
    // Branding
    colorPrimary: AGENCY_COLOR_PRIMARY,
    colorPrimaryDark: AGENCY_COLOR_PRIMARY_DARK,
    colorAccent: AGENCY_COLOR_ACCENT,
    logoUrl: AGENCY_LOGO_URL,
    ogImageUrl: AGENCY_OG_IMAGE_URL,
    // MRI
    mriDemoMode: true,
    mriVaultApiKey: "",
    mriVaultBaseUrl: "https://api.vault.mrisoftware.com",
    mriVaultAgencyId: "",
    mriPropertyTreeApiKey: "",
    mriPropertyTreeBaseUrl: "https://api.propertytree.com",
    // Webhooks
    homepassSecret: "",
    flkSecret: "",
    propertyMeSecret: "",
    // Features
    featureCustomerPortal: FEATURE_CUSTOMER_PORTAL,
    featureCommercial: FEATURE_COMMERCIAL_LISTINGS,
    featureProjects: FEATURE_PROJECTS,
    featureAuctions: FEATURE_AUCTIONS,
    featurePropertyManagement: FEATURE_PROPERTY_MANAGEMENT,
    featureNews: FEATURE_NEWS,
    featureSuburbGuides: FEATURE_SUBURB_GUIDES,
    featurePropertyIntelligence: FEATURE_PROPERTY_INTELLIGENCE,
    featureDocuments: FEATURE_DIGITAL_DOCUMENTS,
  });

  const set = useCallback(<K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  const toggleSection = (id: string) => setActiveSection(prev => prev === id ? null : id);

  const AUS_STATES = [
    { value: "NSW", label: "New South Wales" },
    { value: "VIC", label: "Victoria" },
    { value: "QLD", label: "Queensland" },
    { value: "WA", label: "Western Australia" },
    { value: "SA", label: "South Australia" },
    { value: "TAS", label: "Tasmania" },
    { value: "ACT", label: "Australian Capital Territory" },
    { value: "NT", label: "Northern Territory" },
  ];

  return (
    <div className="space-y-8 max-w-7xl">

      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-[#0a192f] text-[#c5a059]">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">Agency Configuration</h1>
            <Badge variant="gold">White-Label</Badge>
          </div>
          <p className="text-sm text-slate-500">
            Configure all agency branding, contact details, integrations, and feature flags.
            Changes are reflected live in the preview panel.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <Button variant="gold" size="sm" onClick={handleSave} className="text-xs gap-1.5">
            <Save className="h-3.5 w-3.5" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* ── Success Banner ────────────────────────────────────────── */}
      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>
            Settings saved to preview. Copy the <strong>.env Export</strong> below to apply to your deployment.
          </span>
        </div>
      )}

      {/* ── Two-Column Layout ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* ── LEFT: Settings Form ────────────────────────────────── */}
        <form onSubmit={handleSave} className="xl:col-span-2 space-y-6">

          {/* 1. Agency Identity */}
          <Card>
            <SectionHeader
              icon={Building2}
              title="Agency Identity"
              description="Core agency details used across the public website, footer, and legal notices."
            />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Agency Short Name *" hint="Shown in headings, hero banner, page titles">
                  <TextInput value={settings.agencyName} onChange={v => set("agencyName", v)} placeholder="Coastal Premier Real Estate" />
                </FormField>
                <FormField label="Legal Company Name *" hint="For footer and compliance notices">
                  <TextInput value={settings.legalName} onChange={v => set("legalName", v)} placeholder="Coastal Premier Real Estate Pty Ltd" />
                </FormField>
              </div>

              <FormField label="Agency Tagline" hint="One-line tagline shown in the hero section and SEO description">
                <TextInput value={settings.tagline} onChange={v => set("tagline", v)} placeholder="The Northern Beaches' leading real estate specialists" />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="ABN" hint="Australian Business Number">
                  <TextInput value={settings.abn} onChange={v => set("abn", v)} placeholder="12 345 678 901" mono />
                </FormField>
                <FormField label="Licence Number" hint="State real estate licence">
                  <TextInput value={settings.licence} onChange={v => set("licence", v)} placeholder="10012345" mono />
                </FormField>
                <FormField label="Primary State">
                  <SelectInput value={settings.state} onChange={v => set("state", v)} options={AUS_STATES} />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* 2. Contact Details */}
          <Card>
            <SectionHeader
              icon={Phone}
              title="Contact Details"
              description="Displayed in the navbar announcement bar, footer, and contact page."
              color="text-sky-500"
            />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Phone (for tel: links)" hint="Used in href=tel: — digits only preferred">
                  <TextInput value={settings.phone} onChange={v => set("phone", v)} placeholder="1300 123 456" />
                </FormField>
                <FormField label="Phone Display Text" hint="Shown in the top navbar bar">
                  <TextInput value={settings.phoneDisplay} onChange={v => set("phoneDisplay", v)} placeholder="1300 123 456 (1300 AGENCY)" />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Enquiries Email *">
                  <TextInput value={settings.email} onChange={v => set("email", v)} placeholder="hello@youragency.com.au" type="email" />
                </FormField>
                <FormField label="Website URL">
                  <TextInput value={settings.websiteUrl} onChange={v => set("websiteUrl", v)} placeholder="https://www.youragency.com.au" />
                </FormField>
              </div>

              <FormField label="Head Office Address" hint="Full address shown in footer and contact page">
                <TextInput value={settings.headOffice} onChange={v => set("headOffice", v)} placeholder="Level 5, 12 The Corso, Manly NSW 2095" />
              </FormField>
            </CardContent>
          </Card>

          {/* 3. Branding & Colours */}
          <Card>
            <SectionHeader
              icon={Palette}
              title="Brand Colours"
              description="Choose your agency's colour palette. Changes are reflected instantly in the preview panel."
              color="text-pink-500"
            />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ColourInput
                  label="Primary Colour"
                  value={settings.colorPrimary}
                  onChange={v => set("colorPrimary", v)}
                  hint="Main brand colour — buttons, headings, links"
                />
                <ColourInput
                  label="Primary Dark"
                  value={settings.colorPrimaryDark}
                  onChange={v => set("colorPrimaryDark", v)}
                  hint="Navbar bar, admin sidebar background"
                />
                <ColourInput
                  label="Accent / Gold"
                  value={settings.colorAccent}
                  onChange={v => set("colorAccent", v)}
                  hint="Badges, highlights, hover effects, icons"
                />
              </div>

              {/* Colour Swatches Preview */}
              <div className="flex gap-3 pt-2">
                {[settings.colorPrimary, settings.colorPrimaryDark, settings.colorAccent].map((c, i) => (
                  <div key={i} className="text-center space-y-1">
                    <div
                      className="h-10 w-20 rounded-xl shadow border border-slate-200"
                      style={{ background: c }}
                    />
                    <p className="text-[9px] font-mono text-slate-500">{c}</p>
                  </div>
                ))}
                {/* Gradient preview */}
                <div className="text-center space-y-1 flex-1">
                  <div
                    className="h-10 rounded-xl shadow border border-slate-200"
                    style={{ background: `linear-gradient(135deg, ${settings.colorPrimaryDark}, ${settings.colorPrimary}, ${settings.colorAccent})` }}
                  />
                  <p className="text-[9px] text-slate-500">Brand gradient</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Logo & Images */}
          <Card>
            <SectionHeader
              icon={ImageIcon}
              title="Logo & Images"
              description="Set the agency logo and Open Graph image. Use a CDN URL or a path relative to /public."
              color="text-orange-500"
            />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Logo URL" hint="e.g. /logo.png or https://cdn.youragency.com/logo.png">
                  <TextInput value={settings.logoUrl} onChange={v => set("logoUrl", v)} placeholder="/logo.png" />
                </FormField>
                <FormField label="OG / Social Share Image URL" hint="Shown when the site is shared on social media — min 1200×630px">
                  <TextInput value={settings.ogImageUrl} onChange={v => set("ogImageUrl", v)} placeholder="/og-image.png" />
                </FormField>
              </div>

              {/* Logo Preview */}
              {settings.logoUrl && (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50">
                  <div className="p-2 rounded-xl" style={{ background: settings.colorPrimaryDark }}>
                    <img
                      src={settings.logoUrl}
                      alt="Logo preview"
                      className="h-10 w-auto object-contain rounded"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-700">Logo Preview</p>
                    <p className="text-slate-400 font-mono">{settings.logoUrl}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 5. MRI Integration */}
          <Card className="border-l-4 border-l-sky-500">
            <SectionHeader
              icon={Server}
              title="MRI Integration Credentials"
              description="Configure MRI Vault (sales) and Property Tree (rentals) API connections. Enable Demo Mode to use mock data."
              color="text-sky-500"
            />
            <CardContent className="space-y-5">
              {/* Demo Mode Toggle */}
              <FeatureToggle
                label="MRI Demo Mode"
                description="Use built-in mock data instead of live MRI APIs. Safe for development and client demos."
                enabled={settings.mriDemoMode}
                onChange={v => set("mriDemoMode", v)}
              />

              {!settings.mriDemoMode && (
                <div className="space-y-5 pt-1">
                  {/* Vault */}
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
                      MRI Vault (Sales)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Vault Base URL">
                        <TextInput value={settings.mriVaultBaseUrl} onChange={v => set("mriVaultBaseUrl", v)} placeholder="https://api.vault.mrisoftware.com" />
                      </FormField>
                      <FormField label="Vault Agency ID">
                        <TextInput value={settings.mriVaultAgencyId} onChange={v => set("mriVaultAgencyId", v)} placeholder="AGY-XXXXXXXX" mono />
                      </FormField>
                      <FormField label="Vault API Key" hint="Keep this secret — never share publicly">
                        <SecretInput value={settings.mriVaultApiKey} onChange={v => set("mriVaultApiKey", v)} />
                      </FormField>
                    </div>
                  </div>

                  {/* Property Tree */}
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                      MRI Property Tree (Rentals)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Property Tree Base URL">
                        <TextInput value={settings.mriPropertyTreeBaseUrl} onChange={v => set("mriPropertyTreeBaseUrl", v)} placeholder="https://api.propertytree.com" />
                      </FormField>
                      <FormField label="Property Tree API Key">
                        <SecretInput value={settings.mriPropertyTreeApiKey} onChange={v => set("mriPropertyTreeApiKey", v)} />
                      </FormField>
                    </div>
                  </div>

                  {/* Webhooks */}
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-violet-500 inline-block" />
                      Webhook Secrets
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField label="Homepass Webhook Secret">
                        <SecretInput value={settings.homepassSecret} onChange={v => set("homepassSecret", v)} />
                      </FormField>
                      <FormField label="FLK it over Secret">
                        <SecretInput value={settings.flkSecret} onChange={v => set("flkSecret", v)} />
                      </FormField>
                      <FormField label="PropertyMe Secret">
                        <SecretInput value={settings.propertyMeSecret} onChange={v => set("propertyMeSecret", v)} />
                      </FormField>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 6. Feature Flags */}
          <Card className="border-l-4 border-l-emerald-500">
            <SectionHeader
              icon={Sliders}
              title="Feature Flags"
              description="Toggle site sections on or off. Disabled features are hidden from navigation and their pages return 404."
              color="text-emerald-500"
            />
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FeatureToggle
                  label="Customer Portal"
                  description="My Account dashboard for buyers and tenants"
                  enabled={settings.featureCustomerPortal}
                  onChange={v => set("featureCustomerPortal", v)}
                />
                <FeatureToggle
                  label="Commercial Listings"
                  description="Commercial real estate section and nav link"
                  enabled={settings.featureCommercial}
                  onChange={v => set("featureCommercial", v)}
                />
                <FeatureToggle
                  label="New Projects / Developments"
                  description="Off-the-plan and new development listings"
                  enabled={settings.featureProjects}
                  onChange={v => set("featureProjects", v)}
                />
                <FeatureToggle
                  label="Auctions"
                  description="Auction listings and auction results"
                  enabled={settings.featureAuctions}
                  onChange={v => set("featureAuctions", v)}
                />
                <FeatureToggle
                  label="Property Management"
                  description="Landlord & rental management service page"
                  enabled={settings.featurePropertyManagement}
                  onChange={v => set("featurePropertyManagement", v)}
                />
                <FeatureToggle
                  label="News & Market Insights"
                  description="Blog/news articles and suburb market reports"
                  enabled={settings.featureNews}
                  onChange={v => set("featureNews", v)}
                />
                <FeatureToggle
                  label="Suburb Guides"
                  description="Suburb profile pages with market data"
                  enabled={settings.featureSuburbGuides}
                  onChange={v => set("featureSuburbGuides", v)}
                />
                <FeatureToggle
                  label="Property Intelligence"
                  description="CoreLogic / RP Data valuation module"
                  enabled={settings.featurePropertyIntelligence}
                  onChange={v => set("featurePropertyIntelligence", v)}
                />
                <FeatureToggle
                  label="Digital Documents"
                  description="FLK it over e-signature integration"
                  enabled={settings.featureDocuments}
                  onChange={v => set("featureDocuments", v)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button (bottom) */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
            <Button type="button" variant="outline" size="sm" className="text-xs">Reset to Defaults</Button>
            <Button type="submit" variant="gold" size="sm" className="text-xs gap-1.5">
              <Save className="h-3.5 w-3.5" />
              Save All Settings
            </Button>
          </div>
        </form>

        {/* ── RIGHT: Preview + Env Export ───────────────────────── */}
        <div className="space-y-6">

          {/* Live Brand Preview */}
          <Card className="border-2 border-[#c5a059]/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Eye className="h-4 w-4 text-[#c5a059]" />
                Live Brand Preview
              </CardTitle>
              <CardDescription className="text-[11px]">Updates instantly as you edit</CardDescription>
            </CardHeader>
            <CardContent>
              <BrandPreview s={settings} />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#c5a059]" />
                Configuration Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Agency Identity", ok: !!settings.agencyName && !!settings.abn },
                { label: "Contact Details", ok: !!settings.email && !!settings.phone },
                { label: "Brand Colours", ok: !!settings.colorPrimary && !!settings.colorAccent },
                { label: "Logo Configured", ok: !!settings.logoUrl },
                { label: "MRI Connected", ok: !settings.mriDemoMode && !!settings.mriVaultApiKey },
                { label: "Features Configured", ok: true },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">{label}</span>
                  <div className={`flex items-center gap-1 font-bold ${ok ? "text-emerald-600" : "text-amber-500"}`}>
                    {ok ? (
                      <><CheckCircle2 className="h-3.5 w-3.5" /> Ready</>
                    ) : (
                      <><AlertTriangle className="h-3.5 w-3.5" /> Incomplete</>
                    )}
                  </div>
                </div>
              ))}

              {/* Feature count */}
              <div className="pt-2 mt-2 border-t border-slate-100">
                <p className="text-[10px] text-slate-500">
                  <span className="font-bold text-emerald-600">
                    {[settings.featureCustomerPortal, settings.featureCommercial, settings.featureProjects,
                      settings.featureAuctions, settings.featurePropertyManagement, settings.featureNews,
                      settings.featureSuburbGuides, settings.featurePropertyIntelligence, settings.featureDocuments]
                      .filter(Boolean).length}
                    /9
                  </span> features enabled
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Env Export */}
          <EnvVarPanel s={settings} />

        </div>
      </div>
    </div>
  );
}
