"use client";

import { useMemo, useState } from "react";
import { BookUser, Download, Mail, Phone, Search, UserPlus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type ContactKind = "LEAD" | "AGENT" | "CUSTOMER" | "TENANT";
export interface ContactView { id: string; name: string; email: string; phone: string; type: ContactKind; sources: string[]; location: string; lastActivity: string; matchFlags: number; notes: string }

const inputClass = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm";

export function ContactsManager({ initialContacts }: { initialContacts: ContactView[] }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [search, setSearch] = useState(""); const [filter, setFilter] = useState<"ALL" | ContactKind>("ALL");
  const [showAdd, setShowAdd] = useState(false); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  const filtered = useMemo(() => contacts.filter((contact) => (filter === "ALL" || contact.type === filter) && (!search || `${contact.name} ${contact.email} ${contact.phone} ${contact.location}`.toLowerCase().includes(search.toLowerCase()))), [contacts, filter, search]);
  const duplicateCount = contacts.filter((contact) => contact.matchFlags > 0).length;

  async function addContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    const form = event.currentTarget; const data = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/admin/contacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaving(false);
    if (!response.ok) { const payload = await response.json().catch(() => null); setError(payload?.error ?? "Could not create this contact."); return; }
    const payload = await response.json();
    const type = data.type as "LEAD" | "TENANT";
    setContacts((current) => [{ id: payload.id, name: `${data.firstName} ${data.lastName}`, email: String(data.email), phone: String(data.phone), type, sources: ["MANUAL"], location: "", lastActivity: new Date().toISOString(), matchFlags: 0, notes: String(data.notes ?? "") }, ...current]);
    form.reset(); setShowAdd(false);
  }

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a192f] text-[#c5a059]"><BookUser className="h-5 w-5" /></div><h1 className="font-serif text-3xl font-bold text-[#0a192f]">Unified Contact Centre</h1><Badge variant="gold">Live Database</Badge></div><p className="mt-1 text-sm text-slate-500">Leads, tenants, customers and agents from production records.</p></div><Button variant="gold" onClick={() => setShowAdd(true)}><UserPlus className="mr-2 h-4 w-4" />Add contact</Button></div>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{(["LEAD", "TENANT", "CUSTOMER", "AGENT"] as ContactKind[]).map((type) => <Card key={type}><CardContent className="p-4"><p className="text-xs uppercase text-slate-500">{type.toLowerCase()}s</p><p className="font-serif text-3xl font-bold text-[#0a192f]">{contacts.filter((contact) => contact.type === type).length}</p></CardContent></Card>)}</div>
    {duplicateCount > 0 && <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900">{duplicateCount} contacts have potential duplicate matches awaiting review.</p>}
    <div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, phone or location…" className="w-full rounded-lg border bg-slate-50 py-2 pl-9 pr-3 text-xs" /></div><div className="flex flex-wrap gap-2">{(["ALL", "LEAD", "TENANT", "CUSTOMER", "AGENT"] as const).map((type) => <button key={type} onClick={() => setFilter(type)} className={`rounded-lg px-3 py-2 text-xs font-bold ${filter === type ? "bg-[#0a192f] text-white" : "border bg-white text-slate-700"}`}>{type}</button>)}</div></div>
    <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="border-b bg-slate-50 text-slate-500"><tr><th className="p-4">Contact</th><th className="p-4">Type</th><th className="p-4">Source</th><th className="p-4">Location</th><th className="p-4">Last activity</th><th className="p-4 text-right">Actions</th></tr></thead><tbody className="divide-y">{filtered.map((contact) => <tr key={`${contact.type}:${contact.id}`} className="hover:bg-slate-50"><td className="p-4"><strong className="block text-sm text-slate-900">{contact.name}</strong><a href={`mailto:${contact.email}`} className="mt-1 flex items-center gap-1 text-slate-600"><Mail className="h-3 w-3" />{contact.email}</a>{contact.phone && <a href={`tel:${contact.phone}`} className="mt-1 flex items-center gap-1 text-slate-600"><Phone className="h-3 w-3" />{contact.phone}</a>}</td><td className="p-4"><Badge variant={contact.type === "AGENT" ? "success" : contact.type === "LEAD" ? "warning" : "sale"}>{contact.type}</Badge></td><td className="p-4">{contact.sources.join(", ")}</td><td className="p-4">{contact.location || "—"}</td><td className="p-4">{new Date(contact.lastActivity).toLocaleString("en-AU")}</td><td className="p-4 text-right"><a href={`/api/contacts/${contact.id}/vcard?type=${contact.type.toLowerCase()}`} className="inline-flex items-center rounded-md border border-slate-200 px-3 py-2 font-medium hover:bg-slate-50"><Download className="mr-1 h-3.5 w-3.5" />vCard</a></td></tr>)}{filtered.length === 0 && <tr><td colSpan={6} className="p-12 text-center text-slate-500">No contacts match these filters.</td></tr>}</tbody></table></div></CardContent></Card>
    {showAdd && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><Card className="w-full max-w-lg"><CardContent className="space-y-4 p-6"><div className="flex items-center justify-between"><h2 className="font-serif text-xl font-bold">Add contact</h2><button onClick={() => setShowAdd(false)} aria-label="Close"><X className="h-5 w-5" /></button></div><form onSubmit={addContact} className="space-y-4"><div className="grid gap-3 sm:grid-cols-2"><input name="firstName" required placeholder="First name" className={inputClass} /><input name="lastName" required placeholder="Last name" className={inputClass} /></div><input name="email" required type="email" placeholder="Email" className={inputClass} /><input name="phone" required type="tel" placeholder="Phone" className={inputClass} /><select name="type" className={inputClass}><option value="LEAD">Lead</option><option value="TENANT">Tenant</option></select><textarea name="notes" rows={4} placeholder="Notes" className={inputClass} />{error && <p role="alert" className="text-sm text-rose-700">{error}</p>}<Button disabled={saving} type="submit" variant="gold" className="w-full">{saving ? "Saving…" : "Create contact"}</Button></form></CardContent></Card></div>}
  </div>;
}
