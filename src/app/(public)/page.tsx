import React from "react";
import Link from "next/link";
import { Search, MapPin, Bed, Bath, Car, ArrowRight, ShieldCheck, Sparkles, Building, PhoneCall, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";
import { AGENCY_NAME, AGENCY_TAGLINE } from "@/lib/agency-config";
import { SafeImage } from "@/components/ui/safe-image";

export default function HomePage() {
  const featuredProperties = MOCK_AUSTRALIAN_PROPERTIES.slice(0, 3);

  return (
    <div className="space-y-12 sm:space-y-20 pb-16 sm:pb-20 overflow-x-hidden">
      {/* Hero Section with Search Portal */}
      <section className="relative min-h-[550px] sm:min-h-[600px] flex items-center justify-center bg-[#071325] text-white overflow-hidden py-16 sm:py-24">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-25 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071325] via-[#071325]/70 to-transparent z-0" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[11px] sm:text-xs font-medium text-[#d4af37]">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>Australia&apos;s Authoritative MRI Synchronized Property Portal</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
            {AGENCY_NAME}
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            {AGENCY_TAGLINE}. Explore premium residential sales, luxury rentals, and iconic
            coastal estates.
          </p>

          {/* Search Box Card */}
          <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-6 shadow-2xl max-w-4xl mx-auto text-left border border-slate-200">
            {/* Buy / Rent Tabs */}
            <div className="flex gap-2 border-b border-slate-200 pb-3 mb-4 overflow-x-auto no-scrollbar">
              <Link href="/buy" className="px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm bg-[#0a192f] text-white shrink-0">
                Buy
              </Link>
              <Link href="/rent" className="px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0">
                Rent
              </Link>
              <Link href="/sold" className="px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0">
                Sold
              </Link>
              <Link href="/commercial" className="px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0">
                Commercial
              </Link>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="md:col-span-2 space-y-1">
                <label htmlFor="home-search-suburb" className="text-[11px] font-semibold uppercase text-slate-500">Location / Suburb</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="home-search-suburb"
                    type="text"
                    placeholder="Search Parramatta, Bondi Beach, Manly..."
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-lg text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="home-search-type" className="text-[11px] font-semibold uppercase text-slate-500">Property Type</label>
                <select id="home-search-type" className="w-full py-2.5 px-3 bg-slate-50 rounded-lg text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0a192f]">
                  <option value="">All Types</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>

              <div className="space-y-1 flex items-end pt-1 md:pt-0">
                <Link href="/buy" className="w-full">
                  <Button variant="gold" size="lg" className="w-full gap-2 text-xs sm:text-sm">
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#b38b38]">Handpicked Portfolio</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#0a192f] mt-1">
              Featured Australian Listings
            </h2>
          </div>
          <Link href="/buy" className="text-xs sm:text-sm font-semibold text-[#0a192f] hover:text-[#c5a059] flex items-center gap-1">
            <span>View All Listings</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProperties.map((item) => (
            <Link key={item.externalId} href={`/property/${item.externalId}`} className="block group">
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

                  {/* Specs */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4 text-slate-400" />
                      <span>{item.bedrooms} Beds</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4 text-slate-400" />
                      <span>{item.bathrooms} Baths</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Car className="h-4 w-4 text-slate-400" />
                      <span>{item.carSpaces} Cars</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Request Appraisal CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl navy-gradient p-6 sm:p-12 lg:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Selling or Renting?</span>
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Request a Complementary Property Appraisal
              </h2>
              <p className="text-slate-300 text-xs sm:text-base font-light max-w-lg leading-relaxed">
                Gain accurate market valuation data powered by live sales metrics across Sydney, Melbourne, and Brisbane.
              </p>
              <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#c5a059]" /> No Obligation</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#c5a059]" /> Certified Local Agents</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#c5a059]" /> MRI Data Backed</span>
              </div>
            </div>

            <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0a192f]">Get Your Free Property Estimate</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Property Address (e.g. 142 Church St, Parramatta)"
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-lg text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-lg text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-lg text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                  />
                </div>
                <Button variant="gold" size="lg" className="w-full text-xs sm:text-sm">
                  Submit Appraisal Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
