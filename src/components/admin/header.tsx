"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Shield,
  User,
  ExternalLink,
  RefreshCw,
  Menu,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "../ui/button";
import { AGENCY_NAME } from "@/lib/agency-config";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

interface AuthUserState {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUserState | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string>("GOLD_ENTERPRISE");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          if (data.subscription?.tier) {
            setSubscriptionTier(data.subscription.tier);
          }
        }
      } catch (err) {
        console.error("Failed to load user in header:", err);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      router.push("/login");
    }
  };

  const isSuperAdmin = user?.roles?.includes("SUPER_ADMIN");
  const primaryRole = user?.roles?.[0] || "ADMIN";

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Mobile Hamburger + Global Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            title="Open Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search address, MRI ID, lead, agent..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100/80 rounded-lg text-xs text-slate-800 placeholder-slate-400 border-none focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
          />
        </div>
      </div>

      {/* Right Action Icons & User Info */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Super Admin Licensing & Feature Controls Button */}
        {isSuperAdmin && (
          <Link
            href="/super-admin"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors shadow-2xs"
            title="Super Admin Licensing & Feature Controls"
          >
            <Shield className="h-3.5 w-3.5 text-amber-600" />
            <span>Platform Controls</span>
          </Link>
        )}

        {/* Subscription Tier Badge */}
        <div
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold"
          title={`Active Tier: ${subscriptionTier}`}
        >
          <Sparkles className="h-3 w-3 text-[#c5a059]" />
          <span>{subscriptionTier.replace("_", " ")}</span>
        </div>

        {/* Live Sync Status Pill */}
        <Link
          href="/admin/mri"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium hover:bg-emerald-100 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>MRI Vault Live</span>
        </Link>

        <Link
          href="/"
          target="_blank"
          className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#0a192f] transition-colors"
        >
          <span>Public Site</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        {/* Notifications Button */}
        <Link href="/admin/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500" />
          </Button>
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#0a192f] text-[#c5a059] flex items-center justify-center font-bold text-xs shrink-0 border border-slate-300">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : "HH"}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-none">
                {user ? `${user.firstName} ${user.lastName}` : `${AGENCY_NAME} Staff`}
              </span>
              <span className="text-[10px] text-slate-500 font-medium capitalize mt-0.5">
                {primaryRole.replace(/_/g, " ").toLowerCase()}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user ? `${user.firstName} ${user.lastName}` : "User"}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user?.email || "staff@agency.com.au"}
                </p>
              </div>

              {isSuperAdmin && (
                <Link
                  href="/super-admin"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-amber-800 hover:bg-amber-50 font-semibold"
                >
                  <Shield className="h-4 w-4 text-amber-600" />
                  <span>Platform Controls</span>
                </Link>
              )}

              <Link
                href="/admin/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
              >
                <User className="h-4 w-4 text-slate-400" />
                <span>Agency Settings</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 border-t border-slate-100"
              >
                <LogOut className="h-4 w-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
