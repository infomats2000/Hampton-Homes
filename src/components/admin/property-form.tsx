"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Archive, ArrowDown, ArrowLeft, ArrowUp, CheckCircle2, Save, Star, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PropertyInput } from "@/lib/properties/property-input";

type FormValues = PropertyInput & { photosText: string };

const defaults: FormValues = {
  streetNumber: "", streetName: "", suburb: "", state: "NSW", postcode: "",
  bedrooms: 0, bathrooms: 0, carSpaces: 0, propertyType: "House",
  listingType: "RESIDENTIAL_SALE", status: "DRAFT", headline: "", description: "",
  priceDisplay: "Contact Agent", photos: [], photosText: "", publish: false,
  customHeadline: "", customBadge: "", seoTitle: "", seoDescription: "",
  isFeaturedHomepage: false, isFeaturedSearch: false,
};

export function PropertyForm({ listingId, initialValues, mriManaged = false }: {
  listingId?: string;
  initialValues?: Partial<FormValues>;
  mriManaged?: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({ ...defaults, ...initialValues });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [removedStorageUrls, setRemovedStorageUrls] = useState<string[]>([]);
  const [uploadedThisSession, setUploadedThisSession] = useState<string[]>([]);

  const set = (name: keyof FormValues, value: string | number | boolean) => setValues((current) => ({ ...current, [name]: value }));
  const inputClass = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a192f] disabled:cursor-not-allowed disabled:opacity-60";
  const labelClass = "space-y-1 text-xs font-semibold text-slate-700";
  const photoUrls = values.photosText.split(/\r?\n/).map((url) => url.trim()).filter(Boolean);

  function setPhotoUrls(urls: string[]) { set("photosText", urls.join("\n")); }

  async function uploadImages(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true); setError("");
    const added: string[] = [];
    for (const file of Array.from(files)) {
      const data = new FormData(); data.set("file", file);
      const response = await fetch("/api/admin/uploads/property-images", { method: "POST", body: data });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) { setError(`${file.name}: ${result.error ?? "Upload failed"}`); break; }
      added.push(result.url);
    }
    if (added.length) { setPhotoUrls([...photoUrls, ...added]); setUploadedThisSession((current) => [...current, ...added]); }
    setUploading(false);
  }

  async function removePhoto(url: string) {
    setPhotoUrls(photoUrls.filter((item) => item !== url));
    if (uploadedThisSession.includes(url)) {
      await fetch("/api/admin/uploads/property-images", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      setUploadedThisSession((current) => current.filter((item) => item !== url));
    } else if (url.includes("storage.googleapis.com/")) setRemovedStorageUrls((current) => [...current, url]);
  }

  function movePhoto(index: number, direction: -1 | 1) {
    const target = index + direction; if (target < 0 || target >= photoUrls.length) return;
    const next = [...photoUrls]; [next[index], next[target]] = [next[target], next[index]]; setPhotoUrls(next);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    const photos = values.photosText.split(/\r?\n/).map((url) => url.trim()).filter(Boolean);
    const payload = { ...values, photos, priceNumeric: values.priceNumeric || undefined, landAreaSqm: values.landAreaSqm || undefined, buildingAreaSqm: values.buildingAreaSqm || undefined };
    const response = await fetch(listingId ? `/api/admin/properties/${listingId}` : "/api/admin/properties", {
      method: listingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) { setError(result.error ?? "Unable to save the property"); return; }
    await Promise.allSettled(removedStorageUrls.map((url) => fetch("/api/admin/uploads/property-images", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) })));
    setRemovedStorageUrls([]); setUploadedThisSession([]);
    setMessage("Property saved successfully.");
    if (!listingId) router.push(`/admin/properties/${result.id}`);
    router.refresh();
  }

  async function archive() {
    if (!listingId || !window.confirm("Archive this listing? It will immediately disappear from the public website.")) return;
    setSaving(true); setError("");
    const response = await fetch(`/api/admin/properties/${listingId}`, { method: "DELETE" });
    setSaving(false);
    if (!response.ok) { setError("Unable to archive the property"); return; }
    router.push("/admin/properties"); router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/admin/properties" className="mb-2 flex items-center gap-1 text-xs font-medium text-slate-500"><ArrowLeft className="h-3.5 w-3.5" />Back to properties</Link>
          <h1 className="font-serif text-3xl font-bold text-[#0a192f]">{listingId ? "Edit Property" : "Add Property"}</h1>
          <p className="mt-1 text-sm text-slate-500">Save as a draft or publish it immediately to the public website.</p>
        </div>
        <div className="flex gap-2">
          {listingId && <Button type="button" variant="outline" onClick={archive} disabled={saving} className="gap-2 text-rose-700"><Archive className="h-4 w-4" />Archive</Button>}
          <Button type="submit" variant="gold" disabled={saving || uploading} className="gap-2"><Save className="h-4 w-4" />{saving ? "Saving…" : "Save Property"}</Button>
        </div>
      </div>

      {message && <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"><CheckCircle2 className="h-5 w-5" />{message}</div>}
      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">{error}</div>}
      {mriManaged && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">This record originated in MRI. Changes here affect the website database only and may be replaced by a future MRI synchronisation.</div>}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card><CardHeader><CardTitle>Address and specifications</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className={labelClass}>Street number<input required className={inputClass} value={values.streetNumber} onChange={(e) => set("streetNumber", e.target.value)} /></label>
            <label className={`${labelClass} lg:col-span-3`}>Street name<input required className={inputClass} value={values.streetName} onChange={(e) => set("streetName", e.target.value)} /></label>
            <label className={`${labelClass} sm:col-span-2`}>Suburb<input required className={inputClass} value={values.suburb} onChange={(e) => set("suburb", e.target.value)} /></label>
            <label className={labelClass}>State<input required className={inputClass} value={values.state} onChange={(e) => set("state", e.target.value)} /></label>
            <label className={labelClass}>Postcode<input required inputMode="numeric" pattern="[0-9]{4}" className={inputClass} value={values.postcode} onChange={(e) => set("postcode", e.target.value)} /></label>
            <label className={labelClass}>Bedrooms<input type="number" min="0" className={inputClass} value={values.bedrooms} onChange={(e) => set("bedrooms", Number(e.target.value))} /></label>
            <label className={labelClass}>Bathrooms<input type="number" min="0" className={inputClass} value={values.bathrooms} onChange={(e) => set("bathrooms", Number(e.target.value))} /></label>
            <label className={labelClass}>Car spaces<input type="number" min="0" className={inputClass} value={values.carSpaces} onChange={(e) => set("carSpaces", Number(e.target.value))} /></label>
            <label className={labelClass}>Property type<select className={inputClass} value={values.propertyType} onChange={(e) => set("propertyType", e.target.value)}><option>House</option><option>Apartment</option><option>Townhouse</option><option>Villa</option><option>Land</option><option>Commercial</option></select></label>
            <label className={labelClass}>Land area (m²)<input type="number" min="0" className={inputClass} value={values.landAreaSqm ?? ""} onChange={(e) => set("landAreaSqm", Number(e.target.value))} /></label>
            <label className={labelClass}>Building area (m²)<input type="number" min="0" className={inputClass} value={values.buildingAreaSqm ?? ""} onChange={(e) => set("buildingAreaSqm", Number(e.target.value))} /></label>
          </CardContent></Card>

          <Card><CardHeader><CardTitle>Listing details</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>Listing type<select className={inputClass} value={values.listingType} onChange={(e) => set("listingType", e.target.value)}><option value="RESIDENTIAL_SALE">Residential sale</option><option value="RESIDENTIAL_RENT">Residential rent</option><option value="COMMERCIAL_SALE">Commercial sale</option><option value="COMMERCIAL_RENT">Commercial rent</option><option value="PROJECT">Project</option></select></label>
            <label className={labelClass}>Status<select className={inputClass} value={values.status} onChange={(e) => set("status", e.target.value)}>{["DRAFT","COMING_SOON","FOR_SALE","FOR_RENT","AUCTION","UNDER_OFFER","UNDER_CONTRACT","SOLD","LEASED","WITHDRAWN","OFF_MARKET"].map((status) => <option key={status}>{status}</option>)}</select></label>
            <label className={`${labelClass} sm:col-span-2`}>Headline<input required className={inputClass} value={values.headline} onChange={(e) => set("headline", e.target.value)} /></label>
            <label className={labelClass}>Displayed price<input required className={inputClass} value={values.priceDisplay} onChange={(e) => set("priceDisplay", e.target.value)} /></label>
            <label className={labelClass}>Numeric price<input type="number" min="0" className={inputClass} value={values.priceNumeric ?? ""} onChange={(e) => set("priceNumeric", Number(e.target.value))} /></label>
            <label className={`${labelClass} sm:col-span-2`}>Description<textarea required rows={9} className={inputClass} value={values.description} onChange={(e) => set("description", e.target.value)} /></label>
            <div className="space-y-3 sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-semibold text-slate-700">Property photos</p><p className="text-[11px] text-slate-500">JPEG, PNG or WebP · maximum 10 MB each. The first image is primary.</p></div><label className="cursor-pointer"><input type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" disabled={uploading} onChange={(e) => uploadImages(e.target.files)} /><span className="inline-flex items-center gap-2 rounded-lg bg-[#0a192f] px-4 py-2 text-xs font-semibold text-white"><Upload className="h-4 w-4" />{uploading ? "Uploading…" : "Upload images"}</span></label></div>
              {photoUrls.length > 0 ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{photoUrls.map((url, index) => <div key={url} className="overflow-hidden rounded-xl border bg-white"><div className="relative aspect-4/3 bg-slate-100"><img src={url} alt={`Property photo ${index + 1}`} className="h-full w-full object-cover" />{index === 0 && <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-bold text-slate-900"><Star className="h-3 w-3" />Primary</span>}</div><div className="flex items-center justify-between p-2"><span className="text-[10px] text-slate-500">Photo {index + 1}</span><div className="flex gap-1"><button type="button" aria-label="Move photo up" disabled={index === 0} onClick={() => movePhoto(index, -1)} className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button><button type="button" aria-label="Move photo down" disabled={index === photoUrls.length - 1} onClick={() => movePhoto(index, 1)} className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button><button type="button" aria-label="Remove photo" onClick={() => removePhoto(url)} className="rounded p-1 text-rose-600 hover:bg-rose-50"><X className="h-4 w-4" /></button></div></div></div>)}</div> : <div className="rounded-xl border border-dashed p-8 text-center text-xs text-slate-500">No photos uploaded yet.</div>}
              <details><summary className="cursor-pointer text-[11px] text-slate-500">Add an external image URL</summary><textarea rows={3} className={`${inputClass} mt-2`} value={values.photosText} onChange={(e) => set("photosText", e.target.value)} placeholder="One https:// URL per line" /></details>
            </div>
          </CardContent></Card>
        </div>

        <div className="space-y-6">
          <Card><CardHeader><CardTitle>Publishing</CardTitle></CardHeader><CardContent className="space-y-4 text-sm">
            <label className="flex items-start gap-3"><input type="checkbox" className="mt-1 h-4 w-4" checked={values.publish} onChange={(e) => set("publish", e.target.checked)} /><span><strong>Publicly visible</strong><small className="block text-slate-500">Uncheck to keep this listing private.</small></span></label>
            <label className="flex items-start gap-3"><input type="checkbox" className="mt-1 h-4 w-4" checked={values.isFeaturedHomepage} onChange={(e) => set("isFeaturedHomepage", e.target.checked)} /><span>Feature on homepage</span></label>
            <label className="flex items-start gap-3"><input type="checkbox" className="mt-1 h-4 w-4" checked={values.isFeaturedSearch} onChange={(e) => set("isFeaturedSearch", e.target.checked)} /><span>Highlight in search</span></label>
          </CardContent></Card>
          <Card><CardHeader><CardTitle>Website and SEO</CardTitle></CardHeader><CardContent className="space-y-4">
            <label className={labelClass}>Website headline<input className={inputClass} value={values.customHeadline} onChange={(e) => set("customHeadline", e.target.value)} /></label>
            <label className={labelClass}>Promotional badge<input className={inputClass} value={values.customBadge} onChange={(e) => set("customBadge", e.target.value)} /></label>
            <label className={labelClass}>SEO title<input maxLength={70} className={inputClass} value={values.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} /></label>
            <label className={labelClass}>SEO description<textarea maxLength={170} rows={4} className={inputClass} value={values.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} /></label>
          </CardContent></Card>
        </div>
      </div>
    </form>
  );
}
