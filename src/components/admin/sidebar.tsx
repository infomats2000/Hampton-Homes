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
  X,
  Plug2,
  Network,
  FileSignature,
  TrendingUp,
  BookUser,
  Palette,
  Radio,
  DollarSign,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { AGENCY_NAME, AGENCY_LOGO_URL } from "@/lib/agency-config";

const ADMIN_MENU_GROUPS = [
  {
    title: "Core Operations",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Properties", href: "/admin/properties", icon: Building2 },
      { label: "MRI Integration", href: "/admin/mri", icon: RefreshCw, badge: "Live" },
      { label: "AI Marketing & Tasks", href: "/admin/marketing-tasks", icon: Sparkles, badge: "AI" },
      { label: "Property Management", href: "/admin/property-management", icon: KeyRound, badge: "Rentals" },
      { label: "Trust & Commission", href: "/admin/financial", icon: DollarSign, badge: "ERP" },
      { label: "AML & eIDV Verification", href: "/admin/aml-verification", icon: ShieldCheck, badge: "AUSTRAC" },
      { label: "Leads & Pipeline", href: "/admin/leads", icon: Users },
      { label: "Appraisal Requests", href: "/admin/appraisals", icon: Briefcase },
      { label: "Inspections", href: "/admin/inspections", icon: Calendar },
    ],
  },
  {
    title: "Integration Hub",
    items: [
      { label: "All Integrations", href: "/admin/integrations", icon: Network, badge: "Hub" },
      { label: "Portal Feeds", href: "/admin/syndication", icon: Radio, badge: "REA" },
      { label: "Unified Contacts", href: "/admin/contacts", icon: BookUser },
      { label: "Digital Documents", href: "/admin/documents", icon: FileSignature },
      { label: "Property Intelligence", href: "/admin/property-intelligence", icon: TrendingUp, badge: "RP Data" },
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
      { label: "Agency Branding", href: "/admin/settings", icon: Palette, badge: "Config" },
      { label: "System Settings", href: "/admin/system", icon: Settings },
      { label: "System Health", href: "/admin/system-health", icon: Activity },
    ],
  },
];


interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="w-64 bg-[#071325] text-slate-300 flex flex-col h-full border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center border-b border-slate-800 justify-between">
        <Link href="/admin/dashboard" onClick={onClose} className="flex items-center gap-3">
          <img
              src={AGENCY_LOGO_URL}
              alt={`${AGENCY_NAME} Admin Portal`}
              className="h-10 w-auto object-contain rounded-md shadow-sm"
            />
          <span className="text-[10px] uppercase tracking-widest text-[#c5a059] font-bold border border-[#c5a059]/30 px-2 py-0.5 rounded-full bg-[#c5a059]/10">
            Admin
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        )}
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
                  onClick={onClose}
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
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:flex h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-over) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          {/* Slide Drawer */}
          <div className="relative z-10 flex flex-1 w-full max-w-xs bg-[#071325] shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
