import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Building2, Users, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_OFFICES } from "@/lib/properties/service";

export default function OfficesPage() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="gold">Branch Network</Badge>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0a192f]">
            Our Australian Offices
          </h1>
          <p className="text-slate-600 text-base font-light">
            Strategically located real estate offices servicing Sydney CBD, Parramatta, Eastern Suburbs, and the Northern Beaches.
          </p>
        </div>

        {/* Office Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_OFFICES.map((office) => (
            <Card key={office.id} className="overflow-hidden hover:shadow-xl transition-all">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-xl bg-[#0a192f] text-white flex items-center justify-center font-serif text-2xl font-bold gold-gradient">
                    H
                  </div>
                  {office.isHeadOffice && <Badge variant="gold">Head Office</Badge>}
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-xl text-[#0a192f]">{office.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{office.description}</p>
                </div>

                <div className="space-y-2 text-xs font-semibold text-slate-700 pt-2 border-t border-slate-100">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#c5a059]" />
                    <span>{office.address}, {office.suburb} {office.state} {office.postcode}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#c5a059]" />
                    <span>{office.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#c5a059]" />
                    <span>{office.email}</span>
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span>{office.agentCount} Licensed Agents</span>
                  <span>{office.listingCount} Active Properties</span>
                </div>

                <Link href={`/buy?suburb=${office.suburb}`} className="block">
                  <Button variant="outline" className="w-full justify-between text-xs">
                    <span>View Office Listings</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
