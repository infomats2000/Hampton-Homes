"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Gavel, Calendar, Clock, MapPin, Bed, Bath, Car, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";

export default function AuctionsPage() {
  const auctionProperties = MOCK_AUSTRALIAN_PROPERTIES.filter(
    (p) => p.status === "FOR_SALE" || p.status === "UNDER_OFFER"
  );

  const [registeredAuctionId, setRegisteredAuctionId] = useState<string | null>(null);

  const handleRegisterBidder = (id: string) => {
    setRegisteredAuctionId(id);
    setTimeout(() => setRegisteredAuctionId(null), 4000);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="gold" className="gap-1">
            <Gavel className="h-3.5 w-3.5" />
            <span>Auction Calendar</span>
          </Badge>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0a192f]">
            Upcoming Property Auctions
          </h1>
          <p className="text-slate-600 text-base font-light">
            Browse upcoming weekend property auctions across Sydney, Melbourne, and Brisbane. Register to bid on-site or online.
          </p>
        </div>

        {registeredAuctionId && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 max-w-2xl mx-auto">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>Bidder Registration Request Received! Our sales team will verify your ID and issue a bidder number.</span>
          </div>
        )}

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {auctionProperties.map((item, idx) => (
            <Card key={item.externalId} className="overflow-hidden hover:shadow-xl transition-all border-l-4 border-l-purple-600">
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-48 sm:w-56 shrink-0 bg-slate-100">
                  <img src={item.photos[0]} alt={item.headline} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="auction">AUCTION</Badge>
                  </div>
                </div>

                <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <p className="font-serif text-xl font-bold text-[#0a192f]">{item.priceDisplay}</p>
                    <h3 className="font-serif font-bold text-base text-[#0a192f] line-clamp-1">{item.headline}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#c5a059]" />
                      <span>{item.streetNumber} {item.streetName}, {item.suburb} {item.state}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-xs space-y-1 text-purple-950 font-semibold">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-purple-700" />
                      <span>Auction Date: Saturday, 05 September 2026 at {11 + idx}:00 AM</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-purple-800">
                      <MapPin className="h-4 w-4 text-purple-700" />
                      <span>Method: On-Site at Property ({item.streetNumber} {item.streetName})</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <Link href={`/property/${item.externalId}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        View Property
                      </Button>
                    </Link>

                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => handleRegisterBidder(item.externalId)}
                      className="text-xs gap-1.5"
                    >
                      <Gavel className="h-3.5 w-3.5" />
                      <span>Register to Bid</span>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
