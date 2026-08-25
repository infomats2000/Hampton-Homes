"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  KeyRound,
  Search,
  RefreshCw,
  AlertTriangle,
  X,
  Mail,
  Phone,
  Building2,
  Edit3,
  Trash2,
  Globe,
  Star,
  LayoutGrid,
  List,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OfficeItem {
  id: string;
  name: string;
  suburb: string;
  state: string;
}

interface AgentProfile {
  id: string;
  position: string;
  officeId: string;
  officeName: string;
  bio?: string | null;
  mobile?: string | null;
  isPublic: boolean;
  isFeatured: boolean;
}

interface StaffUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  roles: string[];
  primaryRole: string;
  agentProfile: AgentProfile | null;
}

interface SeatUsage {
  used: number;
  limit: number;
  available: number;
  canAdd: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [offices, setOffices] = useState<OfficeItem[]>([]);
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
  const [officeFilter, setOfficeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);

  // Form State - Add Staff
  const [addFirstName, setAddFirstName] = useState("");
  const [addLastName, setAddLastName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addMobile, setAddMobile] = useState("");
  const [addPassword, setAddPassword] = useState("StaffPass123!");
  const [addRole, setAddRole] = useState("AGENT");
  const [addPosition, setAddPosition] = useState("Sales Agent");
  const [addOfficeId, setAddOfficeId] = useState("");
  const [addBio, setAddBio] = useState("");
  const [addIsPublic, setAddIsPublic] = useState(true);
  const [addIsFeatured, setAddIsFeatured] = useState(false);
  const [addingStaff, setAddingStaff] = useState(false);
  const [addError, setAddError] = useState("");

  // Form State - Edit Staff
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [editRole, setEditRole] = useState("AGENT");
  const [editPosition, setEditPosition] = useState("");
  const [editOfficeId, setEditOfficeId] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(true);
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editIsActive, setEditIsActive] = useState(true);
  const [editingStaff, setEditingStaff] = useState(false);
  const [editError, setEditError] = useState("");

  // Reset Password
  const [resetPass, setResetPass] = useState("");
  const [resetting, setResetting] = useState(false);

  // Delete Staff
  const [deleting, setDeleting] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        if (data.offices) setOffices(data.offices);
        if (data.seatUsage) setSeatUsage(data.seatUsage);
        if (data.subscriptionTier) setSubscriptionTier(data.subscriptionTier);
        if (data.offices?.length > 0 && !addOfficeId) {
          setAddOfficeId(data.offices[0].id);
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

  const openEditModal = (user: StaffUser) => {
    setSelectedUser(user);
    setEditFirstName(user.firstName);
    setEditLastName(user.lastName);
    setEditEmail(user.email);
    setEditPhone(user.phone || "");
    setEditMobile(user.agentProfile?.mobile || "");
    setEditRole(user.primaryRole);
    setEditPosition(user.agentProfile?.position || "Sales Agent");
    setEditOfficeId(user.agentProfile?.officeId || offices[0]?.id || "");
    setEditBio(user.agentProfile?.bio || "");
    setEditIsPublic(user.agentProfile?.isPublic ?? true);
    setEditIsFeatured(user.agentProfile?.isFeatured ?? false);
    setEditIsActive(user.isActive);
    setEditError("");
    setShowEditModal(true);
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingStaff(true);
    setAddError("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: addFirstName,
          lastName: addLastName,
          email: addEmail,
          phone: addPhone,
          mobile: addMobile,
          password: addPassword,
          role: addRole,
          position: addPosition,
          officeId: addOfficeId || undefined,
          bio: addBio,
          isPublic: addIsPublic,
          isFeatured: addIsFeatured,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setAddFirstName("");
        setAddLastName("");
        setAddEmail("");
        setAddPhone("");
        setAddMobile("");
        setAddBio("");
        setAddPassword("StaffPass123!");
        fetchStaff();
      } else {
        setAddError(data.error || "Failed to create staff member");
      }
    } catch (err) {
      setAddError("Server connection error");
    } finally {
      setAddingStaff(false);
    }
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setEditingStaff(true);
    setEditError("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          firstName: editFirstName,
          lastName: editLastName,
          email: editEmail,
          phone: editPhone,
          mobile: editMobile,
          role: editRole,
          position: editPosition,
          officeId: editOfficeId || undefined,
          bio: editBio,
          isPublic: editIsPublic,
          isFeatured: editIsFeatured,
          isActive: editIsActive,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        fetchStaff();
      } else {
        setEditError(data.error || "Failed to update staff member");
      }
    } catch (err) {
      setEditError("Server connection error");
    } finally {
      setEditingStaff(false);
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
        if (data.seatUsage) setSeatUsage(data.seatUsage);
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

  const handleDeleteStaff = async () => {
    if (!selectedUser) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/users?id=${selectedUser.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setShowDeleteModal(false);
        fetchStaff();
      } else {
        alert(data.error || "Failed to delete staff member");
      }
    } catch (err) {
      alert("Server connection error");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      (u.agentProfile?.position && u.agentProfile.position.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === "ALL" || u.roles.includes(roleFilter);
    const matchesOffice = officeFilter === "ALL" || u.agentProfile?.officeId === officeFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && u.isActive) ||
      (statusFilter === "DISABLED" && !u.isActive);

    return matchesSearch && matchesRole && matchesOffice && matchesStatus;
  });

  const usagePercent = Math.min(100, Math.round((seatUsage.used / Math.max(1, seatUsage.limit)) * 100));

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="h-7 w-7 text-[#c5a059]" />
            <span>Staff &amp; Team Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage agents, principals, property managers, team roles, contact numbers, and login quotas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              if (seatUsage.canAdd) {
                setAddError("");
                setShowAddModal(true);
              }
            }}
            disabled={!seatUsage.canAdd}
            variant="gold"
            className="font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Add New Team Member</span>
          </Button>
        </div>
      </div>

      {/* Staff Seat Quota Bar Card */}
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0a192f] text-[#c5a059] flex items-center justify-center font-bold shadow-xs">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-slate-900 text-lg">Staff Seat Allocation</h3>
                  <Badge variant="outline" className="text-[11px] font-semibold text-slate-700 bg-slate-50">
                    {subscriptionTier.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  {seatUsage.used} of {seatUsage.limit} staff seats currently allocated ({seatUsage.available} available seats remaining).
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
                <strong>Staff Seat Limit Reached!</strong> All {seatUsage.limit} staff seats allowed under your current plan are in use. Contact your SaaS administrator to upgrade your subscription tier and unlock additional agent logins.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter and View Controls */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search team by name, email, or position..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Agency Owner</option>
                <option value="AGENT">Sales Agent</option>
                <option value="OFFICE_MANAGER">Office Manager</option>
                <option value="MARKETING_ADMIN">Marketing Admin</option>
                <option value="SUPPORT">Support</option>
              </select>

              {offices.length > 0 && (
                <select
                  value={officeFilter}
                  onChange={(e) => setOfficeFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
                >
                  <option value="ALL">All Offices</option>
                  {offices.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name}
                    </option>
                  ))}
                </select>
              )}

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active Only</option>
                <option value="DISABLED">Disabled Only</option>
              </select>

              {/* View Mode Switcher */}
              <div className="flex border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-white shadow-xs text-slate-900" : "text-slate-400 hover:text-slate-700"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "table" ? "bg-white shadow-xs text-slate-900" : "text-slate-400 hover:text-slate-700"
                  }`}
                  title="Table View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

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
          </div>
        </CardContent>
      </Card>

      {/* Staff Roster: GRID VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              <Users className="h-10 w-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-sm text-slate-700">No staff members found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or filters.</p>
            </div>
          ) : (
            filtered.map((user) => {
              const isOwner = user.roles.includes("ADMIN");
              const position = user.agentProfile?.position || (isOwner ? "Agency Principal" : "Sales Agent");
              const office = user.agentProfile?.officeName || "Main Office";

              return (
                <Card
                  key={user.id}
                  className={`bg-white border transition-all hover:shadow-md flex flex-col justify-between ${
                    user.isActive ? "border-slate-200" : "border-rose-200 bg-rose-50/20"
                  }`}
                >
                  <CardContent className="p-5 space-y-4">
                    {/* Header: Avatar, Name, Role Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs ${
                            isOwner
                              ? "bg-[#0a192f] text-[#c5a059]"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-slate-900 text-base leading-tight">
                            {user.firstName} {user.lastName}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">{position}</p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                            <Building2 className="h-3 w-3 text-slate-400" />
                            <span>{office}</span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {user.isActive ? "Active" : "Disabled"}
                      </span>
                    </div>

                    {/* Role & Public Roster Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
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

                      {user.agentProfile?.isPublic && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                          <Globe className="h-2.5 w-2.5" />
                          <span>Website Agent</span>
                        </span>
                      )}

                      {user.agentProfile?.isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono truncate">{user.email}</span>
                      </div>
                      {(user.phone || user.agentProfile?.mobile) && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{user.phone || user.agentProfile?.mobile}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  {/* Actions Footer */}
                  <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 transition-all text-xs font-semibold flex items-center gap-1"
                        title="Edit Staff Member"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setResetPass("");
                          setShowResetModal(true);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 transition-all text-xs font-semibold flex items-center gap-1"
                        title="Reset Password"
                      >
                        <KeyRound className="h-3.5 w-3.5 text-slate-500" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleActive(user)}
                        className={`p-1.5 rounded-lg border transition-all text-xs font-semibold ${
                          user.isActive
                            ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        }`}
                        title={user.isActive ? "Deactivate Account" : "Activate Account"}
                      >
                        {user.isActive ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-all"
                        title="Delete Staff Member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Staff Roster: TABLE VIEW */}
      {viewMode === "table" && (
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 text-slate-500 bg-slate-50/60">
                  <tr>
                    <th className="py-3.5 px-6 font-semibold">Staff Member</th>
                    <th className="py-3.5 px-6 font-semibold">Email &amp; Phone</th>
                    <th className="py-3.5 px-6 font-semibold">Position &amp; Office</th>
                    <th className="py-3.5 px-6 font-semibold">Role</th>
                    <th className="py-3.5 px-6 font-semibold">Status</th>
                    <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No staff members found matching filters.
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
                                {user.agentProfile?.isPublic && (
                                  <span className="text-[10px] text-purple-600 font-medium">● Public Website</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-6">
                            <div className="font-mono text-slate-800">{user.email}</div>
                            <div className="text-[11px] text-slate-500">{user.phone || user.agentProfile?.mobile || "—"}</div>
                          </td>
                          <td className="py-3.5 px-6">
                            <div className="font-semibold text-slate-900">
                              {user.agentProfile?.position || "Sales Representative"}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              <span>{user.agentProfile?.officeName || "Main Office"}</span>
                            </div>
                          </td>
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
                          <td className="py-3.5 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditModal(user)}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                                title="Edit Details"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
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
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowDeleteModal(true);
                                }}
                                className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Delete Account"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
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
      )}

      {/* MODAL: ADD NEW STAFF MEMBER */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <Card className="max-w-lg w-full bg-white border-slate-200 text-slate-900 shadow-2xl animate-in fade-in zoom-in-95 my-8">
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-slate-100">
              <CardTitle className="text-base font-serif flex items-center gap-2 text-slate-900">
                <UserPlus className="h-4 w-4 text-[#c5a059]" />
                Add New Staff Member
              </CardTitle>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="pt-4 max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleCreateStaff} className="space-y-4">
                {addError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold">
                    {addError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={addFirstName}
                      onChange={(e) => setAddFirstName(e.target.value)}
                      placeholder="e.g. Marcus"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={addLastName}
                      onChange={(e) => setAddLastName(e.target.value)}
                      placeholder="e.g. Vance"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    placeholder="marcus.vance@agency.com.au"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Office Phone</label>
                    <input
                      type="tel"
                      value={addPhone}
                      onChange={(e) => setAddPhone(e.target.value)}
                      placeholder="(02) 9000 0000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile</label>
                    <input
                      type="tel"
                      value={addMobile}
                      onChange={(e) => setAddMobile(e.target.value)}
                      placeholder="0412 345 678"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Team Role *</label>
                    <select
                      value={addRole}
                      onChange={(e) => setAddRole(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    >
                      <option value="AGENT">Sales / Rental Agent</option>
                      <option value="OFFICE_MANAGER">Office Manager</option>
                      <option value="MARKETING_ADMIN">Marketing Admin</option>
                      <option value="SUPPORT">Support Specialist</option>
                      <option value="ADMIN">Agency Owner / Principal</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Job Title / Position</label>
                    <input
                      type="text"
                      value={addPosition}
                      onChange={(e) => setAddPosition(e.target.value)}
                      placeholder="e.g. Senior Partner"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>

                {offices.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Assigned Branch Office</label>
                    <select
                      value={addOfficeId}
                      onChange={(e) => setAddOfficeId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    >
                      {offices.map((off) => (
                        <option key={off.id} value={off.id}>
                          {off.name} ({off.suburb}, {off.state})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Agent Bio / Summary</label>
                  <textarea
                    rows={3}
                    value={addBio}
                    onChange={(e) => setAddBio(e.target.value)}
                    placeholder="Short biography for public profile..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-semibold">
                    <input
                      type="checkbox"
                      checked={addIsPublic}
                      onChange={(e) => setAddIsPublic(e.target.checked)}
                      className="rounded border-slate-300 text-[#0a192f] focus:ring-[#0a192f]"
                    />
                    <span>Show on Public Website</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-semibold">
                    <input
                      type="checkbox"
                      checked={addIsFeatured}
                      onChange={(e) => setAddIsFeatured(e.target.checked)}
                      className="rounded border-slate-300 text-[#0a192f] focus:ring-[#0a192f]"
                    />
                    <span>Featured Agent</span>
                  </label>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Initial Password *</label>
                  <input
                    type="text"
                    required
                    value={addPassword}
                    onChange={(e) => setAddPassword(e.target.value)}
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
                    disabled={addingStaff}
                    className="font-bold"
                  >
                    {addingStaff ? "Adding..." : "Add Staff Member"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL: EDIT STAFF MEMBER */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <Card className="max-w-lg w-full bg-white border-slate-200 text-slate-900 shadow-2xl animate-in fade-in zoom-in-95 my-8">
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-slate-100">
              <CardTitle className="text-base font-serif flex items-center gap-2 text-slate-900">
                <Edit3 className="h-4 w-4 text-[#c5a059]" />
                Edit Staff Member: {selectedUser.firstName} {selectedUser.lastName}
              </CardTitle>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="pt-4 max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleUpdateStaff} className="space-y-4">
                {editError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold">
                    {editError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Office Phone</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile</label>
                    <input
                      type="tel"
                      value={editMobile}
                      onChange={(e) => setEditMobile(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">System Role *</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    >
                      <option value="AGENT">Sales / Rental Agent</option>
                      <option value="OFFICE_MANAGER">Office Manager</option>
                      <option value="MARKETING_ADMIN">Marketing Admin</option>
                      <option value="SUPPORT">Support Specialist</option>
                      <option value="ADMIN">Agency Owner / Principal</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Job Title / Position</label>
                    <input
                      type="text"
                      value={editPosition}
                      onChange={(e) => setEditPosition(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>

                {offices.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Branch Office</label>
                    <select
                      value={editOfficeId}
                      onChange={(e) => setEditOfficeId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                    >
                      {offices.map((off) => (
                        <option key={off.id} value={off.id}>
                          {off.name} ({off.suburb}, {off.state})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Agent Bio</label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-semibold">
                    <input
                      type="checkbox"
                      checked={editIsPublic}
                      onChange={(e) => setEditIsPublic(e.target.checked)}
                      className="rounded border-slate-300 text-[#0a192f]"
                    />
                    <span>Show on Public Website</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-semibold">
                    <input
                      type="checkbox"
                      checked={editIsFeatured}
                      onChange={(e) => setEditIsFeatured(e.target.checked)}
                      className="rounded border-slate-300 text-[#0a192f]"
                    />
                    <span>Featured Agent</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-semibold">
                    <input
                      type="checkbox"
                      checked={editIsActive}
                      onChange={(e) => setEditIsActive(e.target.checked)}
                      className="rounded border-slate-300 text-[#0a192f]"
                    />
                    <span>Account Active</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditModal(false)}
                    className="border-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    size="sm"
                    disabled={editingStaff}
                    className="font-bold"
                  >
                    {editingStaff ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL: RESET PASSWORD */}
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
                    Resetting login credentials for:{" "}
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
                    {resetting ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL: DELETE STAFF CONFIRMATION */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white border-slate-200 text-slate-900 shadow-2xl">
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-slate-100">
              <CardTitle className="text-base font-serif flex items-center gap-2 text-rose-600">
                <Trash2 className="h-4 w-4" />
                Delete Staff Member
              </CardTitle>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </strong>{" "}
                  ({selectedUser.email})?
                </p>
                <p className="mt-2 text-[11px] text-rose-700">
                  This will remove their agent profile, access credentials, and return <strong>1 staff seat</strong> back to your subscription quota.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteModal(false)}
                  className="border-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDeleteStaff}
                  disabled={deleting}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  {deleting ? "Deleting..." : "Permanently Delete Staff"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
