"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Bed,
  Bath,
  Car,
  Maximize2,
  Calendar,
  Phone,
  Mail,
  Heart,
  Share2,
  Printer,
  CheckCircle2,
  Building2,
  User,
  Send,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_AGENTS } from "@/lib/properties/service";
import type { MRIRawProperty } from "@/lib/mri/provider.interface";

export function PropertyDetailClient({ property }: { property: MRIRawProperty }) {
  const [selectedPhoto, setSelectedPhoto] = useState(property.photos[0] || "");
  const [isSaved, setIsSaved] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);
  const [enquirySending, setEnquirySending] = useState(false);
  const [enquiryError, setEnquiryError] = useState("");

  const agent = MOCK_AGENTS.find((a) => a.name === property.primaryAgentName) || {
    ...MOCK_AGENTS[0], name: property.primaryAgentName, email: property.primaryAgentEmail, officeName: property.officeName,
  };

  const handleEnquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnquirySending(true); setEnquiryError("");
    const form = new FormData(e.currentTarget);
    const response = await fetch("/api/enquiries", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: property.externalId, name: form.get("name"), email: form.get("email"), phone: form.get("phone"), message: form.get("message"), website: form.get("website") }),
    });
    const result = await response.json().catch(() => ({}));
    setEnquirySending(false);
    if (!response.ok) { setEnquiryError(result.error ?? "We could not send your enquiry. Please call the agent directly."); return; }
    setEnquirySent(true);
  };

  return (
    <div className="bg-slate-50 py-6 sm:py-8 space-y-8 sm:space-y-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-[#0a192f]">Home</Link>
            <span>/</span>
            <Link href="/buy" className="hover:text-[#0a192f]">Properties</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{property.suburb}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSaved(!isSaved)}
              className={`gap-1.5 text-xs ${isSaved ? "text-rose-600 border-rose-300 bg-rose-50" : ""}`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-600" : ""}`} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Property link copied to clipboard!");
                }
              }}
              className="gap-1.5 text-xs"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5 text-xs hidden sm:flex"
            >
              <Printer className="h-4 w-4" />
              <span>Print Brochure</span>
            </Button>
          </div>
        </div>

        {/* Title Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge variant={property.listingType === "RESIDENTIAL_SALE" ? "sale" : "rent"}>
              {property.listingType === "RESIDENTIAL_SALE" ? "For Sale" : "For Rent"}
            </Badge>
            <Badge variant="gold" className="gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>MRI Vault Authoritative</span>
            </Badge>
            <span className="text-xs font-mono text-slate-400">MRI ID: {property.externalId}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#0a192f] leading-tight">
            {property.headline}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
            <MapPin className="h-4 w-4 text-[#c5a059] shrink-0" />
            <span>
              {property.streetNumber} {property.streetName}, {property.suburb} {property.state} {property.postcode}
            </span>
          </div>
        </div>

        {/* Media Gallery Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="relative aspect-16/10 sm:aspect-16/9 md:aspect-21/9 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 shadow-xl">
            <img
              src={selectedPhoto}
              alt={property.headline}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5">
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Photos ({property.photos.length})</span>
            </div>
          </div>

          {/* Thumbnail Selector */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
            {property.photos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhoto(photo)}
                className={`relative h-16 w-24 sm:h-20 sm:w-28 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  selectedPhoto === photo ? "border-[#c5a059] ring-2 ring-[#c5a059]/40" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Specs Ribbon & Price Display */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Price Guide</span>
            <p className="font-serif text-2xl sm:text-4xl font-bold text-[#0a192f] mt-0.5">
              {property.priceDisplay}
            </p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 text-slate-700">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Bedrooms</span>
              <div className="flex items-center gap-1.5 font-bold text-base sm:text-lg text-[#0a192f] mt-0.5">
                <Bed className="h-4 w-4 sm:h-5 sm:w-5 text-[#c5a059]" />
                <span>{property.bedrooms}</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Bathrooms</span>
              <div className="flex items-center gap-1.5 font-bold text-base sm:text-lg text-[#0a192f] mt-0.5">
                <Bath className="h-4 w-4 sm:h-5 sm:w-5 text-[#c5a059]" />
                <span>{property.bathrooms}</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Car Spaces</span>
              <div className="flex items-center gap-1.5 font-bold text-base sm:text-lg text-[#0a192f] mt-0.5">
                <Car className="h-4 w-4 sm:h-5 sm:w-5 text-[#c5a059]" />
                <span>{property.carSpaces}</span>
              </div>
            </div>
            {property.landAreaSqm && (
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Land Size</span>
                <p className="font-bold text-base sm:text-lg text-[#0a192f] mt-0.5">{property.landAreaSqm} m²</p>
              </div>
            )}
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Type</span>
              <p className="font-bold text-base sm:text-lg text-[#0a192f] mt-0.5">{property.propertyType}</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Description & Features vs Agent Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Description Card */}
            <Card>
              <CardContent className="p-5 sm:p-8 space-y-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0a192f]">About This Property</h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base font-normal">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Key Features & Amenities */}
            <Card>
              <CardContent className="p-5 sm:p-8 space-y-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0a192f]">Property Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 pt-2">
                  {[
                    "Gourmet Marble Kitchen",
                    "Miele Built-in Appliances",
                    "Ducted Air Conditioning",
                    "Entertainer's Terrace",
                    "Custom Built-in Robes",
                    "Security Intercom System",
                    "Subtropical Landscaped Gardens",
                    "Double Lock-Up Garage",
                    "Near Prestige Schools & Transport",
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <CheckCircle2 className="h-4 w-4 text-[#c5a059] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Inspection Times */}
            {property.inspections && property.inspections.length > 0 && (
              <Card>
                <CardContent className="p-5 sm:p-8 space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#c5a059]" />
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0a192f]">Upcoming Inspection Sessions</h2>
                  </div>
                  <div className="space-y-3 pt-2">
                    {property.inspections.map((insp, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 gap-3">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            Saturday, 29 August 2026
                          </p>
                          <p className="text-xs text-slate-600">10:00 AM - 10:30 AM AEST</p>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs">
                          Register Attendance
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sticky Agent Sidebar */}
          <div className="space-y-6">
            {/* Agent Profile & Direct Enquiry Form */}
            <Card className="lg:sticky lg:top-24 shadow-md">
              <CardContent className="p-5 sm:p-6 space-y-6">
                {/* Agent Card */}
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                  <img
                    src={agent.photoUrl}
                    alt={agent.name}
                    className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-[#c5a059] shrink-0"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#0a192f]">{agent.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{agent.position}</p>
                    <p className="text-[11px] text-[#b38b38] font-semibold mt-0.5">{agent.officeName}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-semibold text-slate-700">
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <Phone className="h-4 w-4 text-[#c5a059]" />
                    <span>Call {agent.phone}</span>
                  </a>
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <Mail className="h-4 w-4 text-[#c5a059]" />
                    <span>Email Listing Agent</span>
                  </a>
                </div>

                {/* Direct Property Enquiry Form */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-serif font-bold text-sm text-[#0a192f]">Enquire About This Property</h4>

                  {enquirySent ? (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold space-y-1">
                      <p className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Enquiry Sent Successfully!</span>
                      </p>
                      <p className="text-emerald-700 font-normal">
                        {agent.name} will contact you shortly regarding {property.streetNumber} {property.streetName}.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleEnquiry} className="space-y-3">
                      <input name="website" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                      <input
                        name="name"
                        type="text"
                        required
                        placeholder="Your Full Name *"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                      />
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="Your Email Address *"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                      />
                      <input
                        name="phone"
                        type="tel"
                        required
                        placeholder="Phone Number *"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                      />
                      <textarea
                        name="message"
                        required
                        rows={3}
                        defaultValue={`Hi ${agent.name}, I'm interested in viewing ${property.streetNumber} ${property.streetName}, ${property.suburb}. Please send me further inspection details.`}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                      />
                      {enquiryError && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{enquiryError}</p>}
                      <Button type="submit" variant="gold" size="md" disabled={enquirySending} className="w-full gap-2 text-xs">
                        <Send className="h-3.5 w-3.5" />
                        <span>{enquirySending ? "Sending…" : "Send Enquiry to Agent"}</span>
                      </Button>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
