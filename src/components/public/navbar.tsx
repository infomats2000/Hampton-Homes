"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, User, Menu, X, Heart, Search } from "lucide-react";
import { Button } from "../ui/button";

const NAV_ITEMS = [
  { label: "Buy", href: "/buy" },
  { label: "Rent", href: "/rent" },
  { label: "Sold", href: "/sold" },
  { label: "Commercial", href: "/commercial" },
  { label: "Projects", href: "/projects" },
  { label: "Agents", href: "/agents" },
  { label: "Offices", href: "/offices" },
  { label: "Suburbs", href: "/suburbs" },
  { label: "Sell", href: "/sell" },
  { label: "Property Management", href: "/property-management" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

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
              <span>1300 HAMPTON (1300 426 786)</span>
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <span className="hidden md:inline-block text-slate-300">
              Authoritative MRI Vault & Property Tree Integrated Agency
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-white transition-colors">
              Staff Portal
            </Link>
            <Link href="/customer/dashboard" className="flex items-center gap-1 hover:text-white transition-colors">
              <User className="h-3.5 w-3.5 text-[#c5a059]" />
              <span>My Account</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.jpg"
              alt="Hampton Homes Realtors"
              className="h-12 w-auto object-contain rounded-md shadow-sm group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.slice(0, 8).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-700 hover:text-[#0a192f] transition-colors"
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
