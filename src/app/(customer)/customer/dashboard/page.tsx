import React from "react";
import Link from "next/link";
import { Heart, Search, Bell, Calendar, ArrowRight, MapPin, Bed, Bath, Car, Eye, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/ui/stats-card";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";

export default function CustomerDashboardPage() {
  const savedProperties = MOCK_AUSTRALIAN_PROPERTIES.slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#071325] text-white rounded-2xl p-6 sm:p-8 space-y-2 shadow-md">
        <Badge variant="gold">Customer Portal</Badge>
        <h1 className="font-serif text-3xl font-bold">Welcome back, James</h1>
        <p className="text-sm text-slate-300 font-light">
          Manage your saved Australian properties, automated property alert triggers, and upcoming weekend inspection registrations.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Saved Properties" value={savedProperties.length} icon={Heart} subtitle="In your favorites list" />
        <StatsCard title="Saved Searches" value="2" icon={Search} subtitle="Active criteria" />
        <StatsCard title="Property Alerts" value="Active" icon={Bell} subtitle="Daily email digest" />
        <StatsCard title="Registered Inspections" value="1 Session" icon={Calendar} subtitle="Saturday 29 Aug" />
      </div>

      {/* Saved Properties Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-xl">Your Saved Properties</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Properties you are tracking for price updates or auction sessions</p>
          </div>
          <Link href="/customer/favourites">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <span>View All ({savedProperties.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {savedProperties.map((item) => (
            <div key={item.externalId} className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-all">
              <div className="relative aspect-16/9 bg-slate-100">
                <img src={item.photos[0]} alt={item.headline} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2">
                  <Badge variant={item.listingType === "RESIDENTIAL_SALE" ? "sale" : "rent"}>
                    {item.listingType === "RESIDENTIAL_SALE" ? "For Sale" : "For Rent"}
                  </Badge>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <p className="font-serif font-bold text-lg text-[#0a192f]">{item.priceDisplay}</p>
                <p className="text-xs text-slate-600 font-semibold line-clamp-1">{item.headline}</p>
                <p className="text-[11px] text-slate-500">{item.streetNumber} {item.streetName}, {item.suburb}</p>
                <Link href={`/property/${item.externalId}`} className="block pt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View Property Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Active Saved Searches & Alert Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Saved Search Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">3+ Bedroom Houses under $1.5M in Parramatta</span>
                <Badge variant="success">DAILY ALERTS ACTIVE</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">Parramatta + surrounding suburbs | Min 2 baths | Max $1,500,000</p>
            </div>
            <Link href="/buy?suburb=Parramatta&minBeds=3">
              <Button variant="gold" size="sm" className="text-xs">
                Run Search Now
              </Button>
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">Coastal Luxury Apartments Bondi Beach</span>
                <Badge variant="success">INSTANT ALERTS ACTIVE</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">Bondi Beach | 2+ beds | Min 1 car space</p>
            </div>
            <Link href="/buy?suburb=Bondi+Beach">
              <Button variant="gold" size="sm" className="text-xs">
                Run Search Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
