import React from "react";
import Link from "next/link";
import { Building2, RefreshCw, Users, FileText, CheckCircle2, AlertTriangle, ArrowUpRight, ShieldCheck, Eye, PhoneCall } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";

export default function AdminDashboardPage() {
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

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Listings"
          value={MOCK_AUSTRALIAN_PROPERTIES.length}
          change="+12%"
          isPositive={true}
          icon={Building2}
          subtitle="100% MRI Synchronized"
        />
        <StatsCard
          title="MRI Sync Health"
          value="100%"
          change="0 errors"
          isPositive={true}
          icon={RefreshCw}
          subtitle="Vault & Property Tree online"
        />
        <StatsCard
          title="New Enquiries & Leads"
          value="28"
          change="+18%"
          isPositive={true}
          icon={Users}
          subtitle="Assigned to 5 local offices"
        />
        <StatsCard
          title="Website Property Views"
          value="14,250"
          change="+32%"
          isPositive={true}
          icon={Eye}
          subtitle="Last 30 days"
        />
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Synchronized Properties */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle>Recent MRI Synchronized Properties</CardTitle>
                <p className="text-xs text-slate-500 mt-1">
                  Authoritative listings imported automatically from MRI Vault & Property Tree.
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
                  <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">MRI Provider</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Sync Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {MOCK_AUSTRALIAN_PROPERTIES.map((prop) => (
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
                            <span>Synced</span>
                          </span>
                        </td>
                      </tr>
                    ))}
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
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>MRI Vault Connection</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 text-[10px]">CONNECTED</span>
                </div>
                <p className="text-[11px] text-emerald-700">Last synced 2 minutes ago via Webhook</p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>MRI Property Tree Connection</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 text-[10px]">CONNECTED</span>
                </div>
                <p className="text-[11px] text-emerald-700">Last synced 5 minutes ago</p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Pending Sync Queue</span>
                  <span className="font-semibold text-slate-900">0 jobs</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Failed Sync Queue</span>
                  <span className="font-semibold text-slate-900">0 records</span>
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
