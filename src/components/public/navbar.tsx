"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Phone,
  User,
  Menu,
  X,
  Heart,
  Search,
  LogOut,
  ChevronDown,
  Shield,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  AGENCY_NAME,
  AGENCY_PHONE_DISPLAY,
  FEATURE_CUSTOMER_PORTAL,
  FEATURE_COMMERCIAL_LISTINGS,
  FEATURE_PROJECTS,
  FEATURE_AUCTIONS,
  FEATURE_PROPERTY_MANAGEMENT,
  FEATURE_NEWS,
  FEATURE_SUBURB_GUIDES,
} from "@/lib/agency-config";

const BASE_NAV_ITEMS = [
  { label: "Buy", href: "/buy", enabled: true },
  { label: "Rent", href: "/rent", enabled: true },
  { label: "Sold", href: "/sold", enabled: true },
  { label: "Commercial", href: "/commercial", enabled: FEATURE_COMMERCIAL_LISTINGS },
  { label: "Projects", href: "/projects", enabled: FEATURE_PROJECTS },
  { label: "Agents", href: "/agents", enabled: true },
  { label: "Offices", href: "/offices", enabled: true },
  { label: "Suburbs", href: "/suburbs", enabled: FEATURE_SUBURB_GUIDES },
  { label: "Sell", href: "/sell", enabled: true },
  { label: "Property Management", href: "/property-management", enabled: FEATURE_PROPERTY_MANAGEMENT },
  { label: "News", href: "/news", enabled: FEATURE_NEWS },
  { label: "Contact", href: "/contact", enabled: true },
];

const NAV_ITEMS = BASE_NAV_ITEMS.filter((item) => item.enabled);

interface AuthUserState {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export function PublicNavbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUserState | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch {
        // Unauthenticated
      }
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setUserDropdownOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      // Ignore
    }
  };

  const isStaff = user?.roles?.some((r) =>
    ["SUPER_ADMIN", "ADMIN", "MARKETING_ADMIN", "OFFICE_MANAGER", "AGENT", "SUPPORT"].includes(r)
  );
  const isSuperAdmin = user?.roles?.includes("SUPER_ADMIN");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      {/* Top Announcement Bar */}
      <div className="bg-[#071325] text-xs font-medium text-slate-300 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-[#c5a059]" />
              <span>{AGENCY_PHONE_DISPLAY}</span>
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <span className="hidden md:inline-block text-slate-300">
              {AGENCY_NAME} — Live MRI &amp; Neon DB Integrated
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-white transition-colors">
              Staff Portal
            </Link>
            {FEATURE_CUSTOMER_PORTAL && (
              <Link
                href={user ? "/customer/dashboard" : "/login?redirect=/customer/dashboard"}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <User className="h-3.5 w-3.5 text-[#c5a059]" />
                <span>{user ? `Hi, ${user.firstName}` : "My Account"}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#071325] text-[#c5a059] border border-slate-700 flex items-center justify-center font-serif font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              H
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base sm:text-lg text-[#0a192f] tracking-tight leading-none group-hover:text-[#c5a059] transition-colors">
                {AGENCY_NAME}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
                Premier Real Estate ERP
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs xl:text-sm font-medium text-slate-700 hover:text-[#0a192f] transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs & Auth Controls */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/customer/favourites">
              <Button variant="ghost" size="icon" title="Saved Favourites">
                <Heart className="h-5 w-5 text-slate-600" />
              </Button>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#071325] text-[#c5a059] flex items-center justify-center text-[10px] font-bold">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  <span>{user.firstName}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/customer/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard className="h-4 w-4 text-slate-400" />
                      <span>Customer Portal</span>
                    </Link>

                    {isStaff && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <Shield className="h-4 w-4 text-[#c5a059]" />
                        <span>Admin ERP Portal</span>
                      </Link>
                    )}

                    {isSuperAdmin && (
                      <Link
                        href="/super-admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-amber-800 hover:bg-amber-50 font-semibold"
                      >
                        <Shield className="h-4 w-4 text-amber-600" />
                        <span>Platform Controls</span>
                      </Link>
                    )}

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
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="text-xs border-slate-300">
                  Sign In
                </Button>
              </Link>
            )}

            <Link href="/sell">
              <Button variant="gold" size="md">
                Request Appraisal
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-slate-50"
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <Button onClick={handleLogout} variant="outline" className="w-full text-rose-600">
                Sign Out ({user.firstName})
              </Button>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In to Account
                </Button>
              </Link>
            )}
            <Link href="/sell" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="gold" className="w-full">
                Request Appraisal
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
