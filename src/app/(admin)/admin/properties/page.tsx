"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building2, Search, Filter, ShieldCheck, Eye, RefreshCw, Star, Edit, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";

export default function AdminPropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = MOCK_AUSTRALIAN_PROPERTIES.filter(
    (p) =>
      p.streetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.externalId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
            Property Administration
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            MRI Authoritative property listings. Website overrides remain intact without altering CRM data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/mri">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>MRI Sync Centre</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search address, suburb, or MRI ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium">
                <option value="">All Listing Types</option>
                <option value="RESIDENTIAL_SALE">For Sale</option>
                <option value="RESIDENTIAL_RENT">For Rent</option>
              </select>
              <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium">
                <option value="">All MRI Providers</option>
                <option value="VAULT">MRI Vault</option>
                <option value="PROPERTY_TREE">Property Tree</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property List Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">
                <tr>
                  <th className="py-3.5 px-4">Photo & Address</th>
                  <th className="py-3.5 px-4">Listing Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Agent & Office</th>
                  <th className="py-3.5 px-4">MRI Provider & ID</th>
                  <th className="py-3.5 px-4">Website Visibility</th>
                  <th className="py-3.5 px-4">SEO Health</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProperties.map((prop) => (
                  <tr key={prop.externalId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={prop.photos[0]}
                        alt={prop.headline}
                        className="h-12 w-16 rounded-lg object-cover border border-slate-200 shadow-xs"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{prop.streetNumber} {prop.streetName}</p>
                        <p className="text-[11px] text-slate-500">{prop.suburb} {prop.state} {prop.postcode}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">
                        {prop.listingType === "RESIDENTIAL_SALE" ? "For Sale" : "For Rent"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={prop.status === "FOR_SALE" ? "sale" : prop.status === "FOR_RENT" ? "rent" : "underOffer"}>
                        {prop.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{prop.priceDisplay}</td>
                    <td className="py-3.5 px-4">
                      <p className="text-slate-900 font-semibold">{prop.primaryAgentName}</p>
                      <p className="text-[10px] text-slate-500">{prop.officeName}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold w-fit">
                          {prop.provider}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">{prop.externalId}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>Public Active</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-600 font-semibold text-[11px]">Optimal (100%)</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Featured Property Toggle">
                          <Star className="h-4 w-4 text-amber-500" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit Website Overrides">
                          <Edit className="h-4 w-4 text-slate-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
