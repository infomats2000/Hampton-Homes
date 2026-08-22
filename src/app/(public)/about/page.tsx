import React from "react";
import Link from "next/link";
import { Building2, ShieldCheck, Award, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="gold">Our Legacy</Badge>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0a192f] leading-tight">
            Australia&apos;s Premier Real Estate Agency
          </h1>
          <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed">
            Hampton Homes represents precision real estate sales, luxury property management, and direct MRI Vault synchronization across Sydney, Melbourne, and Brisbane.
          </p>
        </div>

        {/* Brand Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-xl gold-gradient text-slate-900 mx-auto flex items-center justify-center font-bold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#0a192f]">100% Authoritative Data</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every price guide, inspection session, and property status is verified directly via real-time MRI integration.
            </p>
          </Card>

          <Card className="p-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-xl gold-gradient text-slate-900 mx-auto flex items-center justify-center font-bold">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#0a192f]">Prestige Record Sales</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our licensed sales directors have achieved record suburb results across Sydney Eastern Suburbs, Parramatta CBD, and Northern Beaches.
            </p>
          </Card>

          <Card className="p-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-xl gold-gradient text-slate-900 mx-auto flex items-center justify-center font-bold">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#0a192f]">Client First Philosophy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Whether selling a waterfront estate or managing a commercial portfolio, our client relationships are built on trust and transparency.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
