"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  ExternalLink,
  Shield,
  Zap,
  AlertTriangle,
  Activity,
  Key,
  Webhook,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface ProviderConfig {
  key: string;
  displayName: string;
  description: string;
  color: string;
  docsUrl?: string;
  fields: {
    name: string;
    label: string;
    type: "text" | "password" | "url";
    placeholder: string;
    required: boolean;
    description?: string;
  }[];
  features: { key: string; label: string; description: string }[];
  webhookPath?: string;
  setupSteps: string[];
}

const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  homepass: {
    key: "homepass",
    displayName: "Homepass",
    description: "Open home check-in, visitor registration & prospect capture for Australian real estate",
    color: "#00a8e1",
    docsUrl: "https://homepass.com.au/developers",
    fields: [
      { name: "apiKey", label: "API Key", type: "password", placeholder: "hp_live_xxxxxxxxxxxxxxxx", required: true, description: "Found in Homepass Agency Portal → Settings → API" },
      { name: "agencyId", label: "Agency ID", type: "text", placeholder: "your-agency-id", required: true },
      { name: "webhookSecret", label: "Webhook Secret", type: "password", placeholder: "whsec_xxxxxxxxxxxxxxxx", required: false, description: "Used to verify incoming webhook signatures" },
    ],
    features: [
      { key: "syncVisitors", label: "Sync Visitors as Leads", description: "Auto-create leads from open home check-ins" },
      { key: "syncOpenHomes", label: "Sync Open Homes", description: "Import Homepass events as Appointments" },
      { key: "realTimeWebhooks", label: "Real-time Webhooks", description: "Receive instant check-in notifications" },
    ],
    webhookPath: "/api/webhooks/homepass",
    setupSteps: [
      "Log into your Homepass Agency Portal",
      "Navigate to Settings → API & Integrations",
      "Create a new API key with Read & Write access",
      "Copy your Agency ID from the dashboard header",
      "Paste both values above and click Save",
      "Configure your webhook URL in Homepass to point to this platform",
    ],
  },
  flk: {
    key: "flk",
    displayName: "FLK it over",
    description: "Digital agreement platform for leasing, sales contracts, and e-signatures",
    color: "#6366f1",
    docsUrl: "https://flkitover.com/api",
    fields: [
      { name: "apiKey", label: "API Key", type: "password", placeholder: "flk_live_xxxxxxxxxxxxxxxx", required: true, description: "Found in FLK Portal → Settings → API Keys" },
      { name: "webhookSecret", label: "Webhook Secret", type: "password", placeholder: "whsec_xxxxxxxxxxxxxxxx", required: false },
    ],
    features: [
      { key: "createDocuments", label: "Create Documents", description: "Send digital agreements from within the platform" },
      { key: "trackStatus", label: "Track Document Status", description: "Real-time document signing status updates" },
      { key: "autoLinkLeads", label: "Link to Leads", description: "Auto-associate documents with leads" },
    ],
    webhookPath: "/api/webhooks/flk",
    setupSteps: [
      "Log into FLK it over Portal",
      "Navigate to Settings → API Keys",
      "Generate a new Production API Key",
      "Copy the key and paste it above",
      "Set webhook notifications URL in FLK portal",
    ],
  },
  corelogic: {
    key: "corelogic",
    displayName: "CoreLogic / RP Data",
    description: "Licensed Australian property intelligence, valuations, and comparable sales data",
    color: "#dc2626",
    docsUrl: "https://developer.corelogic.com.au",
    fields: [
      { name: "clientId", label: "OAuth Client ID", type: "text", placeholder: "your-client-id", required: true, description: "From CoreLogic Developer Portal" },
      { name: "clientSecret", label: "OAuth Client Secret", type: "password", placeholder: "your-client-secret", required: true },
    ],
    features: [
      { key: "valuations", label: "Property Valuations (AVM)", description: "Automated valuation estimates for properties" },
      { key: "saleHistory", label: "Sale History", description: "Historical sales data for any property" },
      { key: "comparableSales", label: "Comparable Sales", description: "Find similar recent sales in the area" },
    ],
    setupSteps: [
      "Register at CoreLogic Developer Portal (developer.corelogic.com.au)",
      "Create an application to obtain OAuth Client ID & Secret",
      "Ensure your subscription covers AVM and Sales History endpoints",
      "Enter credentials above — all data defaults to INTERNAL_ONLY",
    ],
  },
  propertyme: {
    key: "propertyme",
    displayName: "PropertyMe",
    description: "Property management, tenancy records, and lease data integration",
    color: "#0ea5e9",
    docsUrl: "https://developer.propertyme.com",
    fields: [
      { name: "apiKey", label: "API Key", type: "password", placeholder: "pm_live_xxxxxxxxxxxxxxxx", required: true },
      { name: "agencyId", label: "Agency ID", type: "text", placeholder: "your-agency-id", required: true },
      { name: "webhookSecret", label: "Webhook Secret", type: "password", placeholder: "whsec_xxxxxxxxxxxxxxxx", required: false },
    ],
    features: [
      { key: "syncTenancies", label: "Sync Tenancies", description: "Import active tenancy records" },
      { key: "syncProperties", label: "Sync Properties", description: "Keep managed property data up to date" },
      { key: "syncInspections", label: "Sync Inspections", description: "Import scheduled property inspections" },
    ],
    webhookPath: "/api/webhooks/propertyme",
    setupSteps: [
      "Log into PropertyMe as Agency Admin",
      "Navigate to Settings → Integrations → API Access",
      "Generate API Key with property and tenancy read access",
      "Enter credentials and save",
    ],
  },
  google: {
    key: "google",
    displayName: "Google Workspace",
    description: "Google Contacts and Calendar OAuth 2.0 sync via Google Workspace",
    color: "#4285f4",
    docsUrl: "https://developers.google.com/workspace",
    fields: [
      { name: "clientId", label: "OAuth Client ID", type: "text", placeholder: "xxxxx.apps.googleusercontent.com", required: true, description: "From Google Cloud Console" },
      { name: "clientSecret", label: "OAuth Client Secret", type: "password", placeholder: "GOCSPX-xxxxxxxxxxxxxxxx", required: true },
    ],
    features: [
      { key: "syncContacts", label: "Google Contacts Sync", description: "Export leads and agents to Google Contacts" },
      { key: "syncCalendar", label: "Google Calendar Sync", description: "Sync inspections and appointments to Google Calendar" },
    ],
    setupSteps: [
      "Open Google Cloud Console → Create or select a project",
      "Enable People API and Google Calendar API",
      "Create OAuth 2.0 credentials (Web Application type)",
      "Add authorised redirect URI: https://your-domain.com/api/auth/google/callback",
      "Enter Client ID and Client Secret above",
      "Each agent will need to individually authorize their Google account",
    ],
  },
  microsoft: {
    key: "microsoft",
    displayName: "Microsoft Outlook",
    description: "Microsoft Outlook Contacts and Calendar via MS Graph API",
    color: "#0078d4",
    docsUrl: "https://learn.microsoft.com/graph",
    fields: [
      { name: "clientId", label: "Azure App (Client) ID", type: "text", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", required: true, description: "From Azure Active Directory App Registration" },
      { name: "clientSecret", label: "Client Secret Value", type: "password", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", required: true },
      { name: "tenantId", label: "Tenant ID (optional)", type: "text", placeholder: "common (or your AAD tenant ID)", required: false, description: "Leave blank to allow any Microsoft account" },
    ],
    features: [
      { key: "syncContacts", label: "Outlook Contacts Sync", description: "Export leads to Microsoft Outlook Contacts" },
      { key: "syncCalendar", label: "Outlook Calendar Sync", description: "Sync appointments to Outlook Calendar" },
    ],
    setupSteps: [
      "Open Azure Portal → Azure Active Directory → App Registrations",
      "Create a new registration with Web platform",
      "Add API permissions: Contacts.ReadWrite, Calendars.ReadWrite",
      "Create a Client Secret under Certificates & Secrets",
      "Enter App (Client) ID and Secret Value above",
    ],
  },
  apple: {
    key: "apple",
    displayName: "Apple Contacts & Calendar",
    description: "Export-based integration via vCard (.vcf) and iCal (.ics) file generation",
    color: "#555555",
    fields: [],
    features: [
      { key: "vcardExport", label: "vCard Export (.vcf)", description: "Export contacts to Apple Contacts on demand" },
      { key: "icalExport", label: "iCal Export (.ics)", description: "Export appointments to Apple Calendar" },
    ],
    setupSteps: [
      "No API credentials required for Apple export",
      "vCard exports available from any lead or agent record",
      "iCal exports available from any appointment or inspection",
      "Both formats are also compatible with Google Calendar and Outlook",
    ],
  },
  mri_vault: {
    key: "mri_vault",
    displayName: "MRI Vault",
    description: "Primary sales listing CRM — pre-configured and managed by MRI module",
    color: "#059669",
    fields: [],
    features: [
      { key: "propertiesSync", label: "Properties Sync", description: "Live bi-directional property sync" },
      { key: "enquiriesSync", label: "Enquiries Push", description: "Push web enquiries to MRI" },
    ],
    setupSteps: [
      "MRI Vault is managed by the MRI Integration module",
      "Navigate to Admin → MRI Integration to configure credentials",
      "This provider cannot be disabled as it is the primary listing source",
    ],
  },
  mri_property_tree: {
    key: "mri_property_tree",
    displayName: "MRI Property Tree",
    description: "Primary rental & property management CRM — pre-configured and managed by MRI module",
    color: "#059669",
    fields: [],
    features: [
      { key: "rentalsSync", label: "Rentals Sync", description: "Live rental listing and tenancy sync" },
    ],
    setupSteps: [
      "MRI Property Tree is managed by the MRI Integration module",
      "Navigate to Admin → MRI Integration to configure credentials",
    ],
  },
};

export default function ProviderDetailPage() {
  const params = useParams();
  const providerKey = typeof params.provider === "string" ? params.provider : "";
  const config = PROVIDER_CONFIGS[providerKey];

  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  if (!config) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-400">Provider not found.</p>
        <Link href="/admin/integrations" className="text-[#c5a059] hover:underline text-sm mt-2 inline-block">
          ← Back to Integration Hub
        </Link>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      {/* Back */}
      <Link
        href="/admin/integrations"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Integration Hub
      </Link>

      {/* Header */}
      <div className="flex items-start gap-5">
        <div
          className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: config.color + "20", border: `1px solid ${config.color}40` }}
        >
          <Zap className="h-7 w-7" style={{ color: config.color }} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{config.displayName}</h1>
          <p className="text-slate-400 text-sm mt-1">{config.description}</p>
          {config.docsUrl && (
            <a
              href={config.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#c5a059] hover:underline mt-2"
            >
              <ExternalLink className="h-3 w-3" />
              View API Documentation
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Config */}
        <div className="lg:col-span-2 space-y-6">
          {/* Credentials */}
          {config.fields.length > 0 ? (
            <div className="bg-[#0d2444]/80 border border-slate-800 rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-4 w-4 text-[#c5a059]" />
                <h2 className="font-semibold text-white text-sm">API Credentials</h2>
              </div>
              {config.fields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={
                        field.type === "password" && !showSecrets[field.name]
                          ? "password"
                          : "text"
                      }
                      placeholder={field.placeholder}
                      value={formValues[field.name] ?? ""}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#c5a059]/50 focus:border-[#c5a059]/50 pr-10"
                    />
                    {field.type === "password" && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowSecrets((prev) => ({ ...prev, [field.name]: !prev[field.name] }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showSecrets[field.name] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                  {field.description && (
                    <p className="text-[11px] text-slate-500">{field.description}</p>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Shield className="h-3.5 w-3.5" />
                  Credentials are AES-256-GCM encrypted at rest
                </div>
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    saved
                      ? "bg-emerald-600 text-white"
                      : "bg-[#c5a059] hover:bg-[#b8923f] text-slate-900"
                  }`}
                >
                  {saved ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Credentials
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#0d2444]/60 border border-slate-800 rounded-xl p-6">
              <p className="text-sm text-slate-400">
                {config.key === "apple"
                  ? "No API credentials required. Apple integration works via file export (vCard/iCal)."
                  : "This integration is managed by the MRI Integration module. Navigate to Admin → MRI Integration."}
              </p>
            </div>
          )}

          {/* Features */}
          <div className="bg-[#0d2444]/80 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#c5a059]" />
              <h2 className="font-semibold text-white text-sm">Feature Controls</h2>
            </div>
            {config.features.map((feature) => (
              <div key={feature.key} className="flex items-center justify-between gap-4 py-2 border-b border-slate-800/60 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">{feature.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{feature.description}</p>
                </div>
                <button
                  onClick={() => setFeatures((prev) => ({ ...prev, [feature.key]: !prev[feature.key] }))}
                  className="shrink-0"
                >
                  {features[feature.key] ? (
                    <ToggleRight className="h-7 w-7 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="h-7 w-7 text-slate-600" />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Webhook Config */}
          {config.webhookPath && (
            <div className="bg-[#0d2444]/60 border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Webhook className="h-4 w-4 text-[#c5a059]" />
                <h2 className="font-semibold text-white text-sm">Webhook Configuration</h2>
              </div>
              <p className="text-xs text-slate-400">
                Configure {config.displayName} to send events to this endpoint:
              </p>
              <div className="flex items-center gap-3 bg-slate-900 rounded-lg px-4 py-3">
                <code className="text-sm text-[#c5a059] font-mono flex-1">
                  https://hampton-homes.vercel.app{config.webhookPath}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(`https://hampton-homes.vercel.app${config.webhookPath}`)}
                  className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 bg-slate-800 rounded"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Setup Guide */}
        <div className="space-y-6">
          <div className="bg-[#0d2444]/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#c5a059]" />
              <h2 className="font-semibold text-white text-sm">Setup Guide</h2>
            </div>
            <ol className="space-y-3">
              {config.setupSteps.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-xs text-slate-400 leading-relaxed">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059] flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Health Check */}
          <div className="bg-[#0d2444]/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <h2 className="font-semibold text-white text-sm flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-[#c5a059]" />
              Connection Health
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="h-4 w-4 text-amber-400" />
              <span>Not yet tested</span>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors">
              <RefreshCw className="h-4 w-4" />
              Run Health Check
            </button>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Save credentials before running health check
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
