"use client";

import React, { useState } from "react";
import { Settings, ShieldCheck, Building2, Server, Mail, Save, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AdminSettingsPage() {
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
              System & Agency Configuration Settings
            </h1>
            <Badge variant="gold">Section 58 Compliant</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Global agency settings, MRI CRM API credentials, transactional email servers, and compliance controls.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={handleSaveSettings} className="gap-2 text-xs">
          <Save className="h-4 w-4" />
          <span>Save All Settings</span>
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>System Settings Updated Successfully!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Agency Corporate Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#c5a059]" />
              <span>Agency Corporate Identity</span>
            </CardTitle>
            <CardDescription>Primary Australian real estate licensing & agency details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-medium">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Agency Business Name</label>
                <input
                  type="text"
                  defaultValue="Hampton Homes Real Estate Pty Ltd"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Australian Business Number (ABN)</label>
                <input
                  type="text"
                  defaultValue="98 123 456 789"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Head Office Address</label>
                <input
                  type="text"
                  defaultValue="Level 18, 100 Mount Street, North Sydney NSW 2060"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Primary Phone</label>
                <input
                  type="text"
                  defaultValue="1300 888 999"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Default Currency</label>
                <input
                  type="text"
                  readOnly
                  defaultValue="AUD ($)"
                  className="w-full px-3 py-2 bg-slate-200/60 border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MRI Integration Settings */}
        <Card className="border-l-4 border-l-sky-600">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Server className="h-5 w-5 text-sky-600" />
              <span>MRI Integration Credentials</span>
            </CardTitle>
            <CardDescription>Configure MRI Vault & Property Tree API endpoints and webhook signature secrets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-medium">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">MRI Vault API Key</label>
                <input
                  type="password"
                  defaultValue="mri_vlt_sec_88492049182390"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">MRI Property Tree Secret Key</label>
                <input
                  type="password"
                  defaultValue="mri_pt_sec_99401204921094"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Webhook Listener Secret Token</label>
              <input
                type="text"
                readOnly
                defaultValue="whsec_0a192f_c5a059_australia_mri_webhook_listener"
                className="w-full px-3 py-2 bg-slate-200/60 border border-slate-200 rounded-lg font-mono text-[#0a192f] focus:outline-none"
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
