"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building2,
  User,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AGENCY_NAME } from "@/lib/agency-config";

const DEMO_PRESETS = [
  {
    label: "Super Admin",
    subtitle: "Platform & Feature Controls",
    email: "superadmin@hamptonhomes.com.au",
    password: "SuperAdmin123!",
    badge: "SaaS Owner",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  {
    label: "Agency Owner",
    subtitle: "Full ERP & Subscription Access",
    email: "admin@hamptonhomes.com.au",
    password: "AdminPassword123!",
    badge: "Admin",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    label: "Sales Agent",
    subtitle: "Listings, Leads & Inspections",
    email: "marcus.vance@hamptonhomes.com.au",
    password: "AgentPassword123!",
    badge: "Agent",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    label: "Client / Buyer",
    subtitle: "Saved Searches & Favourites",
    email: "james.harrison@example.com.au",
    password: "CustomerPassword123!",
    badge: "Customer",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      setSuccessMessage(`Welcome back, ${data.user.firstName}! Redirecting...`);
      
      const destination = redirectTarget || data.redirectTo || "/admin";
      setTimeout(() => {
        router.push(destination);
        router.refresh();
      }, 500);
    } catch (err: any) {
      setError("A network error occurred. Please check your connection.");
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset: (typeof DEMO_PRESETS)[0]) => {
    setEmail(preset.email);
    setPassword(preset.password);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-[#071325] via-[#0a192f] to-[#040d18] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-xs font-semibold mb-4">
          <ShieldCheck className="h-4 w-4" />
          <span>Secure Unified Portal Login</span>
        </div>

        <h1 className="text-3xl font-serif font-bold text-white tracking-tight sm:text-4xl">
          {AGENCY_NAME}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to access your administrative ERP or client property portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-800 relative">
          {/* Subtle Glow Accent */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email / Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agency.com.au"
                  required
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c5a059] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/contact"
                  className="text-xs text-[#c5a059] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c5a059] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="gold"
              disabled={loading}
              className="w-full py-2.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#c5a059]/10"
            >
              {loading ? (
                <span>Authenticating with Neon DB...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="h-3.5 w-3.5 text-[#c5a059]" />
              <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase">
                Quick One-Click Demo Logins
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="p-2.5 text-left rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-[#c5a059]/40 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-[#c5a059] transition-colors">
                      {preset.label}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full border font-semibold ${preset.color}`}
                    >
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {preset.subtitle}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Register Link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-bold text-[#c5a059] hover:underline"
            >
              Create customer account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#071325] flex items-center justify-center text-white">
          Loading login portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
