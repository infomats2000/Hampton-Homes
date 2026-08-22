import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_AGENTS } from "@/lib/properties/service";

export default function AgentsDirectoryPage() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="gold">Our Team</Badge>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0a192f]">
            Meet Our Real Estate Experts
          </h1>
          <p className="text-slate-600 text-base font-light">
            Dedicated sales executives, property managers, and luxury estate advisors representing Hampton Homes across Australia.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_AGENTS.map((agent) => (
            <Card key={agent.id} className="overflow-hidden group hover:shadow-xl transition-all">
              <div className="relative aspect-3/4 overflow-hidden bg-slate-900">
                <img
                  src={agent.photoUrl}
                  alt={agent.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071325] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <Badge variant="gold" className="text-[10px]">
                    {agent.officeName}
                  </Badge>
                  <h3 className="font-serif font-bold text-2xl text-white">{agent.name}</h3>
                  <p className="text-xs text-slate-300 font-medium">{agent.position}</p>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {agent.bio}
                </p>

                <div className="space-y-2 text-xs font-semibold text-slate-700 pt-2 border-t border-slate-100">
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-2 hover:text-[#c5a059]">
                    <Phone className="h-4 w-4 text-[#c5a059]" />
                    <span>{agent.phone}</span>
                  </a>
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-2 hover:text-[#c5a059]">
                    <Mail className="h-4 w-4 text-[#c5a059]" />
                    <span>{agent.email}</span>
                  </a>
                </div>

                <Link href={`/agents/${agent.slug}`} className="block pt-2">
                  <Button variant="outline" className="w-full justify-between text-xs">
                    <span>View Profile & Listings</span>
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
