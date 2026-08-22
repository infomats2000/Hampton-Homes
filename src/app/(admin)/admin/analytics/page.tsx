"use client";

import React, { useState } from "react";
import { BarChart3, TrendingUp, Eye, Users, FileText, ArrowUpRight, ShieldCheck, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/ui/stats-card";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";

export default function AdminAnalyticsPage() {
  const [timeframe, setTimeframe] = useState("30_DAYS");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
              Executive Analytics & Property Insights
            </h1>
            <Badge variant="gold">Section 53 Compliant</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time tracking of portal impressions, lead conversion rates, top performing suburbs, and agent metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="7_DAYS">Last 7 Days</option>
            <option value="30_DAYS">Last 30 Days</option>
            <option value="90_DAYS">Last 90 Days</option>
            <option value="YEAR_TO_DATE">Year to Date 2026</option>
          </select>

          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            <span>Export Report (PDF)</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Portal Impressions" value="142,850" trend="+18.4% vs last period" icon={Eye} subtitle="Unique pageviews" />
        <StatsCard title="Total Enquiries Generated" value="482" trend="+12.1% vs last period" icon={Users} subtitle="Leads routed to agents" />
        <StatsCard title="Appraisal Requests" value="38" trend="+24.0% vs last period" icon={TrendingUp} subtitle="High-value seller leads" />
        <StatsCard title="Avg Lead Response Time" value="18 Mins" trend="-4.2 mins faster" icon={BarChart3} subtitle="Agency SLA benchmark" />
      </div>

      {/* Top Performing Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Viewed Properties</CardTitle>
            <CardDescription>Most engaged listings across Sydney, Melbourne, and Brisbane.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Suburb</th>
                  <th className="py-3 px-4">Detail Views</th>
                  <th className="py-3 px-4">Saved Favourites</th>
                  <th className="py-3 px-4 text-right">Enquiries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {MOCK_AUSTRALIAN_PROPERTIES.map((p, idx) => (
                  <tr key={p.externalId} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {p.streetNumber} {p.streetName}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{p.suburb}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{(4200 - idx * 850).toLocaleString()}</td>
                    <td className="py-3 px-4 text-rose-600 font-bold">{184 - idx * 35}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">{28 - idx * 5}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Lead Sources Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Acquisition Channels</CardTitle>
            <CardDescription>Where customer enquiries originate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-semibold">
            {[
              { channel: "Property Search Portal (/buy, /rent)", percentage: "48%", count: "231 Leads" },
              { channel: "Appraisal Request Form (/sell)", percentage: "26%", count: "125 Leads" },
              { channel: "Agent Profiles & Contact", percentage: "15%", count: "72 Leads" },
              { channel: "Organic Suburb Guides", percentage: "11%", count: "54 Leads" },
            ].map((c, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between text-slate-900">
                  <span>{c.channel}</span>
                  <span className="font-bold text-[#c5a059]">{c.percentage}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0a192f] h-full" style={{ width: c.percentage }} />
                </div>
                <p className="text-[11px] text-slate-500 text-right">{c.count}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
