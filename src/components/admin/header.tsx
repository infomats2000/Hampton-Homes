"use client";

import React from "react";
import Link from "next/link";
import { Search, Bell, Shield, User, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

export function AdminHeader() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Global Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search address, MRI ID, lead, agent or customer..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100/80 rounded-lg text-xs text-slate-800 placeholder-slate-400 border-none focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
          />
        </div>
      </div>

      {/* Right Action Icons & User Info */}
      <div className="flex items-center gap-4">
        {/* Live Sync Status Pill */}
        <Link href="/admin/mri" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium hover:bg-emerald-100 transition-colors">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          <span>MRI Vault Synced</span>
        </Link>

        <Link href="/" target="_blank" className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#0a192f] transition-colors">
          <span>View Public Site</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        {/* Notifications Button */}
        <Link href="/admin/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500" />
          </Button>
        </Link>

        {/* Admin User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="h-9 w-9 rounded-full bg-[#0a192f] text-white flex items-center justify-center font-bold text-xs">
            SH
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold text-slate-900 leading-none">Sarah Hampton</span>
            <span className="text-[10px] text-slate-500 font-medium">Super Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
