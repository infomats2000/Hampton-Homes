"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Phone, Mail, MapPin, Building2, Globe, Bed, Bath, Car, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAgentBySlug, MOCK_AGENTS } from "@/lib/properties/service";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";

export default function AgentProfilePage() {
  const params = useParams();
  const slug = (params.slug as string) || "";
  const agent = getAgentBySlug(slug) || MOCK_AGENTS[0];

  const agentListings = MOCK_AUSTRALIAN_PROPERTIES.filter(
    (p) => p.primaryAgentName === agent.name
  );

  return (
    <div className="py-12 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Agent Profile Header Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
          <img
            src={agent.photoUrl}
            alt={agent.name}
            className="h-40 w-40 sm:h-48 sm:w-48 rounded-2xl object-cover border-4 border-[#c5a059] shadow-lg shrink-0"
          />

          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge variant="gold">{agent.officeName}</Badge>
              <Badge variant="outline">Languages: {agent.languages.join(", ")}</Badge>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0a192f]">
              {agent.name}
            </h1>
            <p className="text-base text-slate-500 font-semibold">{agent.position}</p>

            <p className="text-slate-700 leading-relaxed text-sm max-w-3xl">
              {agent.bio}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <a href={`tel:${agent.phone}`}>
                <Button variant="default" size="md" className="gap-2 text-xs">
                  <Phone className="h-4 w-4 text-[#c5a059]" />
                  <span>{agent.phone}</span>
                </Button>
              </a>
              <a href={`mailto:${agent.email}`}>
                <Button variant="outline" size="md" className="gap-2 text-xs">
                  <Mail className="h-4 w-4" />
                  <span>Email {agent.name.split(" ")[0]}</span>
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Current Active Listings */}
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#0a192f]">
              Current Listings by {agent.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">MRI Synchronized active sales and rentals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {agentListings.map((item) => (
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
      </div>
    </div>
  );
}
