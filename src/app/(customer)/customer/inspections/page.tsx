"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Phone, User, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";

export default function CustomerInspectionsPage() {
  const [registrations, setRegistrations] = useState([
    {
      id: "reg-01",
      property: MOCK_AUSTRALIAN_PROPERTIES[0],
      sessionDate: "Saturday, 29 August 2026",
      sessionTime: "10:00 AM - 10:30 AM AEST",
      attendingCount: 2,
      agentName: "Marcus Vance",
      agentPhone: "(02) 9891 1234",
    },
  ]);

  const cancelRegistration = (id: string) => {
    setRegistrations(registrations.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
          Inspection Session Registrations
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Your registered open home inspection sessions and SMS/email reminder schedules.
        </p>
      </div>

      {registrations.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <Calendar className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="font-serif font-bold text-xl text-[#0a192f]">No Inspection Registrations</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse properties for sale or rent and register for upcoming weekend inspection sessions.
          </p>
          <Link href="/buy">
            <Button variant="gold" size="md">
              View Upcoming Open Homes
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <Card key={reg.id} className="overflow-hidden hover:shadow-md transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={reg.property.photos[0]}
                      alt=""
                      className="h-16 w-24 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <Badge variant="sale" className="mb-1">CONFIRMED ATTENDANCE</Badge>
                      <h3 className="font-serif font-bold text-lg text-[#0a192f]">
                        {reg.property.streetNumber} {reg.property.streetName}, {reg.property.suburb}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold">{reg.property.priceDisplay}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cancelRegistration(reg.id)}
                      className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                    >
                      Cancel Registration
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-xs font-semibold text-slate-700 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#c5a059]" />
                    <span>{reg.sessionDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#c5a059]" />
                    <span>{reg.sessionTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#c5a059]" />
                    <span>Agent: {reg.agentName} ({reg.agentPhone})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
