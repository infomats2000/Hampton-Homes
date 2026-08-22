"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Lock, Sparkles, Save, CheckCircle2, AlertTriangle, ArrowLeft, ShieldCheck, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";
import { getPropertyById } from "@/lib/properties/service";

export default function AdminPropertyOverridePage() {
  const params = useParams();
  const id = (params.id as string) || "";
  const property = getPropertyById(id) || MOCK_AUSTRALIAN_PROPERTIES[0];

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [seoTitle, setSeoTitle] = useState(`${property.headline} | Hampton Homes ${property.suburb}`);
  const [seoDescription, setSeoDescription] = useState(property.description.slice(0, 150) + "...");
  const [customBadge, setCustomBadge] = useState("Prestige Waterfront");
  const [customHeadline, setCustomHeadline] = useState(property.headline);
  const [isFeaturedHomepage, setIsFeaturedHomepage] = useState(true);
  const [isFeaturedSearch, setIsFeaturedSearch] = useState(true);

  const handleSaveOverrides = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link href="/admin/properties" className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#0a192f] mb-2 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Property Administration</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
              Website Overrides & SEO Settings
            </h1>
            <Badge variant="gold">Section 25 Compliant</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {property.streetNumber} {property.streetName}, {property.suburb} {property.state} {property.postcode} (MRI ID: {property.externalId})
          </p>
        </div>

        <Button variant="gold" size="md" onClick={handleSaveOverrides} className="gap-2 text-xs">
          <Save className="h-4 w-4" />
          <span>Save Website Overrides</span>
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Website Overrides Saved Successfully! MRI authoritative data remains untouched.</span>
        </div>
      )}

      {/* Two Column Layout: Read-only MRI Managed vs Editable Website Managed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1: Read-Only MRI Managed Fields */}
        <Card className="border-l-4 border-l-slate-800 bg-slate-50/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                <Lock className="h-4 w-4 text-slate-500" />
                <span>MRI Managed Fields (Authoritative)</span>
              </CardTitle>
              <Badge variant="outline">READ-ONLY</Badge>
            </div>
            <CardDescription className="text-xs">
              Staff maintain these fields inside MRI Vault & Property Tree. Overwrites during website edit are strictly prohibited.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-medium">
            <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Property Address</span>
              <p className="text-slate-900 font-bold text-sm">
                {property.streetNumber} {property.streetName}, {property.suburb} {property.state} {property.postcode}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Listing Price</span>
                <p className="text-slate-900 font-bold">{property.priceDisplay}</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Listing Status</span>
                <p className="text-slate-900 font-bold">{property.status}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Bedrooms</span>
                <p className="text-slate-900 font-bold">{property.bedrooms}</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Bathrooms</span>
                <p className="text-slate-900 font-bold">{property.bathrooms}</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Car Spaces</span>
                <p className="text-slate-900 font-bold">{property.carSpaces}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Primary Listing Agent</span>
              <p className="text-slate-900 font-bold">{property.primaryAgentName} ({property.officeName})</p>
            </div>
          </CardContent>
        </Card>

        {/* Column 2: Editable Website Managed Overrides */}
        <Card className="border-l-4 border-l-[#c5a059]">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg text-[#0a192f]">
                <Sparkles className="h-4 w-4 text-[#c5a059]" />
                <span>Website Managed Overrides</span>
              </CardTitle>
              <Badge variant="gold">EDITABLE</Badge>
            </div>
            <CardDescription className="text-xs">
              Marketing administrators can customize website-only promotion and SEO titles without altering CRM data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSaveOverrides} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Custom Website Headline</label>
                <input
                  type="text"
                  value={customHeadline}
                  onChange={(e) => setCustomHeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Custom Promotional Badge</label>
                <input
                  type="text"
                  value={customBadge}
                  onChange={(e) => setCustomBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">SEO Page Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">SEO Meta Description</label>
                <textarea
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeaturedHomepage}
                    onChange={(e) => setIsFeaturedHomepage(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#0a192f] focus:ring-[#0a192f]"
                  />
                  <span className="text-slate-800 font-semibold">Promote to Homepage Featured Carousel</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeaturedSearch}
                    onChange={(e) => setIsFeaturedSearch(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#0a192f] focus:ring-[#0a192f]"
                  />
                  <span className="text-slate-800 font-semibold">Highlight in Search Results Top Positions</span>
                </label>
              </div>

              <Button type="submit" variant="gold" size="md" className="w-full gap-2 text-xs">
                <Save className="h-4 w-4" />
                <span>Save Website Overrides</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
