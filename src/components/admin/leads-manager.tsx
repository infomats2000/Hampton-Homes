"use client";

import { useMemo, useState } from "react";
import { Mail, Phone, Search, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface LeadView {
  id: string; name: string; email: string; phone: string; leadType: string; status: string; priority: string;
  propertyAddress: string; assignedAgentName: string; officeName: string; createdAt: string; notes: string;
  activities: Array<{ id: string; description: string; actorName: string; createdAt: string }>;
}

// Reports will be wired to the same server data in the reporting milestone.
export const EMPTY_LEADS: LeadView[] = [];

const statuses = ["NEW", "ASSIGNED", "CONTACTED", "QUALIFIED", "APPOINTMENT_BOOKED", "NEGOTIATING", "WON", "LOST", "ARCHIVED"];

export function LeadsManager({ initialLeads }: { initialLeads: LeadView[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [selectedId, setSelectedId] = useState(initialLeads[0]?.id ?? "");
  const [search, setSearch] = useState(""); const [filter, setFilter] = useState("");
  const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  const selected = leads.find((lead) => lead.id === selectedId) ?? null;
  const filtered = useMemo(() => leads.filter((lead) => (!filter || lead.status === filter) && (!search || `${lead.name} ${lead.email} ${lead.propertyAddress}`.toLowerCase().includes(search.toLowerCase()))), [leads, search, filter]);

  async function updateStatus(status: string) {
    if (!selected) return; setSaving(true); setError("");
    const response = await fetch(`/api/admin/leads/${selected.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setSaving(false);
    if (!response.ok) { setError("Could not update this lead."); return; }
    setLeads((current) => current.map((lead) => lead.id === selected.id ? { ...lead, status } : lead));
  }

  return <div className="space-y-6">
    <Card><CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
      <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email or property…" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs" /></div>
      <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs"><option value="">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
    </CardContent></Card>
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2"><CardHeader><CardTitle>Lead pipeline ({filtered.length})</CardTitle></CardHeader><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="border-y bg-slate-50 text-slate-500"><tr><th className="p-3">Contact</th><th className="p-3">Property</th><th className="p-3">Status</th><th className="p-3">Agent</th></tr></thead><tbody className="divide-y">{filtered.map((lead) => <tr key={lead.id} onClick={() => setSelectedId(lead.id)} className={`cursor-pointer hover:bg-slate-50 ${selectedId === lead.id ? "bg-amber-50" : ""}`}><td className="p-3"><strong className="block text-slate-900">{lead.name}</strong><span className="text-slate-500">{lead.email}</span></td><td className="p-3 text-slate-700">{lead.propertyAddress || "General enquiry"}</td><td className="p-3"><Badge variant={lead.status === "NEW" ? "warning" : lead.status === "WON" ? "success" : "sale"}>{lead.status}</Badge></td><td className="p-3">{lead.assignedAgentName}</td></tr>)}{filtered.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-slate-500">No leads match these filters.</td></tr>}</tbody></table></div></CardContent></Card>
      {selected ? <Card className="h-fit border-l-4 border-l-[#c5a059] lg:sticky lg:top-24"><CardHeader><CardTitle>{selected.name}</CardTitle><p className="text-xs text-slate-500">Received {new Date(selected.createdAt).toLocaleString("en-AU")}</p></CardHeader><CardContent className="space-y-4 text-xs">
        <div className="space-y-2 rounded-lg border bg-slate-50 p-3"><a href={`mailto:${selected.email}`} className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#c5a059]" />{selected.email}</a><a href={`tel:${selected.phone}`} className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#c5a059]" />{selected.phone}</a>{selected.propertyAddress && <p className="flex gap-2"><Tag className="h-4 w-4 text-[#c5a059]" />{selected.propertyAddress}</p>}</div>
        <label className="block space-y-1 font-semibold">Pipeline status<select disabled={saving} value={selected.status} onChange={(e) => updateStatus(e.target.value)} className="w-full rounded-lg border bg-white px-3 py-2">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        {error && <p role="alert" className="text-rose-700">{error}</p>}
        <div><strong>Assigned agent</strong><p className="mt-1 rounded-lg border p-2">{selected.assignedAgentName} · {selected.officeName}</p></div>
        <div><strong>Message</strong><p className="mt-1 whitespace-pre-wrap rounded-lg border bg-slate-50 p-3 leading-relaxed">{selected.notes}</p></div>
        <div className="space-y-2 border-t pt-3"><strong>Activity</strong>{selected.activities.map((activity) => <div key={activity.id} className="rounded-lg bg-slate-50 p-2"><p>{activity.description}</p><small className="text-slate-500">{activity.actorName} · {new Date(activity.createdAt).toLocaleString("en-AU")}</small></div>)}</div>
      </CardContent></Card> : <Card className="p-8 text-center text-xs text-slate-500">Select a lead to view its details.</Card>}
    </div>
  </div>;
}
