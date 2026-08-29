"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AGENCY_NAME } from "@/lib/agency-config";

const inputClass = "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a192f]";

export default function SellPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/appraisals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSubmitting(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "We could not submit your request. Please try again.");
      return;
    }
    form.reset();
    setSubmitted(true);
  }

  return <div className="min-h-screen space-y-12 bg-slate-50 py-12"><div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
    <div className="space-y-3 text-center"><Badge variant="gold">Property Valuation &amp; Sales</Badge><h1 className="font-serif text-4xl font-bold text-[#0a192f] sm:text-5xl">Request a Free Property Appraisal</h1><p className="mx-auto max-w-xl text-base font-light text-slate-600">Tell us about your property and a local licensed agent will contact you to arrange an appraisal.</p></div>
    {submitted ? <Card className="space-y-4 border-2 border-emerald-300 bg-emerald-50/50 p-12 text-center"><CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600" /><h2 className="font-serif text-3xl font-bold text-slate-900">Appraisal Request Submitted</h2><p className="mx-auto max-w-md text-sm text-slate-700">Thank you for contacting {AGENCY_NAME}. Your request is now in our appraisal pipeline and a team member will contact you shortly.</p><Button variant="outline" onClick={() => setSubmitted(false)}>Submit another property</Button></Card> :
    <Card className="border border-slate-200 shadow-lg"><CardContent className="space-y-6 p-8 sm:p-12"><form onSubmit={handleSubmit} className="space-y-6">
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <fieldset className="space-y-4"><legend className="w-full border-b border-slate-100 pb-2 font-serif text-lg font-bold text-[#0a192f]">1. Property information</legend>
        <label className="block space-y-1 text-xs font-semibold uppercase text-slate-500">Street address *<input name="address" required minLength={5} maxLength={200} placeholder="142 Church Street" className={inputClass} /></label>
        <div className="grid gap-4 sm:grid-cols-3"><label className="space-y-1 text-xs font-semibold uppercase text-slate-500">Suburb *<input name="suburb" required className={inputClass} /></label><label className="space-y-1 text-xs font-semibold uppercase text-slate-500">State *<select name="state" defaultValue="NSW" className={inputClass}>{["NSW", "VIC", "QLD", "ACT", "SA", "WA", "TAS", "NT"].map((state) => <option key={state}>{state}</option>)}</select></label><label className="space-y-1 text-xs font-semibold uppercase text-slate-500">Postcode *<input name="postcode" required inputMode="numeric" pattern="[0-9]{4}" maxLength={4} className={inputClass} /></label></div>
        <div className="grid gap-4 sm:grid-cols-3"><label className="space-y-1 text-xs font-semibold uppercase text-slate-500">Property type<select name="propertyType" defaultValue="House" className={inputClass}>{["House", "Apartment", "Townhouse", "Villa", "Land", "Commercial"].map((type) => <option key={type}>{type}</option>)}</select></label><label className="space-y-1 text-xs font-semibold uppercase text-slate-500">Bedrooms<select name="bedrooms" defaultValue="3" className={inputClass}>{[0, 1, 2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>{value === 6 ? "6+" : value}</option>)}</select></label><label className="space-y-1 text-xs font-semibold uppercase text-slate-500">Bathrooms<select name="bathrooms" defaultValue="2" className={inputClass}>{[0, 1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value === 5 ? "5+" : value}</option>)}</select></label></div>
      </fieldset>
      <fieldset className="space-y-4 border-t border-slate-100 pt-4"><legend className="w-full border-b border-slate-100 pb-2 font-serif text-lg font-bold text-[#0a192f]">2. Owner contact and timeframe</legend>
        <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1 text-xs font-semibold uppercase text-slate-500">Full name *<input name="ownerName" required minLength={2} maxLength={100} autoComplete="name" className={inputClass} /></label><label className="space-y-1 text-xs font-semibold uppercase text-slate-500">Mobile phone *<input name="ownerPhone" required minLength={8} maxLength={30} type="tel" autoComplete="tel" className={inputClass} /></label></div>
        <label className="block space-y-1 text-xs font-semibold uppercase text-slate-500">Email address *<input name="ownerEmail" required type="email" autoComplete="email" className={inputClass} /></label>
        <label className="block space-y-1 text-xs font-semibold uppercase text-slate-500">Selling timeframe<select name="sellingTimeframe" defaultValue="1_3_MONTHS" className={inputClass}><option value="IMMEDIATELY">Immediately (next 30 days)</option><option value="1_3_MONTHS">1 to 3 months</option><option value="3_6_MONTHS">3 to 6 months</option><option value="CURIOUS">Just curious about market value</option></select></label>
      </fieldset>
      {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      <Button disabled={submitting} type="submit" variant="gold" size="lg" className="w-full gap-2 text-base font-bold"><Send className="h-4 w-4" />{submitting ? "Submitting…" : "Submit free appraisal request"}</Button>
    </form></CardContent></Card>}
  </div></div>;
}
