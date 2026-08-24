"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Filter,
  Grid,
  List,
  Map as MapIcon,
  Columns,
  Bed,
  Bath,
  Car,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Building2,
  CheckCircle2,
  ShieldCheck,
  SearchX,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";
import { MRIRawProperty } from "@/lib/mri/provider.interface";
import { SafeImage } from "@/components/ui/safe-image";

export interface SearchPortalProps {
  defaultListingType?: "RESIDENTIAL_SALE" | "RESIDENTIAL_RENT" | "COMMERCIAL_SALE" | "PROJECT";
  title: string;
  subtitle: string;
}

export function SearchPortal({ defaultListingType = "RESIDENTIAL_SALE", title, subtitle }: SearchPortalProps) {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minBeds, setMinBeds] = useState<string>("");
  const [minBaths, setMinBaths] = useState<string>("");
  const [minCars, setMinCars] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map" | "split">("grid");
  const [selectedMapProperty, setSelectedMapProperty] = useState<MRIRawProperty | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    return MOCK_AUSTRALIAN_PROPERTIES.filter((p) => {
      // Listing type match
      if (defaultListingType === "RESIDENTIAL_SALE" && p.listingType !== "RESIDENTIAL_SALE") {
        if (p.status === "SOLD") return true; // Include sold properties
        return false;
      }
      if (defaultListingType === "RESIDENTIAL_RENT" && p.listingType !== "RESIDENTIAL_RENT") return false;

      // Text search match (Suburb, Street, Postcode, Headline)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesAddress =
          p.streetName.toLowerCase().includes(term) ||
          p.suburb.toLowerCase().includes(term) ||
          p.postcode.includes(term) ||
          p.headline.toLowerCase().includes(term);
        if (!matchesAddress) return false;
      }

      // Property type filter
      if (propertyType && p.propertyType !== propertyType) return false;

      // Bedroom filter
      if (minBeds && p.bedrooms < parseInt(minBeds, 10)) return false;

      // Bathroom filter
      if (minBaths && p.bathrooms < parseInt(minBaths, 10)) return false;

      // Car spaces filter
      if (minCars && p.carSpaces < parseInt(minCars, 10)) return false;

      // Price filter
      if (minPrice && p.priceNumeric && p.priceNumeric < parseInt(minPrice, 10)) return false;
      if (maxPrice && p.priceNumeric && p.priceNumeric > parseInt(maxPrice, 10)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return (a.priceNumeric || 0) - (b.priceNumeric || 0);
      if (sortBy === "price_desc") return (b.priceNumeric || 0) - (a.priceNumeric || 0);
      if (sortBy === "suburb") return a.suburb.localeCompare(b.suburb);
      return 0; // Default newest
    });
  }, [searchTerm, propertyType, minBeds, minBaths, minCars, minPrice, maxPrice, sortBy, defaultListingType]);

  const activeFilterCount = [searchTerm, propertyType, minPrice, maxPrice, minBeds, minBaths, minCars].filter(Boolean).length;

  const resetFilters = () => {
    setSearchTerm("");
    setPropertyType("");
    setMinPrice("");
    setMaxPrice("");
    setMinBeds("");
    setMinBaths("");
    setMinCars("");
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <Badge variant="gold">MRI Verified Search</Badge>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0a192f] mt-1">{title}</h1>
            <p className="text-sm text-slate-500 mt-1 font-light">{subtitle}</p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "grid" ? "bg-[#0a192f] text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Grid className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "list" ? "bg-[#0a192f] text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "map" ? "bg-[#0a192f] text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <MapIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Map</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "split" ? "bg-[#0a192f] text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Columns className="h-4 w-4" />
              <span className="hidden sm:inline">Split</span>
            </button>
          </div>
        </div>

        {/* Filter Control Bar */}
        <Card className="shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {/* Location Input */}
              <div className="md:col-span-2 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Suburb, Postcode or Address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>

              {/* Property Type Selector */}
              <div>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                >
                  <option value="">All Property Types</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Villa">Villa</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* Bedroom Minimum */}
              <div>
                <select
                  value={minBeds}
                  onChange={(e) => setMinBeds(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                >
                  <option value="">Any Bedrooms</option>
                  <option value="1">1+ Bedrooms</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>
              </div>

              {/* Sort Selector */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="price_asc">Sort: Price Low to High</option>
                  <option value="price_desc">Sort: Price High to Low</option>
                  <option value="suburb">Sort: Suburb A-Z</option>
                </select>
              </div>
            </div>

            {/* Additional Filter Ribbon & Clear Filters */}
            {activeFilterCount > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">
                  {activeFilterCount} Active Filter{activeFilterCount > 1 ? "s" : ""} Applied
                </span>
                <button onClick={resetFilters} className="text-rose-600 font-semibold hover:underline flex items-center gap-1">
                  <X className="h-3.5 w-3.5" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Info & Count */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Showing {filteredProperties.length} Properties</span>
          <span className="text-[#0a192f] font-mono">100% MRI Synchronized</span>
        </div>

        {/* Empty State when 0 properties match */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 sm:p-14 border border-slate-200 text-center space-y-4 max-w-lg mx-auto shadow-xs my-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#c5a059] border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
              <SearchX className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif text-2xl font-bold text-[#0a192f]">No properties match your search criteria</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                We couldn&apos;t find any properties matching your current filter selection. Try expanding your price range, suburb, or bedroom criteria.
              </p>
            </div>
            <div className="pt-3">
              <Button variant="gold" size="lg" onClick={resetFilters} className="gap-2 text-xs font-bold px-6 shadow-sm">
                <RefreshCw className="h-4 w-4" />
                <span>Clear All Filters</span>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Dynamic View Modes Rendering */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredProperties.map((item) => (
                  <PropertyCard key={item.externalId} item={item} />
                ))}
              </div>
            )}

            {viewMode === "list" && (
              <div className="space-y-4">
                {filteredProperties.map((item) => (
                  <PropertyListRow key={item.externalId} item={item} />
                ))}
              </div>
            )}

            {(viewMode === "map" || viewMode === "split") && (
              <div className={`grid grid-cols-1 ${viewMode === "split" ? "lg:grid-cols-2" : ""} gap-8`}>
                {/* Interactive Map Visual Mock */}
                <div className="relative min-h-[500px] rounded-2xl bg-slate-900 overflow-hidden shadow-xl border border-slate-800 flex flex-col items-center justify-center p-6 text-white text-center">
                  <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')` }} />
                  
                  {/* Map Pins Simulation */}
                  <div className="relative z-10 space-y-4 max-w-md">
                    <div className="flex items-center justify-center gap-2">
                      <MapIcon className="h-8 w-8 text-[#c5a059]" />
                      <h3 className="font-serif text-2xl font-bold">Interactive Australian Map View</h3>
                    </div>
                    <p className="text-xs text-slate-300">
                      Select a property marker pin to preview pricing, agent details, and inspection schedules.
                    </p>

                    {/* Simulated Pins Buttons */}
                    <div className="flex flex-wrap gap-2 justify-center pt-2">
                      {filteredProperties.map((item) => (
                        <button
                          key={item.externalId}
                          onClick={() => setSelectedMapProperty(item)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md ${
                            selectedMapProperty?.externalId === item.externalId
                              ? "bg-[#c5a059] text-slate-900 ring-2 ring-white scale-110"
                              : "bg-[#0a192f] text-white hover:bg-slate-800"
                          }`}
                        >
                          📍 {item.suburb} - {item.priceDisplay.split(" ")[0]}
                        </button>
                      ))}
                    </div>

                    {/* Selected Marker Details Drawer */}
                    {selectedMapProperty && (
                      <div className="bg-white text-slate-900 rounded-xl p-4 shadow-2xl text-left space-y-2 mt-4 border border-slate-200 animate-fadeIn">
                        <Badge variant="sale">{selectedMapProperty.status}</Badge>
                        <p className="font-serif text-lg font-bold text-[#0a192f]">{selectedMapProperty.priceDisplay}</p>
                        <p className="text-xs text-slate-600 font-semibold">{selectedMapProperty.streetNumber} {selectedMapProperty.streetName}, {selectedMapProperty.suburb}</p>
                        <Link href={`/property/${selectedMapProperty.externalId}`}>
                          <Button variant="gold" size="sm" className="w-full mt-2 text-xs">
                            View Full Property Listing →
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Split Mode List Column */}
                {viewMode === "split" && (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {filteredProperties.map((item) => (
                      <PropertyListRow key={item.externalId} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PropertyCard({ item }: { item: MRIRawProperty }) {
  return (
    <Link href={`/property/${item.externalId}`} className="block group">
      <Card className="overflow-hidden h-full hover:shadow-xl transition-all border border-slate-200">
        <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
          <SafeImage
            src={item.photos[0]}
            alt={item.headline}
            fallbackTitle={item.suburb}
            fallbackSubtitle={item.priceDisplay}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={item.listingType === "RESIDENTIAL_SALE" ? "sale" : "rent"}>
              {item.listingType === "RESIDENTIAL_SALE" ? "For Sale" : "For Rent"}
            </Badge>
            <Badge variant="gold">MRI Verified</Badge>
          </div>
          <div className="absolute bottom-3 left-3 right-3 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-lg text-white">
            <p className="font-serif text-xl font-bold">{item.priceDisplay}</p>
          </div>
        </div>

        <CardContent className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <MapPin className="h-3.5 w-3.5 text-[#c5a059] shrink-0" />
            <span className="truncate">{item.streetNumber} {item.streetName}, {item.suburb} {item.state}</span>
          </div>

          <h3 className="font-serif font-bold text-base sm:text-lg text-[#0a192f] line-clamp-1 group-hover:text-[#c5a059] transition-colors">
            {item.headline}
          </h3>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1"><Bed className="h-4 w-4 text-slate-400" /> {item.bedrooms} Beds</span>
            <span className="flex items-center gap-1"><Bath className="h-4 w-4 text-slate-400" /> {item.bathrooms} Baths</span>
            <span className="flex items-center gap-1"><Car className="h-4 w-4 text-slate-400" /> {item.carSpaces} Cars</span>
          </div>

          <div className="pt-2">
            <Button variant="outline" className="w-full justify-between text-xs group-hover:bg-[#0a192f] group-hover:text-white transition-colors">
              <span>View Details</span>
              <span>→</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function PropertyListRow({ item }: { item: MRIRawProperty }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-48 sm:w-64 shrink-0 bg-slate-100">
          <img src={item.photos[0]} alt={item.headline} className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2">
            <Badge variant={item.listingType === "RESIDENTIAL_SALE" ? "sale" : "rent"}>
              {item.listingType === "RESIDENTIAL_SALE" ? "For Sale" : "For Rent"}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl font-bold text-[#0a192f]">{item.priceDisplay}</span>
              <span className="text-xs font-mono text-slate-400">{item.provider} ID: {item.externalId}</span>
            </div>
            <h3 className="font-serif font-bold text-lg text-[#0a192f]">{item.headline}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-[#c5a059]" />
              <span>{item.streetNumber} {item.streetName}, {item.suburb} {item.state} {item.postcode}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
              <span>{item.bedrooms} Beds</span>
              <span>{item.bathrooms} Baths</span>
              <span>{item.carSpaces} Cars</span>
              <span>{item.propertyType}</span>
            </div>

            <Link href={`/property/${item.externalId}`}>
              <Button variant="gold" size="sm" className="text-xs">
                View Property Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
