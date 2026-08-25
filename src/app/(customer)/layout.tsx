"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  Search,
  Bell,
  Calendar,
  User,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicFooter } from "@/components/public/footer";

const CUSTOMER_NAV_ITEMS = [
  { label: "Overview", href: "/customer/dashboard", icon: LayoutDashboard },
  { label: "Saved Properties", href: "/customer/favourites", icon: Heart },
  { label: "Saved Searches", href: "/customer/saved-searches", icon: Search },
  { label: "Property Alerts", href: "/customer/alerts", icon: Bell },
  { label: "Inspections", href: "/customer/inspections", icon: Calendar },
  { label: "Profile & Privacy", href: "/customer/profile", icon: User },
];

interface CustomerUserState {
  firstName: string;
  lastName: string;
  email: string;
}

export default function CustomerPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CustomerUserState>({
    firstName: "James",
    lastName: "Harrison",
    email: "james.harrison@example.com.au",
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.user) {
          setUser({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
          });
        }
      } catch {
        // Fallback to default
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const initials = `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase() || "CU";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <PublicNavbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Customer Portal Navigation Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              {/* Customer Profile Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="h-12 w-12 rounded-full gold-gradient text-slate-900 font-bold flex items-center justify-center text-lg shadow-sm">
                  {initials}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif font-bold text-slate-900 text-base truncate">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate">{user.email}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Verified Customer</span>
                  </span>
                </div>
              </div>

              {/* Nav Menu */}
              <nav className="space-y-1">
                {CUSTOMER_NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#0a192f] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 ${isActive ? "text-[#c5a059]" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`h-3.5 w-3.5 ${isActive ? "text-[#c5a059]" : "text-slate-300"}`} />
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Portal View */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
