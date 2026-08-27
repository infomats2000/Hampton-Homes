"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Lock,
  Check,
  RefreshCw,
  Sliders,
  Building2,
  Copy,
  Save,
  LogOut,
  UserPlus,
  Users,
  UserCheck,
  UserX,
  KeyRound,
  Search,
  CheckCircle2,
  X,
  Gauge,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface PlanTierPreset {
  name: string;
  code: "GOLD_ENTERPRISE" | "SILVER_GROWTH" | "BRONZE_STARTER" | "CUSTOM";
  price: string;
  badgeColor: string;
  staffLimit: number;
  unlockedFeatures: string[];
}

export const PLAN_PRESETS: PlanTierPreset[] = [
  {
    name: "Gold Enterprise (Unlimited)",
    code: "GOLD_ENTERPRISE",
    price: "$999/mo",
    badgeColor: "bg-amber-500 text-slate-900 font-bold",
    staffLimit: 50,
    unlockedFeatures: [
      "customerPortal",
      "commercial",
      "projects",
      "auctions",
      "propertyManagement",
      "trustAccounting",
      "commissionCalculator",
      "aiCopywriter",
      "buyerMatching",
      "portalSyndication",
      "xeroSync",
      "amlVerification",
      "news",
      "suburbGuides",
      "propertyIntelligence",
      "digitalDocuments",
    ],
  },
  {
    name: "Silver Growth (Professional)",
    code: "SILVER_GROWTH",
    price: "$599/mo",
    badgeColor: "bg-slate-200 text-slate-800 font-bold",
    staffLimit: 10,
    unlockedFeatures: [
      "customerPortal",
      "commercial",
      "propertyManagement",
      "buyerMatching",
      "portalSyndication",
      "xeroSync",
      "news",
      "suburbGuides",
    ],
  },
  {
    name: "Bronze Starter (Essential)",
    code: "BRONZE_STARTER",
    price: "$299/mo",
    badgeColor: "bg-amber-700 text-white font-bold",
    staffLimit: 3,
    unlockedFeatures: [
      "customerPortal",
      "news",
      "suburbGuides",
    ],
  },
];

interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  roles: string[];
  isAgent: boolean;
  isCustomer: boolean;
}

interface SeatUsage {
  used: number;
  limit: number;
  available: number;
  canAdd: boolean;
}

export default function SuperAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  // Active Tab: "subscription" | "users"
  const [activeTab, setActiveTab] = useState<"subscription" | "users">("subscription");

  // Subscription State
  const [activePlan, setActivePlan] = useState<PlanTierPreset["code"]>("GOLD_ENTERPRISE");
  const [clientName, setClientName] = useState("Hampton Homes ERP");
  const [clientStatus, setClientStatus] = useState<"ACTIVE" | "SUSPENDED" | "TRIAL">("ACTIVE");
  const [expiryDate, setExpiryDate] = useState("2028-12-31");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Quotas State
  const [quotas, setQuotas] = useState({
    maxStaffUsers: 50,
    maxListings: 1000,
    maxOffices: 10,
    maxStorageMb: 50000,
    maxAiTokensPerMonth: 500000,
  });

  // Seat Usage
  const [seatUsage, setSeatUsage] = useState<SeatUsage>({
    used: 2,
    limit: 50,
    available: 48,
    canAdd: true,
  });

  // Feature Flags
  const [features, setFeatures] = useState<Record<string, boolean>>({
    customerPortal: true,
    commercial: true,
    projects: true,
    auctions: true,
    propertyManagement: true,
    trustAccounting: true,
    commissionCalculator: true,
    aiCopywriter: true,
    buyerMatching: true,
    portalSyndication: true,
    xeroSync: true,
    amlVerification: true,
    news: true,
    suburbGuides: true,
    propertyIntelligence: true,
    digitalDocuments: true,
  });

  // Users State
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");

  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // New User Form State
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("AgencyPass123!");
  const [newRole, setNewRole] = useState<string>("ADMIN");
  const [creatingUser, setCreatingUser] = useState(false);
  const [modalError, setModalError] = useState("");

  // Reset Password State
  const [resetNewPass, setResetNewPass] = useState("");
  const [resettingPass, setResettingPass] = useState(false);

  // Check auth session & fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        if (meData.user?.roles?.includes("SUPER_ADMIN")) {
          setIsAuthenticated(true);
        }

        const featRes = await fetch("/api/admin/features");
        const featData = await featRes.json();
        if (featData.success && featData.config) {
          setActivePlan(featData.config.tier);
          setClientName(featData.config.clientName);
          setClientStatus(featData.config.clientStatus);
          setExpiryDate(featData.config.expiryDate);
          setFeatures(featData.config.features);
          if (featData.config.quotas) {
            setQuotas(featData.config.quotas);
          }
          if (featData.seatUsage) {
            setSeatUsage(featData.seatUsage);
          }
        }
      } catch (err) {
        console.error("Failed to load super admin config:", err);
      }
    }
    loadData();
  }, []);

  // Fetch users when tab changes or on mount
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/super-admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        if (data.seatUsage) {
          setSeatUsage(data.seatUsage);
        }
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    async function loadUsers() {
      try {
        const res = await fetch("/api/super-admin/users");
        const data = await res.json();
        if (data.success && isMounted) {
          setUsers(data.users);
          if (data.seatUsage) {
            setSeatUsage(data.seatUsage);
          }
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        if (isMounted) {
          setLoadingUsers(false);
        }
      }
    }
    loadUsers();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, activeTab]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "super2026" || passcode === "SuperAdmin123!" || passcode === "admin") {
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const applyPreset = (planCode: PlanTierPreset["code"]) => {
    setActivePlan(planCode);
    const preset = PLAN_PRESETS.find((p) => p.code === planCode);
    if (preset) {
      const updated: Record<string, boolean> = {};
      Object.keys(features).forEach((key) => {
        updated[key] = preset.unlockedFeatures.includes(key);
      });
      setFeatures(updated);
      setQuotas((prev) => ({
        ...prev,
        maxStaffUsers: preset.staffLimit,
      }));
    }
  };

  const toggleFeature = (key: string) => {
    setActivePlan("CUSTOM");
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveToDatabase = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/admin/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: activePlan,
          clientName,
          clientStatus,
          expiryDate,
          features,
          quotas,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        if (data.seatUsage) {
          setSeatUsage(data.seatUsage);
        }
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      alert("Failed to save changes to database.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleUserActive = async (user: UserItem) => {
    try {
      const res = await fetch("/api/super-admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          isActive: !user.isActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, isActive: !user.isActive } : u))
        );
        if (data.seatUsage) {
          setSeatUsage(data.seatUsage);
        }
      } else {
        alert(data.error || "Failed to update user status");
      }
    } catch (err) {
      alert("Failed to communicate with server");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    setModalError("");

    try {
      const res = await fetch("/api/super-admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: newFirstName,
          lastName: newLastName,
          email: newEmail,
          phone: newPhone,
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddUserModal(false);
        setNewFirstName("");
        setNewLastName("");
        setNewEmail("");
        setNewPhone("");
        setNewPassword("AgencyPass123!");
        fetchUsers();
      } else {
        setModalError(data.error || "Failed to create user");
      }
    } catch {
      setModalError("Server connection error");
    } finally {
      setCreatingUser(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !resetNewPass) return;
    setResettingPass(true);

    try {
      const res = await fetch("/api/super-admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          newPassword: resetNewPass,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Password for ${selectedUser.email} has been updated successfully!`);
        setShowResetPasswordModal(false);
        setResetNewPass("");
      } else {
        alert(data.error || "Failed to reset password");
      }
    } catch (err) {
      alert("Server connection error");
    } finally {
      setResettingPass(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const generateEnvBlock = () => {
    return `# Super Admin Client License Configuration
NEXT_PUBLIC_SUBSCRIPTION_TIER=${activePlan}
NEXT_PUBLIC_MAX_STAFF_USERS=${quotas.maxStaffUsers}
NEXT_PUBLIC_FEATURE_CUSTOMER_PORTAL=${features.customerPortal}
NEXT_PUBLIC_FEATURE_COMMERCIAL=${features.commercial}
NEXT_PUBLIC_FEATURE_PROJECTS=${features.projects}
NEXT_PUBLIC_FEATURE_AUCTIONS=${features.auctions}
NEXT_PUBLIC_FEATURE_PROPERTY_MANAGEMENT=${features.propertyManagement}
NEXT_PUBLIC_FEATURE_TRUST_ACCOUNTING=${features.trustAccounting}
NEXT_PUBLIC_FEATURE_COMMISSION_CALCULATOR=${features.commissionCalculator}
NEXT_PUBLIC_FEATURE_AI_COPYWRITER=${features.aiCopywriter}
NEXT_PUBLIC_FEATURE_BUYER_MATCHING=${features.buyerMatching}
NEXT_PUBLIC_FEATURE_PORTAL_SYNDICATION=${features.portalSyndication}
NEXT_PUBLIC_FEATURE_XERO_SYNC=${features.xeroSync}
NEXT_PUBLIC_FEATURE_AML_VERIFICATION=${features.amlVerification}
NEXT_PUBLIC_FEATURE_NEWS=${features.news}
NEXT_PUBLIC_FEATURE_SUBURB_GUIDES=${features.suburbGuides}
NEXT_PUBLIC_FEATURE_PROPERTY_INTELLIGENCE=${features.propertyIntelligence}
NEXT_PUBLIC_FEATURE_DOCUMENTS=${features.digitalDocuments}`;
  };

  const copyEnvToClipboard = () => {
    navigator.clipboard.writeText(generateEnvBlock());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(userSearch.toLowerCase());

    if (userRoleFilter === "ALL") return matchesSearch;
    return matchesSearch && u.roles.includes(userRoleFilter);
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border border-slate-800 bg-slate-950 text-white shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#c5a059] flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold">Super Admin Security Portal</h1>
            <p className="text-xs text-slate-400">
              Sign in as Super Admin to manage client subscriptions, user seats, and feature access control.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1 text-left">
              <label htmlFor="super-passcode" className="text-xs font-bold text-slate-300">
                Master Security Passcode *
              </label>
              <input
                id="super-passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Super Admin Passcode"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a059] font-mono text-center text-white"
              />
              {passcodeError && (
                <p className="text-xs text-rose-400 font-semibold mt-1">Invalid Passcode (Hint: SuperAdmin123!)</p>
              )}
            </div>

            <Button type="submit" variant="gold" size="lg" className="w-full font-bold">
              Unlock Super Admin Controls →
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link href="/login" className="text-xs text-slate-400 hover:text-white">
              ← Return to standard login
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const staffUsagePercent = Math.min(100, Math.round((seatUsage.used / Math.max(1, quotas.maxStaffUsers)) * 100));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Platform Control Centre
              </h1>
              <p className="text-xs text-slate-400">
                Client Subscription Tiers, Staff Seat Quotas &amp; User Access Control
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Tab Switcher */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("subscription")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === "subscription"
                  ? "bg-[#c5a059] text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Subscription &amp; Modules</span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === "users"
                  ? "bg-[#c5a059] text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Users &amp; Staff Seats ({users.length})</span>
            </button>
          </div>

          <Link href="/admin">
            <Button variant="outline" className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800">
              Open Admin ERP →
            </Button>
          </Link>
          <Button
            onClick={handleSaveToDatabase}
            variant="gold"
            disabled={saving}
            className="text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
          >
            {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>{saving ? "Saving..." : "Save to Database"}</span>
          </Button>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-xs text-slate-400 hover:text-rose-400"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="max-w-7xl mx-auto p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>
            <strong>Success!</strong> Subscription settings, user seat quotas, and module feature flags have been saved to your live Neon PostgreSQL database.
          </span>
        </div>
      )}

      {/* TAB 1: SUBSCRIPTION & MODULES */}
      {activeTab === "subscription" && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Subscription Presets, Quota Controls & Modules */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Presets Selector */}
            <Card className="bg-slate-900 border-slate-800 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between font-serif">
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400" />
                    Subscription Plan Presets
                  </span>
                  <Badge variant="outline" className="border-slate-700 text-slate-300 font-mono text-[10px]">
                    Active: {activePlan}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PLAN_PRESETS.map((preset) => (
                    <button
                      key={preset.code}
                      onClick={() => applyPreset(preset.code)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        activePlan === preset.code
                          ? "bg-amber-500/10 border-amber-500/80 shadow-lg shadow-amber-500/10"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">{preset.name.split(" ")[0]}</span>
                        <span className="text-xs font-mono font-bold text-amber-400">{preset.price}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2">{preset.name.split("(")[1]?.replace(")", "") || "Tier"}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 mt-2">
                        <span>Staff Seats:</span>
                        <span className="font-bold text-white">{preset.staffLimit} Users</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {preset.unlockedFeatures.length} features included
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quantitative Quotas & Limits Config */}
            <Card className="bg-slate-900 border-slate-800 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between font-serif">
                  <span className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-amber-400" />
                    Agency Resource &amp; Usage Quotas
                  </span>
                  <span className="text-xs text-slate-400">
                    Enforced in ERP &amp; Database
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Staff User Seat Limit *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={quotas.maxStaffUsers}
                      onChange={(e) =>
                        setQuotas((prev) => ({
                          ...prev,
                          maxStaffUsers: parseInt(e.target.value) || 1,
                        }))
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Agency can create up to {quotas.maxStaffUsers} staff logins.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Max Active Listings
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={10000}
                      value={quotas.maxListings}
                      onChange={(e) =>
                        setQuotas((prev) => ({
                          ...prev,
                          maxListings: parseInt(e.target.value) || 25,
                        }))
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Active properties allowed on portal.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Max Office Branches
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={quotas.maxOffices}
                      onChange={(e) =>
                        setQuotas((prev) => ({
                          ...prev,
                          maxOffices: parseInt(e.target.value) || 1,
                        }))
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Locations and branch offices.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Granular Module Toggles */}
            <Card className="bg-slate-900 border-slate-800 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between font-serif">
                  <span className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-amber-400" />
                    Granular ERP Modules &amp; Feature Flags
                  </span>
                  <span className="text-xs text-slate-400">
                    {Object.values(features).filter(Boolean).length} of {Object.keys(features).length} Enabled
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(features).map(([key, isEnabled]) => (
                    <div
                      key={key}
                      onClick={() => toggleFeature(key)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isEnabled
                          ? "bg-slate-950 border-emerald-500/40 hover:border-emerald-500"
                          : "bg-slate-950/40 border-slate-800/80 opacity-60 hover:opacity-90"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isEnabled
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-slate-800 text-slate-500"
                          }`}
                        >
                          {isEnabled ? <Check className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {isEnabled ? "Module Active for Client" : "Locked (Subscription Required)"}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`w-9 h-5 rounded-full relative transition-colors ${
                          isEnabled ? "bg-emerald-500" : "bg-slate-800"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                            isEnabled ? "left-4.5" : "left-1"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Col: Client Metadata & Environment Config Block */}
          <div className="space-y-6">
            {/* Staff Seat Meter Widget */}
            <Card className="bg-slate-900 border-slate-800 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between font-serif">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-amber-400" />
                    Staff Seat Allocation
                  </span>
                  <button
                    onClick={() => setActiveTab("users")}
                    className="text-xs text-[#c5a059] hover:underline"
                  >
                    Manage Users →
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Active Staff Users:</span>
                  <span className="font-bold text-white font-mono">
                    {seatUsage.used} / {quotas.maxStaffUsers} Seats
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all ${
                      staffUsagePercent > 90
                        ? "bg-rose-500"
                        : staffUsagePercent > 70
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.max(5, staffUsagePercent)}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400">
                  {quotas.maxStaffUsers - seatUsage.used} staff seats available before quota limit is reached.
                </p>
              </CardContent>
            </Card>

            {/* Client Metadata Card */}
            <Card className="bg-slate-900 border-slate-800 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 font-serif">
                  <Building2 className="h-4 w-4 text-amber-400" />
                  Client Account Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Agency Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Subscription Status</label>
                  <select
                    value={clientStatus}
                    onChange={(e) => setClientStatus(e.target.value as "ACTIVE" | "TRIAL" | "SUSPENDED")}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  >
                    <option value="ACTIVE">ACTIVE (Full Service)</option>
                    <option value="TRIAL">TRIAL (14 Days)</option>
                    <option value="SUSPENDED">SUSPENDED (Frozen)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">License Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Environment Variable Exporter */}
            <Card className="bg-slate-900 border-slate-800 text-white">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 font-serif">
                  <Copy className="h-4 w-4 text-amber-400" />
                  .env.local Config Exporter
                </CardTitle>
                <Button
                  onClick={copyEnvToClipboard}
                  size="sm"
                  variant="outline"
                  className="text-[10px] h-7 border-slate-700 text-slate-300"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400 mr-1" /> : null}
                  <span>{copied ? "Copied!" : "Copy .env"}</span>
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="p-3 bg-slate-950 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto max-h-48 border border-slate-800">
                  {generateEnvBlock()}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT & SEAT CONTROLS */}
      {activeTab === "users" && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top User Controls Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-900 border-slate-800 text-white p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">Total System Users</span>
                <Users className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">{users.length}</div>
              <p className="text-[11px] text-slate-400 mt-1">Super Admins, Agency Staff &amp; Customers</p>
            </Card>

            <Card className="bg-slate-900 border-slate-800 text-white p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">Staff Seats Active</span>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px]">
                  {quotas.maxStaffUsers - seatUsage.used} Available
                </Badge>
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {seatUsage.used} <span className="text-slate-500 text-base">/ {quotas.maxStaffUsers}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden mt-2 border border-slate-800">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${Math.min(100, staffUsagePercent)}%` }}
                />
              </div>
            </Card>

            <Card className="bg-slate-900 border-slate-800 text-white p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Create Agency Owner Admin</span>
                <p className="text-[11px] text-slate-400">
                  Add an Agency Owner or staff user to grant access to the agency ERP.
                </p>
              </div>
              <Button
                onClick={() => {
                  setNewRole("ADMIN");
                  setShowAddUserModal(true);
                }}
                variant="gold"
                size="sm"
                className="mt-3 font-bold flex items-center gap-1.5"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>+ Add Agency Owner / Staff</span>
              </Button>
            </Card>
          </div>

          {/* User Table Card */}
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-400" />
                Platform User Directory
              </CardTitle>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <div className="relative w-48 sm:w-64">
                  <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                >
                  <option value="ALL">All Roles</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN">Agency Owner (Admin)</option>
                  <option value="AGENT">Agent</option>
                  <option value="OFFICE_MANAGER">Office Manager</option>
                  <option value="CUSTOMER">Customer</option>
                </select>

                <Button
                  onClick={fetchUsers}
                  size="sm"
                  variant="outline"
                  className="text-xs border-slate-700 text-slate-300"
                  title="Refresh users"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingUsers ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role(s)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Created</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          {loadingUsers ? "Loading users..." : "No users found matching your search."}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const isSuper = user.roles.includes("SUPER_ADMIN");
                        const isAdmin = user.roles.includes("ADMIN");
                        return (
                          <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                    isSuper
                                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                      : isAdmin
                                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                      : "bg-slate-800 text-slate-300"
                                  }`}
                                >
                                  {user.firstName[0]}
                                  {user.lastName[0]}
                                </div>
                                <div>
                                  <div className="font-semibold text-white">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  {user.phone && (
                                    <div className="text-[10px] text-slate-400">{user.phone}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-300">{user.email}</td>
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-1">
                                {user.roles.map((role) => (
                                  <span
                                    key={role}
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      role === "SUPER_ADMIN"
                                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                        : role === "ADMIN"
                                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                                        : role === "AGENT"
                                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                        : "bg-slate-800 text-slate-300 border border-slate-700"
                                    }`}
                                  >
                                    {role.replace(/_/g, " ")}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  user.isActive
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                }`}
                              >
                                {user.isActive ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                <span>{user.isActive ? "Active" : "Disabled"}</span>
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                              {new Date(user.createdAt).toLocaleDateString("en-AU")}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setResetNewPass("");
                                    setShowResetPasswordModal(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                  title="Reset Password"
                                >
                                  <KeyRound className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleToggleUserActive(user)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    user.isActive
                                      ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                                      : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                  }`}
                                  title={user.isActive ? "Deactivate Account" : "Activate Account"}
                                >
                                  {user.isActive ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL: Add User / Agency Owner */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-slate-900 border-slate-800 text-white shadow-2xl animate-in fade-in zoom-in-95">
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-slate-800">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-amber-400" />
                Create Platform User / Agency Owner
              </CardTitle>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleCreateUser} className="space-y-4">
                {modalError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-xs font-semibold">
                    {modalError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      placeholder="e.g. David"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      placeholder="e.g. Sterling"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="owner@agency.com.au"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+61 400 000 000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Assigned System Role *</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="ADMIN">Agency Owner / Principal (ADMIN)</option>
                    <option value="SUPER_ADMIN">Super Administrator (SUPER_ADMIN)</option>
                    <option value="AGENT">Sales / Rental Agent (AGENT)</option>
                    <option value="OFFICE_MANAGER">Office Manager (OFFICE_MANAGER)</option>
                    <option value="MARKETING_ADMIN">Marketing Admin (MARKETING_ADMIN)</option>
                    <option value="SUPPORT">Client Support (SUPPORT)</option>
                    <option value="CUSTOMER">Client / Buyer (CUSTOMER)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Initial Password *</label>
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddUserModal(false)}
                    className="border-slate-700 text-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    size="sm"
                    disabled={creatingUser}
                    className="font-bold"
                  >
                    {creatingUser ? "Creating..." : "Create & Provision User"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL: Reset Password */}
      {showResetPasswordModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-slate-900 border-slate-800 text-white shadow-2xl">
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-slate-800">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-amber-400" />
                Reset User Password
              </CardTitle>
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <p>
                    Resetting password for:{" "}
                    <strong className="text-white">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </strong>{" "}
                    (<span className="font-mono text-[#c5a059]">{selectedUser.email}</span>)
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    New Secure Password *
                  </label>
                  <input
                    type="text"
                    required
                    minLength={6}
                    value={resetNewPass}
                    onChange={(e) => setResetNewPass(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowResetPasswordModal(false)}
                    className="border-slate-700 text-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    size="sm"
                    disabled={resettingPass}
                    className="font-bold"
                  >
                    {resettingPass ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
