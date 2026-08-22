"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Trash2, Share2, MapPin, Bed, Bath, Car, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";

export default function CustomerFavouritesPage() {
  const [favourites, setFavourites] = useState(MOCK_AUSTRALIAN_PROPERTIES.slice(0, 3));

  const removeFavourite = (id: string) => {
    setFavourites(favourites.filter((item) => item.externalId !== id));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
          Saved Properties ({favourites.length})
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track property updates, price adjustments, and inspection sessions in real time.
        </p>
      </div>

      {favourites.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <Heart className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="font-serif font-bold text-xl text-[#0a192f]">No Saved Properties Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our Australian property portfolio and tap the heart icon on any listing to save it here.
          </p>
          <Link href="/buy">
            <Button variant="gold" size="md">
              Browse Properties for Sale
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favourites.map((item) => (
            <Card key={item.externalId} className="overflow-hidden hover:shadow-lg transition-all">
              <div className="relative aspect-16/9 bg-slate-100">
                <img src={item.photos[0]} alt={item.headline} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant={item.listingType === "RESIDENTIAL_SALE" ? "sale" : "rent"}>
                    {item.listingType === "RESIDENTIAL_SALE" ? "For Sale" : "For Rent"}
                  </Badge>
                </div>
                <button
                  onClick={() => removeFavourite(item.externalId)}
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 text-rose-600 flex items-center justify-center shadow-md hover:bg-rose-50 transition-colors"
                  title="Remove from Favourites"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <CardContent className="p-6 space-y-3">
                <p className="font-serif text-2xl font-bold text-[#0a192f]">{item.priceDisplay}</p>
                <h3 className="font-serif font-bold text-base text-[#0a192f] line-clamp-1">{item.headline}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#c5a059]" />
                  <span>{item.streetNumber} {item.streetName}, {item.suburb} {item.state}</span>
                </p>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
                  <span>{item.bedrooms} Beds</span>
                  <span>{item.bathrooms} Baths</span>
                  <span>{item.carSpaces} Cars</span>
                  <span>{item.propertyType}</span>
                </div>

                <Link href={`/property/${item.externalId}`} className="block pt-2">
                  <Button variant="outline" className="w-full justify-between text-xs">
                    <span>View Full Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
