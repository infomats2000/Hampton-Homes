"use client";

import React, { useState } from "react";
import { RefreshCw, ShieldCheck, CheckCircle2, AlertCircle, Play, RotateCcw, Database, Code, History, Zap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { mriProvider, MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";

export default function MRIIntegrationCentrePage() {
  const [syncing, setSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setSyncing(true);
    const res = await mriProvider.testConnection();
    setSyncing(false);
    setLastSyncResult(res.message);
  };

  const handleRunSync = async () => {
    setSyncing(true);
    const res = await mriProvider.syncChanges();
    setSyncing(false);
    setLastSyncResult(`Sync Completed Successfully! Job ID: ${res.jobId}. Processed ${res.recordsProcessed} properties with 0 errors.`);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
              MRI Integration Centre
            </h1>
            <Badge variant="gold">Phase 3 Ready</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Authoritative synchronisation hub for MRI Vault & Property Tree. Staff manage listings in MRI, website auto-updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" onClick={handleTestConnection} disabled={syncing} className="gap-2 text-xs">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Test Connection</span>
          </Button>
          <Button variant="gold" size="md" onClick={handleRunSync} disabled={syncing} className="gap-2 text-xs">
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            <span>Run Sync Now</span>
          </Button>
        </div>
      </div>

      {lastSyncResult && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{lastSyncResult}</span>
          </div>
          <button onClick={() => setLastSyncResult(null)} className="text-xs text-emerald-700 underline font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* Integration Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* MRI Vault Status */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">MRI Vault API</CardTitle>
              <Badge variant="success">CONNECTED</Badge>
            </div>
            <CardDescription className="text-xs">Authoritative CRM for Sales & Commercial</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Webhook Status:</span>
              <span className="font-semibold text-emerald-600">Active (202 Accepted)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Properties Synced:</span>
              <span className="font-semibold text-slate-900">{MOCK_AUSTRALIAN_PROPERTIES.length} Listings</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Last Sync Attempt:</span>
              <span className="font-semibold text-slate-700">2 mins ago (Success)</span>
            </div>
          </CardContent>
        </Card>

        {/* MRI Property Tree Status */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">MRI Property Tree</CardTitle>
              <Badge variant="success">CONNECTED</Badge>
            </div>
            <CardDescription className="text-xs">Authoritative System for Managed Rentals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Sync Frequency:</span>
              <span className="font-semibold text-slate-900">Every 5 mins (Configurable)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Rentals Synced:</span>
              <span className="font-semibold text-slate-900">1 Active Rental</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Last Reconciliation:</span>
              <span className="font-semibold text-slate-700">Today at 03:00 AM</span>
            </div>
          </CardContent>
        </Card>

        {/* Sync Queue Metrics */}
        <Card className="border-l-4 border-l-sky-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">BullMQ Sync Queue</CardTitle>
              <Badge variant="gold">OPERATIONAL</Badge>
            </div>
            <CardDescription className="text-xs">Redis Job Worker Engine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Pending Jobs:</span>
              <span className="font-semibold text-slate-900">0</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Failed Jobs:</span>
              <span className="font-semibold text-[#0a192f] font-mono">0 (Clean Queue)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Exponential Backoff:</span>
              <span className="font-semibold text-emerald-600">Enabled (3 retries)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Log & Actions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Synchronisation Audit Logs</CardTitle>
            <CardDescription>
              Detailed timeline of property creations, updates, price changes and status events from MRI.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRunSync} className="gap-1.5 text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Re-Sync All</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Correlation ID</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">MRI External ID</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {MOCK_AUSTRALIAN_PROPERTIES.map((prop, idx) => (
                  <tr key={prop.externalId} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono text-slate-500">corr_mri_20260822_{100 + idx}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold font-mono text-[10px]">
                        {prop.provider}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-900 font-bold">{prop.externalId}</td>
                    <td className="py-3 px-4">UPSERT_PROPERTY ({prop.suburb})</td>
                    <td className="py-3 px-4 text-slate-500">2026-08-22 21:40:00</td>
                    <td className="py-3 px-4">
                      <Badge variant="success">SUCCESS</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
