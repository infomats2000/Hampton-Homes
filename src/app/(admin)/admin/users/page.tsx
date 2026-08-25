"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  KeyRound,
  ShieldCheck,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  X,
  Mail,
  Phone,
  Sparkles,
  Layers,
  Lock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StaffUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  roles: string[];
  isAgent: boolean;
}

interface SeatUsage {
  used: number;
  limit: number;
  available: number;
  canAdd: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [seatUsage, setSeatUsage] = useState<SeatUsage>({
    used: 0,
    limit: 10,
    available: 10,
    canAdd: true,
  });
  const [subscriptionTier, setSubscriptionTier] = useState("GOLD_ENTERPRISE");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("StaffPass123!");
  const [role, setRole] = useState("AGENT");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Reset password
  const [resetPass, setResetPass] = useState("");
  const [resetting, setResetting] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        if (data.seatUsage) {
          setSeatUsage(data.seatUsage);
        }
        if (data.subscriptionTier) {
          setSubscriptionTier(data.subscriptionTier);
        }
      }
    } catch (err) {
      console.error("Failed to load staff:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password,
          role,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setPassword("StaffPass123!");
        fetchStaff();
      } else {
        setFormError(data.error || "Failed to create staff member");
      }
    } catch (err) {
      setFormError("Server connection error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (user: StaffUser) => {
    try {
      const res = await fetch("/api/admin/users", {
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
        alert(data.error || "Failed to update staff status");
      }
    } catch (err) {
      alert("Server connection error");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !resetPass) return;
    setResetting(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          newPassword: resetPass,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Password for ${selectedUser.email} was updated successfully.`);
        setShowResetModal(false);
        setResetPass("");
      } else {
        alert(data.error || "Failed to reset password");
      }
    } catch (err) {
      alert("Server connection error");
    } finally {
      setResetting(false);
    }
  };

  const filtered = users.filter((u) => {
    const matches =
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase());
    if (roleFilter === "ALL") return matches;
    return matches && u.roles.includes(roleFilter);
  });

  const usagePercent = Math.min(100, Math.round((seatUsage.used / Math.max(1, seatUsage.limit)) * 100));

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Agency Staff &amp; User Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your internal team, assign roles, and manage login seats under your subscription plan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              if (seatUsage.canAdd) {
                setShowAddModal(true);
              }
            }}
            disabled={!seatUsage.canAdd}
            variant="gold"
            className="font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Add New Staff</span>
          </Button>
        </div>
      </div>

      {/* Seat Quota Status Card */}
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0a192f] text-[#c5a059] flex items-center justify-center font-bold">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-slate-900 text-lg">Staff Seat Allocation</h3>
                  <Badge variant="outline" className="text-[11px] font-semibold text-slate-700 bg-slate-50">
                    Plan: {subscriptionTier.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  {seatUsage.used} of {seatUsage.limit} staff seats currently allocated ({seatUsage.available} seats remaining).
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-slate-900">
                {seatUsage.used} <span className="text-slate-400 text-base">/ {seatUsage.limit} Seats</span>
              </span>
            </div>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <div
              className={`h-full transition-all ${
                usagePercent >= 100
                  ? "bg-rose-500"
                  : usagePercent >= 80
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${Math.max(5, usagePercent)}%` }}
            />
          </div>

          {!seatUsage.canAdd && (
            <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Staff Seat Limit Reached!</strong> You have reached the maximum allowed staff logins ({seatUsage.limit} seats) for your current subscription tier. To add more agents or managers, please contact your SaaS platform administrator to upgrade your plan.
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Staff Directory Table */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
          <CardTitle className="text-base font-serif flex items-center gap-2 text-slate-900">
            <Users className="h-4 w-4 text-[#c5a059]" />
            Active Team Directory
          </CardTitle>

          <div className="flex items-center gap-3">
            <div className="relative w-48 sm:w-64">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-[#0a192f]"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Agency Owner</option>
              <option value="AGENT">Sales Agent</option>
              <option value="OFFICE_MANAGER">Office Manager</option>
              <option value="MARKETING_ADMIN">Marketing Admin</option>
              <option value="SUPPORT">Support</option>
            </select>

            <Button
              onClick={fetchStaff}
              size="sm"
              variant="outline"
              className="text-xs border-slate-200 text-slate-600"
              title="Refresh staff"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-500 bg-slate-50/50">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Staff Member</th>
                  <th className="py-3.5 px-6 font-semibold">Email</th>
                  <th className="py-3.5 px-6 font-semibold">Role</th>
                  <th className="py-3.5 px-6 font-semibold">Status</th>
                  <th className="py-3.5 px-6 font-semibold">Created</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      {loading ? "Loading staff members..." : "No staff members found."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => {
                    const isOwner = user.roles.includes("ADMIN");
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                                isOwner
                                  ? "bg-[#0a192f] text-[#c5a059]"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">
                                {user.firstName} {user.lastName}
                              </div>
                              {user.phone && <div className="text-[10px] text-slate-500">{user.phone}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 font-mono text-slate-600">{user.email}</td>
                        <td className="py-3.5 px-6">
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((r) => (
                              <span
                                key={r}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  r === "ADMIN"
                                    ? "bg-blue-50 text-blue-800 border border-blue-200"
                                    : r === "AGENT"
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                }`}
                              >
                                {r.replace(/_/g, " ")}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-6">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              user.isActive
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {user.isActive ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-slate-500 text-[11px]">
                          {new Date(user.createdAt).toLocaleDateString("en-AU")}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setResetPass("");
                                setShowResetModal(true);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                              title="Reset Password"
                            >
                              <KeyRound className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleActive(user)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                user.isActive
                                  ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                                  : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
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

      {/* MODAL: Add New Staff Member */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white border-slate-200 text-slate-900 shadow-2xl animate-in fade-in zoom-in-95">
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-slate-100">
              <CardTitle className="text-base font-serif flex items-center gap-2 text-slate-900">
                <UserPlus className="h-4 w-4 text-[#c5a059]" />
                Add New Team Member
              </CardTitle>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleCreateStaff} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Sarah"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Jenkins"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.jenkins@agency.com.au"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+61 400 123 456"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Team Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  >
                    <option value="AGENT">Sales / Rental Agent (AGENT)</option>
                    <option value="OFFICE_MANAGER">Office Manager (OFFICE_MANAGER)</option>
                    <option value="MARKETING_ADMIN">Marketing Administrator (MARKETING_ADMIN)</option>
                    <option value="SUPPORT">Administrative Support (SUPPORT)</option>
                    <option value="ADMIN">Agency Owner / Principal (ADMIN)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Initial Password *</label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                    className="border-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    size="sm"
                    disabled={submitting}
                    className="font-bold"
                  >
                    {submitting ? "Adding..." : "Add Staff Member"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL: Reset Password */}
      {showResetModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white border-slate-200 text-slate-900 shadow-2xl">
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-slate-100">
              <CardTitle className="text-base font-serif flex items-center gap-2 text-slate-900">
                <KeyRound className="h-4 w-4 text-[#c5a059]" />
                Reset Staff Password
              </CardTitle>
              <button
                onClick={() => setShowResetModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
                  <p>
                    Resetting password for:{" "}
                    <strong>
                      {selectedUser.firstName} {selectedUser.lastName}
                    </strong>{" "}
                    (<span className="font-mono text-[#0a192f]">{selectedUser.email}</span>)
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    New Temporary Password *
                  </label>
                  <input
                    type="text"
                    required
                    minLength={6}
                    value={resetPass}
                    onChange={(e) => setResetPass(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowResetModal(false)}
                    className="border-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    size="sm"
                    disabled={resetting}
                    className="font-bold"
                  >
                    {resetting ? "Updating..." : "Reset Password"}
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
