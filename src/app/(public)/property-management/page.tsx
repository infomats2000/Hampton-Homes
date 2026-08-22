import React from "react";
import Link from "next/link";
import { Building2, ShieldCheck, CheckCircle2, PhoneCall, ArrowRight, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function PropertyManagementPage() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Hero */}
        <div className="bg-[#071325] text-white rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl text-center max-w-4xl mx-auto">
          <Badge variant="gold">Landlord & Asset Services</Badge>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold leading-tight">
            Prestige Property Management
          </h1>
          <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            Maximize your rental yield and protect your investment asset with MRI Property Tree integrated management services across Sydney and Australia.
          </p>
          <div className="pt-4 flex justify-center">
            <Link href="/sell">
              <Button variant="gold" size="lg" className="gap-2 font-bold text-sm">
                <span>Request Rental Valuation</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 space-y-3">
            <ShieldCheck className="h-10 w-10 text-[#c5a059]" />
            <h3 className="font-serif font-bold text-xl text-[#0a192f]">Zero Arrears Guarantee</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated tenant screening and direct debit payment workflows powered by Property Tree technology.
            </p>
          </Card>

          <Card className="p-8 space-y-3">
            <Building2 className="h-10 w-10 text-[#c5a059]" />
            <h3 className="font-serif font-bold text-xl text-[#0a192f]">Regular Routine Inspections</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Detailed condition reports with high-resolution photographic audit records sent directly to landlords.
            </p>
          </Card>

          <Card className="p-8 space-y-3">
            <UserCheck className="h-10 w-10 text-[#c5a059]" />
            <h3 className="font-serif font-bold text-xl text-[#0a192f]">Dedicated Property Manager</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Single point of contact for routine maintenance, lease renewals, and tenant communication.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
