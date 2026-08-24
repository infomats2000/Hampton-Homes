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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  matchFlags?: number;
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
  MRI: { label: "MRI", color: "text-emerald-700", bg: "bg-emerald-50 border border-emerald-200" },
  HOMEPASS: { label: "Homepass", color: "text-sky-700", bg: "bg-sky-50 border border-sky-200" },
  PROPERTYME: { label: "PropertyMe", color: "text-cyan-700", bg: "bg-cyan-50 border border-cyan-200" },
  GOOGLE: { label: "Google", color: "text-rose-700", bg: "bg-rose-50 border border-rose-200" },
  MICROSOFT: { label: "Microsoft", color: "text-blue-700", bg: "bg-blue-50 border border-blue-200" },
  MANUAL: { label: "Manual", color: "text-slate-700", bg: "bg-slate-100 border border-slate-200" },
};

const TYPE_CONFIG: Record<ContactType, { label: string; badge: string }> = {
  LEAD: { label: "Lead", badge: "bg-amber-100 text-amber-900 border-amber-300 font-bold" },
  AGENT: { label: "Agent", badge: "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold" },
  CUSTOMER: { label: "Customer", badge: "bg-blue-100 text-blue-900 border-blue-300 font-bold" },
  TENANT: { label: "Tenant", badge: "bg-purple-100 text-purple-900 border-purple-300 font-bold" },
};

export default function UnifiedContactsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | ContactType>("ALL");

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#0a192f] text-[#c5a059] flex items-center justify-center shadow-xs">
              <BookUser className="h-5 w-5" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">Unified Contact Centre</h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Synchronised client contacts from MRI Vault, Homepass, PropertyMe, Google &amp; Microsoft.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {duplicatesCount > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold shadow-2xs">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>{duplicatesCount} Potential Duplicates Found</span>
            </div>
          )}
          <Button variant="gold" size="lg" className="gap-2 text-xs font-bold shadow-md">
            <UserPlus className="h-4 w-4" />
            <span>Add New Contact</span>
          </Button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Contacts", value: DEMO_CONTACTS.length, color: "text-[#0a192f]" },
          { label: "Leads", value: DEMO_CONTACTS.filter((c) => c.type === "LEAD").length, color: "text-amber-600" },
          { label: "Tenants", value: DEMO_CONTACTS.filter((c) => c.type === "TENANT").length, color: "text-purple-600" },
          { label: "Agents", value: DEMO_CONTACTS.filter((c) => c.type === "AGENT").length, color: "text-emerald-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1">
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{stat.label}</p>
            <p className={`font-serif text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search contacts by name, email, or suburb..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["ALL", "LEAD", "AGENT", "CUSTOMER", "TENANT"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                typeFilter === t
                  ? "bg-[#0a192f] text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {t === "ALL" ? "All Contacts" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts High-Contrast White Table */}
      <Card className="border border-slate-200 shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 whitespace-nowrap">
                <tr>
                  <th className="py-3.5 px-5">Contact Details</th>
                  <th className="py-3.5 px-5 hidden md:table-cell">Category</th>
                  <th className="py-3.5 px-5 hidden lg:table-cell">Sync Sources</th>
                  <th className="py-3.5 px-5 hidden xl:table-cell">Location</th>
                  <th className="py-3.5 px-5 hidden lg:table-cell">Last Activity</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((contact) => {
                  const typeCfg = TYPE_CONFIG[contact.type];
                  return (
                    <tr key={contact.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-[#0a192f] text-[#c5a059] font-serif font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                            {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{contact.name}</span>
                              {contact.matchFlags && contact.matchFlags > 0 ? (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                                  <GitMerge className="h-3 w-3 text-amber-600" />
                                  {contact.matchFlags} Match
                                </span>
                              ) : null}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-600">
                              <span className="flex items-center gap-1.5 font-mono text-slate-700">
                                <Mail className="h-3.5 w-3.5 text-slate-400" />
                                {contact.email}
                              </span>
                              {contact.phone && (
                                <span className="hidden sm:flex items-center gap-1.5 font-mono text-slate-700">
                                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                                  {contact.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 hidden md:table-cell whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] border ${typeCfg.badge}`}>
                          {typeCfg.label}
                        </span>
                      </td>

                      <td className="py-4 px-5 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1.5">
                          {contact.sources.map((src) => {
                            const srcCfg = SOURCE_CONFIG[src];
                            return (
                              <span key={src} className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${srcCfg.bg} ${srcCfg.color}`}>
                                {srcCfg.label}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      <td className="py-4 px-5 hidden xl:table-cell text-xs font-semibold text-slate-800 whitespace-nowrap">
                        {contact.suburb}
                      </td>

                      <td className="py-4 px-5 hidden lg:table-cell text-xs font-mono text-slate-500 whitespace-nowrap">
                        {contact.lastActivity}
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadVCard(contact.id, contact.type)}
                          title="Export vCard (.vcf)"
                          className="gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0a192f]"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Export vCard</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <BookUser className="h-10 w-10 mx-auto mb-3 opacity-40 text-slate-400" />
              <p className="font-semibold text-slate-600">No contacts match your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Guides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Smartphone, label: "Apple Contacts Sync", description: "Download .vcf card to sync directly with iOS & macOS Contacts app.", color: "text-slate-800" },
          { icon: Globe2, label: "Google Contacts Sync", description: "Import exported vCard files into contacts.google.com.", color: "text-rose-600" },
          { icon: Monitor, label: "Microsoft Outlook Sync", description: "Import contacts into Microsoft 365 & Outlook People.", color: "text-blue-600" },
        ].map((guide) => {
          const Icon = guide.icon;
          return (
            <div key={guide.label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                <Icon className={`h-5 w-5 ${guide.color}`} />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#0a192f]">{guide.label}</p>
                <p className="text-[11px] text-slate-500 leading-snug">{guide.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
