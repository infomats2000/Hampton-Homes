"use client";

import React, { useState } from "react";
import {
  BookUser,
  Search,
  Filter,
  Download,
  UserPlus,
  Phone,
  Mail,
  ExternalLink,
  ChevronDown,
  Tag,
  GitMerge,
  AlertTriangle,
  CheckCircle2,
  Smartphone,
  Globe2,
  Monitor,
} from "lucide-react";

type ContactSource = "MRI" | "HOMEPASS" | "PROPERTYME" | "GOOGLE" | "MICROSOFT" | "MANUAL";
type ContactType = "LEAD" | "AGENT" | "CUSTOMER" | "TENANT";

interface UnifiedContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: ContactType;
  sources: ContactSource[];
  status?: string;
  suburb?: string;
  lastActivity?: string;
  matchFlags?: number; // potential duplicate count
}

const DEMO_CONTACTS: UnifiedContact[] = [
  { id: "1", name: "James Carrington", email: "james.carrington@gmail.com", phone: "+61 411 234 567", type: "LEAD", sources: ["MRI", "HOMEPASS"], suburb: "Mosman NSW", lastActivity: "2 hours ago", matchFlags: 0 },
  { id: "2", name: "Sophia Williams", email: "sophia.w@outlook.com", phone: "+61 421 345 678", type: "LEAD", sources: ["MRI"], suburb: "Cremorne NSW", lastActivity: "Yesterday", matchFlags: 1 },
  { id: "3", name: "Liam Chen", email: "liam.chen@example.com.au", phone: "+61 400 123 456", type: "TENANT", sources: ["PROPERTYME"], suburb: "Neutral Bay NSW", lastActivity: "3 days ago", matchFlags: 0 },
  { id: "4", name: "Olivia Martinez", email: "olivia.m@gmail.com", phone: "+61 431 456 789", type: "CUSTOMER", sources: ["MRI", "GOOGLE"], suburb: "Kirribilli NSW", lastActivity: "1 week ago", matchFlags: 0 },
  { id: "5", name: "Noah Thompson", email: "noah.t@icloud.com", phone: "+61 405 567 890", type: "LEAD", sources: ["HOMEPASS"], suburb: "Manly NSW", lastActivity: "2 weeks ago", matchFlags: 0 },
  { id: "6", name: "Emma Davies", email: "emma.davies@company.com.au", phone: "+61 412 678 901", type: "LEAD", sources: ["MRI", "MICROSOFT"], suburb: "Balmain NSW", lastActivity: "3 weeks ago", matchFlags: 2 },
  { id: "7", name: "William Johnson", email: "wjohnson@email.com", phone: "+61 422 789 012", type: "AGENT", sources: ["MRI", "GOOGLE"], suburb: "Sydney CBD", lastActivity: "1 hour ago", matchFlags: 0 },
  { id: "8", name: "Ava Brown", email: "ava.b@rentals.com", phone: "+61 433 890 123", type: "TENANT", sources: ["PROPERTYME", "MRI"], suburb: "Paddington NSW", lastActivity: "Today", matchFlags: 0 },
];

const SOURCE_CONFIG: Record<ContactSource, { label: string; color: string; bg: string }> = {
  MRI: { label: "MRI", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  HOMEPASS: { label: "Homepass", color: "text-blue-400", bg: "bg-blue-500/10" },
  PROPERTYME: { label: "PropertyMe", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  GOOGLE: { label: "Google", color: "text-red-400", bg: "bg-red-500/10" },
  MICROSOFT: { label: "Microsoft", color: "text-blue-500", bg: "bg-blue-600/10" },
  MANUAL: { label: "Manual", color: "text-slate-400", bg: "bg-slate-500/10" },
};

const TYPE_CONFIG: Record<ContactType, { label: string; color: string }> = {
  LEAD: { label: "Lead", color: "text-amber-400" },
  AGENT: { label: "Agent", color: "text-emerald-400" },
  CUSTOMER: { label: "Customer", color: "text-[#c5a059]" },
  TENANT: { label: "Tenant", color: "text-blue-400" },
};

export default function UnifiedContactsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | ContactType>("ALL");
  const [selectedContact, setSelectedContact] = useState<UnifiedContact | null>(null);

  const duplicatesCount = DEMO_CONTACTS.filter((c) => c.matchFlags && c.matchFlags > 0).length;

  const filtered = DEMO_CONTACTS.filter((c) => {
    const searchOk =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.suburb?.toLowerCase().includes(search.toLowerCase());
    const typeOk = typeFilter === "ALL" || c.type === typeFilter;
    return searchOk && typeOk;
  });

  const downloadVCard = (contactId: string, type: string) => {
    window.open(`/api/contacts/${contactId}/vcard?type=${type.toLowerCase()}`, "_blank");
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center">
              <BookUser className="h-5 w-5 text-[#c5a059]" />
            </div>
            <h1 className="text-2xl font-bold text-white">Unified Contact Centre</h1>
          </div>
          <p className="text-slate-400 text-sm">
            All contacts from MRI, Homepass, PropertyMe, Google & Microsoft in one place
          </p>
        </div>
        <div className="flex items-center gap-2">
          {duplicatesCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-xs font-medium">
              <AlertTriangle className="h-3.5 w-3.5" />
              {duplicatesCount} Potential Duplicates
            </div>
          )}
          <button className="flex items-center gap-2 px-4 py-2 bg-[#c5a059] hover:bg-[#b8923f] text-slate-900 rounded-lg text-sm font-semibold transition-colors">
            <UserPlus className="h-4 w-4" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Contacts", value: DEMO_CONTACTS.length },
          { label: "Leads", value: DEMO_CONTACTS.filter((c) => c.type === "LEAD").length },
          { label: "Tenants", value: DEMO_CONTACTS.filter((c) => c.type === "TENANT").length },
          { label: "Agents", value: DEMO_CONTACTS.filter((c) => c.type === "AGENT").length },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0d2444]/80 border border-slate-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search contacts by name, email, or suburb..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0d2444]/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#c5a059]/50"
          />
        </div>
        <div className="flex gap-2">
          {(["ALL", "LEAD", "AGENT", "CUSTOMER", "TENANT"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                typeFilter === t
                  ? "bg-[#c5a059] text-slate-900"
                  : "bg-[#0d2444]/80 border border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              {t === "ALL" ? "All" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-[#0d2444]/80 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Sources</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden xl:table-cell">Location</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Last Activity</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((contact) => {
                const typeCfg = TYPE_CONFIG[contact.type];
                return (
                  <tr key={contact.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-sm font-semibold text-white">
                          {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{contact.name}</span>
                            {contact.matchFlags && contact.matchFlags > 0 ? (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <GitMerge className="h-2.5 w-2.5" />
                                {contact.matchFlags} match
                              </span>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{contact.email}</span>
                            {contact.phone && <span className="hidden sm:flex items-center gap-1"><Phone className="h-3 w-3" />{contact.phone}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={`text-xs font-medium ${typeCfg.color}`}>{typeCfg.label}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {contact.sources.map((src) => {
                          const srcCfg = SOURCE_CONFIG[src];
                          return (
                            <span key={src} className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${srcCfg.bg} ${srcCfg.color}`}>
                              {srcCfg.label}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell text-xs text-slate-400">{contact.suburb}</td>
                    <td className="px-5 py-4 hidden lg:table-cell text-xs text-slate-500">{contact.lastActivity}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => downloadVCard(contact.id, contact.type)}
                          title="Export vCard (.vcf)"
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">vCard</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <BookUser className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No contacts match your search</p>
          </div>
        )}
      </div>

      {/* Export Guides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Smartphone, label: "Apple Contacts", description: "Download .vcf file and open in Apple Contacts", color: "text-slate-300" },
          { icon: Globe2, label: "Google Contacts", description: "Import .vcf via contacts.google.com", color: "text-red-400" },
          { icon: Monitor, label: "Outlook Contacts", description: "Import .vcf via Outlook People", color: "text-blue-400" },
        ].map((guide) => {
          const Icon = guide.icon;
          return (
            <div key={guide.label} className="bg-[#0d2444]/60 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${guide.color}`} />
              <div>
                <p className="text-sm font-medium text-white">{guide.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{guide.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
