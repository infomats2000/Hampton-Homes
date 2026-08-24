"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_OFFICES } from "@/lib/properties/service";
import { AGENCY_NAME } from "@/lib/agency-config";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="gold">Get in Touch</Badge>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0a192f]">
            Contact {AGENCY_NAME}
          </h1>
          <p className="text-slate-600 text-base font-light">
            Connect with our sales executives, property management directors, or local branch offices across Australia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Branch Offices List */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#0a192f]">Our Branch Offices</h3>
            {MOCK_OFFICES.map((office) => (
              <Card key={office.id} className="p-5 space-y-2 border-l-4 border-l-[#c5a059]">
                <h4 className="font-serif font-bold text-base text-[#0a192f]">{office.name}</h4>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#c5a059]" />
                  <span>{office.address}, {office.suburb}</span>
                </p>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#c5a059]" />
                  <span>{office.phone}</span>
                </p>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#c5a059]" />
                  <span>{office.email}</span>
                </p>
              </Card>
            ))}
          </div>

          {/* Contact Enquiry Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-8 space-y-6">
                <h3 className="font-serif font-bold text-2xl text-[#0a192f]">Send Us a Message</h3>

                {submitted ? (
                  <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold space-y-2">
                    <p className="flex items-center gap-1.5 font-bold text-sm text-emerald-700">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Thank You for Reaching Out!</span>
                    </p>
                    <p className="text-slate-600">Your message has been assigned to our customer team. We will respond within 1 business hour.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="contact-name" className="text-slate-700 font-bold">Your Name *</label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          placeholder="Full Name"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="contact-phone" className="text-slate-700 font-bold">Mobile Phone *</label>
                        <input
                          id="contact-phone"
                          type="tel"
                          required
                          placeholder="0400 000 000"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="contact-email" className="text-slate-700 font-bold">Email Address *</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="your.email@example.com.au"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="contact-category" className="text-slate-700 font-bold">Enquiry Category</label>
                      <select id="contact-category" className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800">
                        <option value="General">General Enquiry</option>
                        <option value="Buying">Buying a Property</option>
                        <option value="Selling">Selling / Appraisal Request</option>
                        <option value="Property Management">Landlord Property Management</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="contact-message" className="text-slate-700 font-bold">Message Details *</label>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        placeholder="How can our team help you?"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                      />
                    </div>

                    <Button type="submit" variant="gold" size="lg" className="w-full gap-2 text-sm font-bold">
                      <Send className="h-4 w-4" />
                      <span>Submit Contact Enquiry</span>
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
