"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  FileText,
  ArrowUpRight,
  ShieldCheck,
  Download,
  Calendar,
  PieChart as PieIcon,
  Activity,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/ui/stats-card";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";

export default function AdminAnalyticsPage() {
  const [timeframe, setTimeframe] = useState("30_DAYS");
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Monthly Traffic Data Points (Jan - Aug 2026)
  const monthlyData = [
    { month: "Jan", views: 12400, leads: 180 },
    { month: "Feb", views: 15800, leads: 220 },
    { month: "Mar", views: 18200, leads: 270 },
    { month: "Apr", views: 16900, leads: 240 },
    { month: "May", views: 21500, leads: 310 },
    { month: "Jun", views: 24800, leads: 380 },
    { month: "Jul", views: 28900, leads: 430 },
    { month: "Aug", views: 34200, leads: 482 },
  ];

  // Max values for SVG scaling
  const maxViews = 40000;

  // Generate SVG Path coordinates for Area Line Chart
  const points = monthlyData.map((d, i) => {
    const x = (i / (monthlyData.length - 1)) * 500 + 40;
    const y = 200 - (d.views / maxViews) * 160;
    return { x, y, data: d };
  });

  const pathD = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  const areaD = `${pathD} L ${points[points.length - 1].x} 220 L ${points[0].x} 220 Z`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
              Executive Analytics & Visual Graph Center
            </h1>
            <Badge variant="gold">Real-time Graphs Enabled</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Visual tracking of monthly traffic growth, property view trends, lead conversion channels, and portfolio distribution.
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
            <span>Export Analytics Report</span>
          </Button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Portal Impressions" value="142,850" trend="+18.4% vs last period" icon={Eye} subtitle="Unique pageviews" />
        <StatsCard title="Total Enquiries Generated" value="482" trend="+12.1% vs last period" icon={Users} subtitle="Leads routed to agents" />
        <StatsCard title="Appraisal Requests" value="38" trend="+24.0% vs last period" icon={TrendingUp} subtitle="High-value seller leads" />
        <StatsCard title="Avg Lead Response Time" value="18 Mins" trend="-4.2 mins faster" icon={BarChart3} subtitle="Agency SLA benchmark" />
      </div>

      {/* GRAPH 1: Monthly Traffic & Lead Growth Area Chart */}
      <Card className="border-l-4 border-l-[#0a192f]">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#c5a059]" />
              <span>Monthly Portal Traffic & Lead Growth (2026)</span>
            </CardTitle>
            <CardDescription>
              Interactive area graph showing monthly property detail views vs enquiry submissions.
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#0a192f]" /> Property Views
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#c5a059]" /> Leads Generated
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 580 250" className="w-full h-64 overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0a192f" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0a192f" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Y Axis Grid Lines */}
              {[40, 80, 120, 160, 200, 220].map((yVal, idx) => (
                <line
                  key={idx}
                  x1="40"
                  y1={yVal}
                  x2="540"
                  y2={yVal}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Area Fill */}
              <path d={areaD} fill="url(#areaGradient)" />

              {/* Line Curve */}
              <path d={pathD} fill="none" stroke="#0a192f" strokeWidth="3.5" strokeLinecap="round" />

              {/* Data Points */}
              {points.map((p, i) => (
                <g key={i} className="cursor-pointer">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint === i ? 7 : 5}
                    fill={hoveredPoint === i ? "#c5a059" : "#0a192f"}
                    stroke="#ffffff"
                    strokeWidth="2"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Month Label */}
                  <text
                    x={p.x}
                    y="242"
                    textAnchor="middle"
                    className="text-[11px] fill-slate-500 font-semibold"
                  >
                    {p.data.month}
                  </text>
                </g>
              ))}

              {/* Tooltip on Hover */}
              {hoveredPoint !== null && (
                <g transform={`translate(${points[hoveredPoint].x - 45}, ${points[hoveredPoint].y - 45})`}>
                  <rect width="90" height="36" rx="6" fill="#071325" />
                  <text x="45" y="16" textAnchor="middle" fill="#c5a059" className="text-[10px] font-bold">
                    {monthlyData[hoveredPoint].views.toLocaleString()} Views
                  </text>
                  <text x="45" y="28" textAnchor="middle" fill="#ffffff" className="text-[9px] font-medium">
                    {monthlyData[hoveredPoint].leads} Leads Created
                  </text>
                </g>
              )}
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* GRAPH 2 & GRAPH 3: Bar Chart & Portfolio Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GRAPH 2: Lead Acquisition Channel Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#c5a059]" />
              <span>Lead Acquisition Channel Bar Chart</span>
            </CardTitle>
            <CardDescription>Comparative lead count by acquisition channel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            {[
              { label: "Search Portal (/buy, /rent)", count: 231, percentage: 85, color: "bg-[#0a192f]" },
              { label: "Appraisal Form (/sell)", count: 125, percentage: 55, color: "bg-[#c5a059]" },
              { label: "Agent Directory Profiles", count: 72, percentage: 35, color: "bg-sky-600" },
              { label: "Suburb Market Guides", count: 54, percentage: 25, color: "bg-emerald-600" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>{item.label}</span>
                  <span className="font-bold text-[#0a192f]">{item.count} Leads</span>
                </div>
                <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* GRAPH 3: Portfolio Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-[#c5a059]" />
              <span>Portfolio Property Type Distribution</span>
            </CardTitle>
            <CardDescription>Live active inventory breakdown across categories.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4">
            {/* Donut Chart SVG */}
            <div className="relative h-44 w-44 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Segment 1: Houses (45%) */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#0a192f"
                  strokeWidth="4.5"
                  strokeDasharray="45, 100"
                />
                {/* Segment 2: Apartments (30%) */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#c5a059"
                  strokeWidth="4.5"
                  strokeDasharray="30, 100"
                  strokeDashoffset="-45"
                />
                {/* Segment 3: Commercial & Projects (25%) */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="4.5"
                  strokeDasharray="25, 100"
                  strokeDashoffset="-75"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-serif font-bold text-xl text-[#0a192f]">100%</span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Active Inventory</span>
              </div>
            </div>

            {/* Donut Chart Legend */}
            <div className="space-y-3 w-full text-xs font-semibold">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#0a192f]" /> Residential Houses
                </span>
                <span className="font-bold text-[#0a192f]">45%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#c5a059]" /> Apartments & Units
                </span>
                <span className="font-bold text-[#c5a059]">30%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-sky-600" /> Commercial & Projects
                </span>
                <span className="font-bold text-sky-600">25%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Properties Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#0a192f]">Top Viewed Properties Portfolio</CardTitle>
          <CardDescription>Detailed engagement statistics for active Australian listings.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">
              <tr>
                <th className="py-3 px-4">Property Address</th>
                <th className="py-3 px-4">Suburb</th>
                <th className="py-3 px-4">Detail Views</th>
                <th className="py-3 px-4">Saved Favourites</th>
                <th className="py-3 px-4 text-right">Enquiries Created</th>
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
    </div>
  );
}
