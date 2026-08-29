import React from "react";
import Link from "next/link";
import { Building2, RefreshCw, Users, FileText, CheckCircle2, AlertTriangle, ArrowUpRight, ShieldCheck, Eye, PhoneCall } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllProperties } from "@/lib/properties/database-service";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getThirtyDaysAgo() {
  return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
}

export default async function AdminDashboardPage() {
  const thirtyDaysAgo = getThirtyDaysAgo();
  const [properties, newLeadCount, enquiryCount, latestSync, pendingSyncCount, failedSyncCount] = await Promise.all([
    getAllProperties(),
    prisma.lead.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.enquiry.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.syncJob.findFirst({ orderBy: { startedAt: "desc" } }),
    prisma.syncJob.count({ where: { status: { in: ["PENDING", "RUNNING"] } } }),
    prisma.syncJob.count({ where: { status: "FAILED" } }),
  ]);
  const activeProperties = properties.filter((property) => !["DRAFT", "WITHDRAWN", "OFF_MARKET", "SOLD", "LEASED"].includes(property.status));
  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
            Executive Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time portfolio overview, MRI Vault & Property Tree sync status, and lead pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/mri">
            <Button variant="outline" className="gap-2 text-xs">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>MRI Integration Centre</span>
            </Button>
          </Link>
          <Link href="/admin/properties">
            <Button variant="default" className="gap-2 text-xs">
              <Building2 className="h-3.5 w-3.5" />
              <span>Manage Properties</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Start Onboarding Hub for New Agency Users */}
      <Card className="bg-gradient-to-r from-[#071325] via-[#0a192f] to-[#1a365d] text-white border-none shadow-xl overflow-hidden relative">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />
        <CardContent className="p-6 sm:p-8 space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Zero-Training Staff Onboarding Guide</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white mt-2">
                Welcome to Infomats Real Estate Platform
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-light">
                Follow these 5 simple steps to set up your agency, syndicate listings, generate AI copy, and manage trust accounts with zero friction.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-center shrink-0">
              <p className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">Platform Readiness</p>
              <p className="text-xl font-bold text-[#c5a059]">100% Ready</p>
            </div>
          </div>

          {/* 5 Onboarding Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Link
              href="/admin/settings"
              className="bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl p-4 transition-all group hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#c5a059]">Step 1</span>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <p className="font-bold text-xs text-white group-hover:text-[#c5a059] transition-colors">
                Agency Settings
              </p>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Set logo, ABN, brand colours &amp; MRI credentials.
              </p>
            </Link>

            <Link
              href="/admin/syndication"
              className="bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl p-4 transition-all group hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#c5a059]">Step 2</span>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <p className="font-bold text-xs text-white group-hover:text-[#c5a059] transition-colors">
                Portal Syndication
              </p>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Audit REAXML &amp; Domain feed readiness.
              </p>
            </Link>

            <Link
              href="/admin/financial"
              className="bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl p-4 transition-all group hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#c5a059]">Step 3</span>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <p className="font-bold text-xs text-white group-hover:text-[#c5a059] transition-colors">
                Trust Accounting
              </p>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Issue statutory receipts &amp; GST splits.
              </p>
            </Link>

            <Link
              href="/admin/property-management"
              className="bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl p-4 transition-all group hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#c5a059]">Step 4</span>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <p className="font-bold text-xs text-white group-hover:text-[#c5a059] transition-colors">
                Tenancy Operations
              </p>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Track lease expiries &amp; work orders.
              </p>
            </Link>

            <Link
              href="/admin/marketing-tasks"
              className="bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl p-4 transition-all group hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#c5a059]">Step 5</span>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <p className="font-bold text-xs text-white group-hover:text-[#c5a059] transition-colors">
                AI Copy &amp; Tasks
              </p>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Generate AI copy &amp; view matched buyers.
              </p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Listings"
          value={activeProperties.length}
          change={`${properties.length} total`}
          isPositive={true}
          icon={Building2}
          subtitle="Published and internal records"
        />
        <StatsCard
          title="MRI Sync Health"
          value={latestSync?.status ?? "Not run"}
          change={latestSync ? `${latestSync.recordsFailed} errors` : "No sync history"}
          isPositive={latestSync?.status === "SUCCESS"}
          icon={RefreshCw}
          subtitle="Latest recorded synchronization job"
        />
        <StatsCard
          title="New Enquiries & Leads"
          value={newLeadCount}
          change="Last 30 days"
          isPositive={true}
          icon={Users}
          subtitle="Stored in DigitalOcean"
        />
        <StatsCard
          title="Property Enquiries"
          value={enquiryCount}
          change="Last 30 days"
          isPositive={true}
          icon={Eye}
          subtitle="Verified website submissions"
        />
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Synchronized Properties */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle>Recent Property Listings</CardTitle>
                <p className="text-xs text-slate-500 mt-1">
                  Latest listings stored in the DigitalOcean property database.
                </p>
              </div>
              <Link href="/admin/properties">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  <span>View All</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">
                    <tr>
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">MRI Provider</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Sync Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {properties.slice(0, 8).map((prop) => (
                      <tr key={prop.externalId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={prop.photos[0]}
                            alt={prop.headline}
                            className="h-10 w-14 rounded-md object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{prop.streetNumber} {prop.streetName}</p>
                            <p className="text-[11px] text-slate-500">{prop.suburb} {prop.state} {prop.postcode}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                            {prop.provider}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={prop.status === "FOR_SALE" ? "sale" : prop.status === "FOR_RENT" ? "rent" : "underOffer"}>
                            {prop.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">{prop.priceDisplay}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Stored</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                    {properties.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">No properties have been added yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Status Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#c5a059]" />
                <span>MRI Integration Centre</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-3 rounded-lg border space-y-1 ${latestSync?.status === "SUCCESS" ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-center justify-between text-xs font-bold text-slate-900"><span>Latest MRI Sync</span><span className="rounded bg-white px-2 py-0.5 text-[10px]">{latestSync?.status ?? "NOT CONFIGURED"}</span></div>
                <p className="text-[11px] text-slate-600">{latestSync ? `${latestSync.provider} · ${latestSync.recordsProcessed} records · ${latestSync.startedAt.toLocaleString("en-AU")}` : "No MRI synchronization job has been recorded."}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Pending Sync Queue</span>
                  <span className="font-semibold text-slate-900">{pendingSyncCount} jobs</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Failed Sync Queue</span>
                  <span className="font-semibold text-slate-900">{failedSyncCount} jobs</span>
                </div>
              </div>

              <Link href="/admin/mri" className="block pt-2">
                <Button variant="gold" className="w-full text-xs">
                  Open Integration Centre
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
