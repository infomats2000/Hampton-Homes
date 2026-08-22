"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, MapPin, User, Phone, Mail, Clock, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface AppraisalItem {
  id: string;
  address: string;
  suburb: string;
  state: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  sellingTimeframe: string;
  status: "NEW" | "AGENT_ASSIGNED" | "APPRAISAL_SCHEDULED" | "COMPLETED";
  assignedAgentName: string;
  createdAt: string;
}

export default function AdminAppraisalsPage() {
  const [appraisals, setAppraisals] = useState<AppraisalItem[]>([
    {
      id: "appr-101",
      address: "142 Church Street",
      suburb: "Parramatta",
      state: "NSW",
      propertyType: "House",
      bedrooms: 3,
      bathrooms: 2,
      ownerName: "Sophie Zhang",
      ownerEmail: "sophie.zhang@example.com.au",
      ownerPhone: "0422 333 444",
      sellingTimeframe: "Within 1 - 3 Months",
      status: "NEW",
      assignedAgentName: "Marcus Vance",
      createdAt: "2026-08-22 16:15",
    },
    {
      id: "appr-102",
      address: "88 Ocean Drive",
      suburb: "Bondi Beach",
      state: "NSW",
      propertyType: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      ownerName: "Alexander Vance",
      ownerEmail: "alexander.v@example.com.au",
      ownerPhone: "0455 666 777",
      sellingTimeframe: "Immediately",
      status: "AGENT_ASSIGNED",
      assignedAgentName: "Elena Rostova",
      createdAt: "2026-08-21 11:30",
    },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
              Property Appraisal Requests
            </h1>
            <Badge variant="gold">Section 36 Compliant</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Incoming seller and landlord market valuation requests submitted via the public website.
          </p>
        </div>

        <Link href="/sell" target="_blank">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <span>Preview Public Request Form</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {appraisals.map((appr) => (
          <Card key={appr.id} className="hover:shadow-md transition-all border-l-4 border-l-[#c5a059]">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={appr.status === "NEW" ? "warning" : "success"}>{appr.status}</Badge>
                    <span className="font-mono text-xs text-slate-400">Ref: {appr.id}</span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#0a192f] mt-1">
                    {appr.address}, {appr.suburb} {appr.state}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {appr.propertyType} | {appr.bedrooms} Beds | {appr.bathrooms} Baths | Timeframe: {appr.sellingTimeframe}
                  </p>
                </div>

                <div className="space-y-1 text-right">
                  <p className="text-xs font-bold text-slate-900">Owner: {appr.ownerName}</p>
                  <p className="text-xs text-slate-600">{appr.ownerPhone} | {appr.ownerEmail}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-600 font-semibold">
                  Assigned Agent: <span className="text-[#0a192f] font-bold">{appr.assignedAgentName}</span>
                </span>

                <div className="flex items-center gap-2">
                  <Button variant="gold" size="sm" className="text-xs">
                    Push Lead to MRI Vault
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
