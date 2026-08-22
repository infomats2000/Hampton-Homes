"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, Users, Download, Plus, Bell, CheckCircle2, UserCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";

interface InspectionSession {
  id: string;
  property: typeof MOCK_AUSTRALIAN_PROPERTIES[0];
  date: string;
  startTime: string;
  endTime: string;
  agentName: string;
  registeredAttendees: Array<{ name: string; phone: string; email: string; headcount: number }>;
}

export default function AdminInspectionsPage() {
  const [sessions, setSessions] = useState<InspectionSession[]>([
    {
      id: "session-101",
      property: MOCK_AUSTRALIAN_PROPERTIES[0], // Parramatta House
      date: "Saturday, 29 August 2026",
      startTime: "10:00 AM",
      endTime: "10:30 AM",
      agentName: "Marcus Vance",
      registeredAttendees: [
        { name: "James Harrison", phone: "0412 345 678", email: "james.harrison@example.com.au", headcount: 2 },
        { name: "David Miller", phone: "0411 222 333", email: "david.miller@example.com.au", headcount: 1 },
      ],
    },
    {
      id: "session-102",
      property: MOCK_AUSTRALIAN_PROPERTIES[1], // Bondi Beach Apartment
      date: "Saturday, 29 August 2026",
      startTime: "11:15 AM",
      endTime: "11:45 AM",
      agentName: "Elena Rostova",
      registeredAttendees: [
        { name: "Sophie Zhang", phone: "0422 333 444", email: "sophie.zhang@example.com.au", headcount: 2 },
      ],
    },
  ]);

  const [reminderSent, setReminderSent] = useState<string | null>(null);

  const handleSendReminder = (sessionId: string) => {
    setReminderSent(sessionId);
    setTimeout(() => setReminderSent(null), 3000);
  };

  const handleExportCSV = (session: InspectionSession) => {
    const csvContent =
      "Name,Phone,Email,Headcount\n" +
      session.registeredAttendees.map((a) => `"${a.name}","${a.phone}","${a.email}",${a.headcount}`).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inspections-${session.property.suburb}-${session.date.replace(/[^a-z0-9]/gi, "_")}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
              Inspection Sessions & Attendee Management
            </h1>
            <Badge variant="gold">Section 40 Compliant</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Schedule open home sessions, manage registered buyers, send automated SMS reminders, and export sign-in sheets.
          </p>
        </div>

        <Button variant="gold" size="sm" className="gap-2 text-xs">
          <Plus className="h-4 w-4" />
          <span>Schedule New Inspection Session</span>
        </Button>
      </div>

      {reminderSent && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Automated SMS & Email Reminders Dispatched to Registered Attendees!</span>
        </div>
      )}

      {/* Inspection Sessions List */}
      <div className="space-y-6">
        {sessions.map((sess) => (
          <Card key={sess.id} className="overflow-hidden hover:shadow-md transition-all">
            <CardHeader className="bg-slate-50 border-b border-slate-200 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={sess.property.photos[0]}
                    alt=""
                    className="h-14 w-20 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#b38b38] uppercase tracking-wider">{sess.property.suburb}</span>
                    <h3 className="font-serif font-bold text-lg text-[#0a192f]">
                      {sess.property.streetNumber} {sess.property.streetName}, {sess.property.suburb}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">{sess.property.priceDisplay}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendReminder(sess.id)}
                    className="gap-1.5 text-xs"
                  >
                    <Bell className="h-3.5 w-3.5 text-amber-500" />
                    <span>Send Reminders</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportCSV(sess)}
                    className="gap-1.5 text-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export Attendee Sheet (CSV)</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700 bg-slate-100/70 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#c5a059]" />
                  <span>Session Date: {sess.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#c5a059]" />
                  <span>Time: {sess.startTime} - {sess.endTime} AEST</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-[#c5a059]" />
                  <span>Host Agent: {sess.agentName}</span>
                </div>
              </div>

              {/* Registered Attendees Sub-Table */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#0a192f] flex items-center justify-between">
                  <span>Registered Attendees ({sess.registeredAttendees.length})</span>
                  <span className="text-xs text-slate-500 font-normal">Total Headcount: {sess.registeredAttendees.reduce((acc, a) => acc + a.headcount, 0)} Persons</span>
                </h4>

                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-4">Attendee Name</th>
                        <th className="py-2.5 px-4">Phone Number</th>
                        <th className="py-2.5 px-4">Email</th>
                        <th className="py-2.5 px-4 text-center">Party Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {sess.registeredAttendees.map((att, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">{att.name}</td>
                          <td className="py-2.5 px-4 text-slate-700">{att.phone}</td>
                          <td className="py-2.5 px-4 text-slate-700">{att.email}</td>
                          <td className="py-2.5 px-4 text-center font-bold text-slate-900">{att.headcount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
