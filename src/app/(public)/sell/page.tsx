"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, PhoneCall, Building2, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AGENCY_NAME } from "@/lib/agency-config";

export default function SellPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge variant="gold">Property Valuation & Sales</Badge>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0a192f]">
            Request a Free Property Appraisal
          </h1>
          <p className="text-slate-600 text-base font-light max-w-xl mx-auto">
            Get an authoritative property estimate backed by real-time MRI sales data across Sydney, Melbourne, and Brisbane.
          </p>
        </div>

        {submitted ? (
          <Card className="p-12 text-center space-y-4 border-2 border-emerald-300 bg-emerald-50/50">
            <CheckCircle2 className="h-16 w-16 text-emerald-600 mx-auto" />
            <h2 className="font-serif text-3xl font-bold text-slate-900">Appraisal Request Submitted!</h2>
            <p className="text-slate-700 text-sm max-w-md mx-auto">
              Thank you for contacting {AGENCY_NAME}. A licensed sales executive from your local branch will review your property data and reach out within 2 hours.
            </p>
          </Card>
        ) : (
          <Card className="shadow-lg border border-slate-200">
            <CardContent className="p-8 sm:p-12 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Property Info */}
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-lg text-[#0a192f] border-b border-slate-100 pb-2">
                    1. Property Information
                  </h3>

                  <div className="space-y-1">
                    <label htmlFor="sell-address" className="text-xs font-semibold uppercase text-slate-500">Property Address *</label>
                    <input
                      id="sell-address"
                      type="text"
                      required
                      placeholder="e.g. 142 Church Street, Parramatta NSW 2150"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="sell-type" className="text-xs font-semibold uppercase text-slate-500">Property Type</label>
                      <select id="sell-type" className="w-full py-3 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none">
                        <option value="House">House</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Villa">Villa</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="sell-beds" className="text-xs font-semibold uppercase text-slate-500">Bedrooms</label>
                      <select id="sell-beds" className="w-full py-3 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none">
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        <option value="3">3 Bedrooms</option>
                        <option value="4">4 Bedrooms</option>
                        <option value="5">5+ Bedrooms</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="sell-baths" className="text-xs font-semibold uppercase text-slate-500">Bathrooms</label>
                      <select id="sell-baths" className="w-full py-3 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none">
                        <option value="1">1 Bathroom</option>
                        <option value="2">2 Bathrooms</option>
                        <option value="3">3+ Bathrooms</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Contact Details & Intent */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="font-serif font-bold text-lg text-[#0a192f] border-b border-slate-100 pb-2">
                    2. Owner Contact &amp; Timeframe
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="sell-name" className="text-xs font-semibold uppercase text-slate-500">Full Name *</label>
                      <input
                        id="sell-name"
                        type="text"
                        required
                        placeholder="Your Full Name"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="sell-phone" className="text-xs font-semibold uppercase text-slate-500">Mobile Phone *</label>
                      <input
                        id="sell-phone"
                        type="tel"
                        required
                        placeholder="0400 000 000"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="sell-email" className="text-xs font-semibold uppercase text-slate-500">Email Address *</label>
                    <input
                      id="sell-email"
                      type="email"
                      required
                      placeholder="your.email@example.com.au"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-slate-500">Selling Timeframe</label>
                    <select className="w-full py-3 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none">
                      <option value="IMMEDIATELY">Immediately (Next 30 Days)</option>
                      <option value="1_3_MONTHS">1 to 3 Months</option>
                      <option value="3_6_MONTHS">3 to 6 Months</option>
                      <option value="CURIOUS">Just Curious about Market Value</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" variant="gold" size="lg" className="w-full gap-2 font-bold text-base">
                  <Send className="h-4 w-4" />
                  <span>Submit Free Appraisal Request</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
