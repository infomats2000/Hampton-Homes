"use client";

import React, { useState, useEffect } from "react";
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
  Network,
  FileSignature,
  TrendingUp,
  BookUser,
  Palette,
  Radio,
  DollarSign,
  KeyRound,
  Sparkles,
  Quote,
  UploadCloud,
  Shield,
} from "lucide-react";
import {
  AGENCY_NAME,
  AGENCY_LOGO_URL,
} from "@/lib/agency-config";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [features, setFeatures] = useState<Record<string, boolean>>({
    propertyManagement: true,
    trustAccounting: true,
    amlVerification: true,
    xeroSync: true,
    portalSyndication: true,
    aiCopywriter: true,
    propertyIntelligence: true,
    digitalDocuments: true,
    news: true,
    suburbGuides: true,
  });
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    async function fetchFeatures() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.user) {
          if (data.user.roles?.includes("SUPER_ADMIN")) {
            setIsSuperAdmin(true);
          }
          if (data.subscription?.features) {
            setFeatures(data.subscription.features);
          }
        }
      } catch (err) {
        console.error("Failed to load features in sidebar:", err);
      }
    }
    fetchFeatures();
  }, []);

  const hasFeature = (key: string) => {
    if (isSuperAdmin) return true;
    return Boolean(features[key]);
  };

  const menuGroups: Array<{ title: string; items: MenuItem[] }> = [
    {
      title: "Core Operations",
      items: (
        [
          { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
          { label: "Properties", href: "/admin/properties", icon: Building2 },
          { label: "MRI Integration", href: "/admin/mri", icon: RefreshCw, badge: "Live" },
          hasFeature("aiCopywriter")
            ? { label: "AI Marketing & Tasks", href: "/admin/marketing-tasks", icon: Sparkles, badge: "AI" }
            : null,
          hasFeature("propertyManagement")
            ? { label: "Property Management", href: "/admin/property-management", icon: KeyRound, badge: "Rentals" }
            : null,
          hasFeature("trustAccounting")
            ? { label: "Trust & Commission", href: "/admin/financial", icon: DollarSign, badge: "ERP" }
            : null,
          hasFeature("amlVerification")
            ? { label: "AML & eIDV Verification", href: "/admin/aml-verification", icon: ShieldCheck, badge: "AUSTRAC" }
            : null,
          { label: "Leads & Pipeline", href: "/admin/leads", icon: Users },
          { label: "Appraisal Requests", href: "/admin/appraisals", icon: Briefcase },
          { label: "Inspections", href: "/admin/inspections", icon: Calendar },
        ] as Array<MenuItem | null>
      ).filter((item): item is MenuItem => item !== null),
    },
    {
      title: "Integration Hub",
      items: (
        [
          { label: "All Integrations", href: "/admin/integrations", icon: Network, badge: "Hub" },
          { label: "AI Data Importer", href: "/admin/import", icon: UploadCloud, badge: "AI" },
          hasFeature("xeroSync")
            ? { label: "Xero Accounting", href: "/admin/integrations/xero", icon: DollarSign, badge: "Sync" }
            : null,
          hasFeature("portalSyndication")
            ? { label: "Portal Feeds", href: "/admin/syndication", icon: Radio, badge: "REA" }
            : null,
          { label: "Unified Contacts", href: "/admin/contacts", icon: BookUser },
          hasFeature("digitalDocuments")
            ? { label: "Digital Documents", href: "/admin/documents", icon: FileSignature }
            : null,
          hasFeature("propertyIntelligence")
            ? { label: "Property Intelligence", href: "/admin/property-intelligence", icon: TrendingUp, badge: "RP Data" }
            : null,
        ] as Array<MenuItem | null>
      ).filter((item): item is MenuItem => item !== null),
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
      items: (
        [
          { label: "Pages & Builder", href: "/admin/cms", icon: FileText },
          { label: "Client Reviews", href: "/admin/cms/testimonials", icon: Quote, badge: "5★" },
          hasFeature("news") ? { label: "News & Insights", href: "/admin/news", icon: Newspaper } : null,
          hasFeature("suburbGuides") ? { label: "Suburb Guides", href: "/admin/suburbs", icon: MapPin } : null,
          { label: "Media Library", href: "/admin/media", icon: Image },
          { label: "SEO Engine", href: "/admin/seo", icon: Search },
        ] as Array<MenuItem | null>
      ).filter((item): item is MenuItem => item !== null),
    },
    {
      title: "Intelligence & Security",
      items: [
        ...(isSuperAdmin
          ? [{ label: "Platform Controls", href: "/super-admin", icon: Shield, badge: "SaaS" }]
          : []),
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
            {isSuperAdmin ? "Super Admin" : "Admin ERP"}
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
        {menuGroups.map((group, idx) => (
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
            MRI Vault &amp; Neon DB
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">100% OK</span>
        </div>
        <p className="text-[10px] text-slate-500">Live PostgreSQL Connected</p>
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
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10 flex flex-1 w-full max-w-xs bg-[#071325] shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
