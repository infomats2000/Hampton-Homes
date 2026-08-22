"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  RefreshCw,
  Users,
  Briefcase,
  FileText,
  Search,
  Bell,
  Settings,
  ShieldCheck,
  BarChart3,
  Calendar,
  Image,
  MapPin,
  Newspaper,
  Sliders,
  History,
  Activity,
  UserCheck,
  Sparkles,
} from "lucide-react";

const ADMIN_MENU_GROUPS = [
  {
    title: "Core Operations",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Properties", href: "/admin/properties", icon: Building2 },
      { label: "MRI Integration", href: "/admin/mri", icon: RefreshCw, badge: "Live" },
      { label: "Leads & Pipeline", href: "/admin/leads", icon: Users },
      { label: "Appraisal Requests", href: "/admin/appraisals", icon: Briefcase },
      { label: "Inspections", href: "/admin/inspections", icon: Calendar },
    ],
  },
  {
    title: "Agency & People",
    items: [
      { label: "Customers", href: "/admin/customers", icon: UserCheck },
      { label: "Agents & Staff", href: "/admin/agents", icon: Users },
      { label: "Offices & Branches", href: "/admin/offices", icon: MapPin },
    ],
  },
  {
    title: "CMS & Marketing",
    items: [
      { label: "Pages & Builder", href: "/admin/cms", icon: FileText },
      { label: "News & Insights", href: "/admin/news", icon: Newspaper },
      { label: "Suburb Guides", href: "/admin/suburbs", icon: MapPin },
      { label: "Media Library", href: "/admin/media", icon: Image },
      { label: "SEO Engine", href: "/admin/seo", icon: Search },
    ],
  },
  {
    title: "Intelligence & Security",
    items: [
      { label: "ERP Dynamic Reports", href: "/admin/reports", icon: FileText, badge: "ERP" },
      { label: "Reports & Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
      { label: "User Management", href: "/admin/users", icon: Users },
      { label: "Roles & Permissions", href: "/admin/roles", icon: ShieldCheck },
      { label: "Audit Log", href: "/admin/audit", icon: History },
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "System Health", href: "/admin/system", icon: Activity },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#071325] text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center border-b border-slate-800 justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-md gold-gradient flex items-center justify-center font-serif text-lg font-bold text-slate-900">
            H
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-white tracking-tight leading-none text-base">
              HAMPTON
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#c5a059] font-medium">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {ADMIN_MENU_GROUPS.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-3 text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2">
              {group.title}
            </p>
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#1a365d] text-white font-semibold shadow-xs"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? "text-[#c5a059]" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* System Health Quick Status */}
      <div className="p-4 border-t border-slate-800 bg-[#0a192f]">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            MRI Sync Active
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">100% OK</span>
        </div>
        <p className="text-[10px] text-slate-500">Vault & Property Tree connected</p>
      </div>
    </aside>
  );
}
