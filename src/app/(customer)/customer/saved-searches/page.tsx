"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Trash2, Play, CheckCircle2, SlidersHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface SavedSearchItem {
  id: string;
  name: string;
  suburb: string;
  propertyType: string;
  priceLimit: string;
  bedrooms: string;
  frequency: "IMMEDIATELY" | "DAILY" | "WEEKLY";
  isEnabled: boolean;
}

export default function CustomerSavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearchItem[]>([
    {
      id: "search-01",
      name: "3+ Bed Houses in Parramatta under $1.5M",
      suburb: "Parramatta",
      propertyType: "House",
      priceLimit: "$1,500,000",
      bedrooms: "3+",
      frequency: "DAILY",
      isEnabled: true,
    },
    {
      id: "search-02",
      name: "Luxury Bondi Beach Oceanfront Apartments",
      suburb: "Bondi Beach",
      propertyType: "Apartment",
      priceLimit: "$3,000,000",
      bedrooms: "2+",
      frequency: "IMMEDIATELY",
      isEnabled: true,
    },
  ]);

  const toggleSearch = (id: string) => {
    setSearches(
      searches.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
  };

  const deleteSearch = (id: string) => {
    setSearches(searches.filter((s) => s.id !== id));
  };

  const updateFrequency = (id: string, frequency: "IMMEDIATELY" | "DAILY" | "WEEKLY") => {
    setSearches(
      searches.map((s) => (s.id === id ? { ...s, frequency } : s))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
            Saved Searches & Alert Triggers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Receive instant or digest email notifications whenever MRI imports a matching property.
          </p>
        </div>

        <Link href="/buy">
          <Button variant="gold" size="sm" className="gap-1.5 text-xs">
            <Plus className="h-4 w-4" />
            <span>Create New Saved Search</span>
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {searches.map((s) => (
          <Card key={s.id} className="hover:border-slate-300 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-lg text-[#0a192f]">{s.name}</span>
                    <Badge variant={s.isEnabled ? "success" : "outline"}>
                      {s.isEnabled ? "ALERTS ACTIVE" : "PAUSED"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Suburb: <span className="font-semibold text-slate-900">{s.suburb}</span> | Type:{" "}
                    <span className="font-semibold text-slate-900">{s.propertyType}</span> | Max Price:{" "}
                    <span className="font-semibold text-slate-900">{s.priceLimit}</span> | Beds:{" "}
                    <span className="font-semibold text-slate-900">{s.bedrooms}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.isEnabled}
                      onChange={() => toggleSearch(s.id)}
                      className="h-4 w-4 rounded border-slate-300 text-[#0a192f] focus:ring-[#0a192f]"
                    />
                    <span>Active</span>
                  </label>

                  <button
                    onClick={() => deleteSearch(s.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Search"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Alert Frequency Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-[#c5a059]" />
                  <span className="font-semibold text-slate-700">Notification Frequency:</span>
                  <select
                    value={s.frequency}
                    onChange={(e) => updateFrequency(s.id, e.target.value as "IMMEDIATELY" | "DAILY" | "WEEKLY")}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="IMMEDIATELY">Immediately on Sync</option>
                    <option value="DAILY">Daily Morning Digest</option>
                    <option value="WEEKLY">Weekly Digest</option>
                  </select>
                </div>

                <Link href={`/buy?suburb=${encodeURIComponent(s.suburb)}`}>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Play className="h-3.5 w-3.5" />
                    <span>Run Search Now</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
