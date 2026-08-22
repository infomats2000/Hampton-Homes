"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Lock, Download, Trash2, CheckCircle2, Save, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function CustomerProfilePage() {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [exportTriggered, setExportTriggered] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    setExportTriggered(true);
    setTimeout(() => setExportTriggered(false), 4000);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
            Account Profile & Privacy Settings
          </h1>
          <Badge variant="gold">Australian Privacy Act Ready</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, email preferences, data export requests, and account deletion options.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Profile Details Updated Successfully!</span>
        </div>
      )}

      {/* Personal Information Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Personal Information</CardTitle>
          <CardDescription>Your contact details used for property enquiries and inspection confirmations.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-medium">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">First Name</label>
                <input
                  type="text"
                  defaultValue="James"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Last Name</label>
                <input
                  type="text"
                  defaultValue="Harrison"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Email Address</label>
                <input
                  type="email"
                  defaultValue="james.harrison@example.com.au"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Mobile Phone</label>
                <input
                  type="tel"
                  defaultValue="0412 345 678"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                />
              </div>
            </div>

            <Button type="submit" variant="gold" size="md" className="gap-2 text-xs">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Privacy Obligations & Data Export (Section 70 of Prompt) */}
      <Card className="border-l-4 border-l-sky-600">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-sky-600" />
            <span>Australian Privacy & Data Rights</span>
          </CardTitle>
          <CardDescription>
            In accordance with Australian Privacy Principles (APPs), you have full control over your data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Export Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-bold text-slate-900 text-xs">Export My Personal Information</p>
              <p className="text-[11px] text-slate-500">Download a complete JSON archive of your saved properties, searches, enquiries, and profile data.</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData} className="gap-2 text-xs shrink-0">
              <Download className="h-4 w-4" />
              <span>Export Personal Data</span>
            </Button>
          </div>

          {exportTriggered && (
            <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-xs font-semibold">
              ✅ Personal data archive generated! Check your email for the download link.
            </div>
          )}

          {/* Account Deletion */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-rose-50 border border-rose-200">
            <div>
              <p className="font-bold text-rose-900 text-xs">Delete My Customer Account</p>
              <p className="text-[11px] text-rose-700">Permanently delete your profile, saved properties, and email alert subscriptions. This action cannot be undone.</p>
            </div>
            <Button variant="danger" size="sm" className="gap-2 text-xs shrink-0">
              <Trash2 className="h-4 w-4" />
              <span>Request Account Deletion</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
