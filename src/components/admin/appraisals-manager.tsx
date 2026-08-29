"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Mail, Phone, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AppraisalView {
  id: string; leadId: string; ownerName: string; ownerEmail: string; ownerPhone: string;
  address: string; suburb: string; state: string; postcode: string; propertyType: string;
  bedrooms: number; bathrooms: number; sellingTimeframe: string; status: string;
  assignedAgentId: string; assignedAgentName: string; scheduledAt: string; createdAt: string;
}
export interface AppraisalAgent { id: string; name: string; officeName: string }

const statuses = ["NEW", "ASSIGNED", "SCHEDULED", "COMPLETED", "ARCHIVED"];

export function AppraisalsManager({ initialAppraisals, agents }: { initialAppraisals: AppraisalView[]; agents: AppraisalAgent[] }) {
  const [items, setItems] = useState(initialAppraisals);
  const [selectedId, setSelectedId] = useState(initialAppraisals[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const selected = items.find((item) => item.id === selectedId) ?? null;
  const filtered = useMemo(() => items.filter((item) => (!filter || item.status === filter) && (!search || `${item.ownerName} ${item.ownerEmail} ${item.address} ${item.suburb}`.toLowerCase().includes(search.toLowerCase()))), [items, search, filter]);

  async function save(update: { status?: string; assignedAgentId?: string; scheduledAt?: string }) {
    if (!selected) return;
    const status = update.status ?? selected.status;
    const assignedAgentId = update.assignedAgentId ?? selected.assignedAgentId;
    const scheduledAt = update.scheduledAt ?? selected.scheduledAt;
    setSaving(true); setError("");
    const response = await fetch(`/api/admin/appraisals/${selected.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, assignedAgentId: assignedAgentId || null, scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null }) });
    setSaving(false);
    if (!response.ok) { const payload = await response.json().catch(() => null); setError(payload?.error ?? "Could not update this appraisal."); return; }
    const agent = agents.find((candidate) => candidate.id === assignedAgentId);
    setItems((current) => current.map((item) => item.id === selected.id ? { ...item, status, assignedAgentId, assignedAgentName: agent?.name ?? "Unassigned", scheduledAt } : item));
  }

  return <div className="space-y-6">
    <Card><CardContent className="flex flex-col gap-3 p-4 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search owner, email or address…" className="w-full rounded-lg border bg-slate-50 py-2 pl-9 pr-3 text-xs" /></div><select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border bg-slate-50 px-3 py-2 text-xs"><option value="">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></CardContent></Card>
    <div className="grid gap-6 lg:grid-cols-3"><Card className="lg:col-span-2"><CardHeader><CardTitle>Appraisal pipeline ({filtered.length})</CardTitle></CardHeader><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="border-y bg-slate-50 text-slate-500"><tr><th className="p-3">Owner</th><th className="p-3">Property</th><th className="p-3">Status</th><th className="p-3">Agent</th></tr></thead><tbody className="divide-y">{filtered.map((item) => <tr key={item.id} onClick={() => setSelectedId(item.id)} className={`cursor-pointer hover:bg-slate-50 ${selectedId === item.id ? "bg-amber-50" : ""}`}><td className="p-3"><strong className="block text-slate-900">{item.ownerName}</strong><span className="text-slate-500">{item.ownerEmail}</span></td><td className="p-3"><strong className="block">{item.address}</strong><span>{item.suburb} {item.state} {item.postcode}</span></td><td className="p-3"><Badge variant={item.status === "NEW" ? "warning" : item.status === "COMPLETED" ? "success" : "sale"}>{item.status}</Badge></td><td className="p-3">{item.assignedAgentName}</td></tr>)}{filtered.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-slate-500">No appraisal requests match these filters.</td></tr>}</tbody></table></div></CardContent></Card>
      {selected ? <Card className="h-fit border-l-4 border-l-[#c5a059] lg:sticky lg:top-24"><CardHeader><CardTitle>{selected.address}</CardTitle><p className="text-xs text-slate-500">Received {new Date(selected.createdAt).toLocaleString("en-AU")}</p></CardHeader><CardContent className="space-y-4 text-xs"><div className="space-y-2 rounded-lg border bg-slate-50 p-3"><strong>{selected.ownerName}</strong><a href={`mailto:${selected.ownerEmail}`} className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#c5a059]" />{selected.ownerEmail}</a><a href={`tel:${selected.ownerPhone}`} className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#c5a059]" />{selected.ownerPhone}</a><p>{selected.propertyType} · {selected.bedrooms} bed · {selected.bathrooms} bath</p><p>Timeframe: {selected.sellingTimeframe.replaceAll("_", " ")}</p></div>
        <label className="block space-y-1 font-semibold">Assigned agent<select disabled={saving} value={selected.assignedAgentId} onChange={(event) => save({ assignedAgentId: event.target.value, status: event.target.value && selected.status === "NEW" ? "ASSIGNED" : selected.status })} className="w-full rounded-lg border bg-white px-3 py-2"><option value="">Unassigned</option>{agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name} · {agent.officeName}</option>)}</select></label>
        <label className="block space-y-1 font-semibold"><span className="flex items-center gap-1"><CalendarClock className="h-4 w-4" />Appointment</span><input disabled={saving} type="datetime-local" value={selected.scheduledAt} onChange={(event) => save({ scheduledAt: event.target.value, status: "SCHEDULED" })} className="w-full rounded-lg border bg-white px-3 py-2" /></label>
        <label className="block space-y-1 font-semibold">Status<select disabled={saving} value={selected.status} onChange={(event) => save({ status: event.target.value })} className="w-full rounded-lg border bg-white px-3 py-2">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        {error && <p role="alert" className="text-rose-700">{error}</p>}<a href={`/admin/leads?selected=${selected.leadId}`} className="block w-full rounded-md border border-slate-200 px-3 py-2 text-center font-medium hover:bg-slate-50">Open linked lead</a>
      </CardContent></Card> : <Card className="p-8 text-center text-xs text-slate-500">Select an appraisal request to manage it.</Card>}
    </div>
  </div>;
}
