"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, User, Menu, X, Heart, Search } from "lucide-react";
import { Button } from "../ui/button";
import {
  AGENCY_NAME,
  AGENCY_LOGO_URL,
  AGENCY_PHONE_DISPLAY,
  FEATURE_CUSTOMER_PORTAL,
  FEATURE_COMMERCIAL_LISTINGS,
  FEATURE_PROJECTS,
  FEATURE_AUCTIONS,
  FEATURE_PROPERTY_MANAGEMENT,
  FEATURE_NEWS,
  FEATURE_SUBURB_GUIDES,
} from "@/lib/agency-config";

// Nav items are filtered by feature flags — disabled features disappear automatically
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

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              {AGENCY_NAME} — MRI Vault &amp; Property Tree Integrated
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-white transition-colors">
              Staff Portal
            </Link>
            {FEATURE_CUSTOMER_PORTAL && (
              <Link href="/customer/dashboard" className="flex items-center gap-1 hover:text-white transition-colors">
                <User className="h-3.5 w-3.5 text-[#c5a059]" />
                <span>My Account</span>
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
            <img
              src={AGENCY_LOGO_URL}
              alt={`${AGENCY_NAME} Logo`}
              className="h-12 w-auto object-contain rounded-md shadow-sm group-hover:scale-105 transition-transform"
            />
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

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/customer/favourites">
              <Button variant="ghost" size="icon" title="Saved Favourites">
                <Heart className="h-5 w-5 text-slate-600" />
              </Button>
            </Link>
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
