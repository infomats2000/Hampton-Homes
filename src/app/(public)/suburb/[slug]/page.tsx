"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Bed, Bath, Car, ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";
import { MOCK_AGENTS } from "@/lib/properties/service";

export default function SuburbLandingPage() {
  const params = useParams();
  const slug = (params.slug as string) || "parramatta-nsw-2150";

  // Parse suburb name from slug
  const suburbName = slug.split("-")[0].toUpperCase() || "PARRAMATTA";
  const formattedSuburb = suburbName.charAt(0) + suburbName.slice(1).toLowerCase();

  const suburbProperties = MOCK_AUSTRALIAN_PROPERTIES.filter(
    (p) => p.suburb.toLowerCase() === formattedSuburb.toLowerCase()
  );
  const displayProperties = suburbProperties.length > 0 ? suburbProperties : MOCK_AUSTRALIAN_PROPERTIES;

  return (
    <div className="py-12 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Hero Banner */}
        <div className="bg-[#071325] text-white rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
          <Badge variant="gold">Suburb Market Insight</Badge>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold leading-tight">
            Real Estate in {formattedSuburb}, NSW
          </h1>
          <p className="text-slate-300 text-base font-light max-w-2xl">
            Discover luxury homes for sale, apartments for rent, and recent sales in {formattedSuburb}. Synchronized directly from MRI Vault.
          </p>

          <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
            <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">Median Sale: $1,480,000</span>
            <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">Median Rent: $750 / wk</span>
            <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">12 Month Growth: +8.4%</span>
          </div>
        </div>

        {/* Active Suburb Properties */}
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-serif text-3xl font-bold text-[#0a192f]">
                Active Listings in {formattedSuburb}
              </h2>
              <p className="text-xs text-slate-500 mt-1">Live properties imported from MRI Vault & Property Tree</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayProperties.map((item) => (
              <Card key={item.externalId} className="overflow-hidden group hover:shadow-xl transition-all">
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={item.photos[0]}
                    alt={item.headline}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={item.listingType === "RESIDENTIAL_SALE" ? "sale" : "rent"}>
                      {item.listingType === "RESIDENTIAL_SALE" ? "For Sale" : "For Rent"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6 space-y-3">
                  <p className="font-serif text-xl font-bold text-[#0a192f]">{item.priceDisplay}</p>
                  <h3 className="font-serif font-bold text-base text-[#0a192f] line-clamp-1">
                    {item.headline}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {item.streetNumber} {item.streetName}, {item.suburb}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
                    <span>{item.bedrooms} Beds</span>
                    <span>{item.bathrooms} Baths</span>
                    <span>{item.carSpaces} Cars</span>
                  </div>

                  <Link href={`/property/${item.externalId}`} className="block pt-2">
                    <Button variant="outline" className="w-full justify-between text-xs">
                      <span>View Listing Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Local Agents in Suburb */}
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <h2 className="font-serif text-3xl font-bold text-[#0a192f]">
            Local Real Estate Agents in {formattedSuburb}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_AGENTS.map((ag) => (
              <Card key={ag.id} className="p-6 flex items-center gap-4">
                <img src={ag.photoUrl} alt={ag.name} className="h-16 w-16 rounded-full object-cover border-2 border-[#c5a059]" />
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-base">{ag.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{ag.position}</p>
                  <Link href={`/agents/${ag.slug}`} className="text-xs text-[#b38b38] font-bold mt-1 block">
                    View Agent Profile →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
