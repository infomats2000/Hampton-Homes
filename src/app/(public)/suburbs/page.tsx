import React from "react";
import Link from "next/link";
import { MapPin, Building2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const MOCK_SUBURBS = [
  { name: "Parramatta", state: "NSW", postcode: "2150", slug: "parramatta-nsw-2150", count: 24, medianSale: "$1,480,000" },
  { name: "Bondi Beach", state: "NSW", postcode: "2026", slug: "bondi-beach-nsw-2026", count: 36, medianSale: "$2,850,000" },
  { name: "Manly", state: "NSW", postcode: "2095", slug: "manly-nsw-2095", count: 18, medianRent: "$2,100 / wk" },
  { name: "Mosman", state: "NSW", postcode: "2088", slug: "mosman-nsw-2088", count: 15, medianSale: "$4,500,000" },
  { name: "Surry Hills", state: "NSW", postcode: "2010", slug: "surry-hills-nsw-2010", count: 20, medianSale: "$2,420,000" },
];

export default function SuburbsDirectoryPage() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="gold">Australian Locations</Badge>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0a192f]">
            Suburb Real Estate Guides
          </h1>
          <p className="text-slate-600 text-base font-light">
            In-depth market statistics, active sales, rental listings, and local agents across key Australian suburbs.
          </p>
        </div>

        {/* Suburb Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_SUBURBS.map((sub) => (
            <Card key={sub.slug} className="overflow-hidden hover:shadow-xl transition-all">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#c5a059]" />
                  <h3 className="font-serif font-bold text-2xl text-[#0a192f]">{sub.name}</h3>
                  <span className="text-xs font-bold text-slate-400 font-mono">{sub.state} {sub.postcode}</span>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span>{sub.count} Active Properties</span>
                  <span className="text-[#0a192f] font-bold">{sub.medianSale || sub.medianRent}</span>
                </div>

                <Link href={`/suburb/${sub.slug}`} className="block pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#0a192f] hover:text-[#c5a059]">
                    <span>Explore Suburb Market & Listings</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
