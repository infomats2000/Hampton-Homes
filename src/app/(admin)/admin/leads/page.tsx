"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Filter, Search, Plus, ArrowRight, Phone, Mail, Clock, CheckCircle2, UserCheck, ShieldCheck, MessageSquare, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MOCK_AGENTS } from "@/lib/properties/service";
import { AGENCY_NAME } from "@/lib/agency-config";

export interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  leadType: "PROPERTY_ENQUIRY" | "APPRAISAL" | "BUYER" | "SELLER" | "TENANT" | "LANDLORD" | "INSPECTION";
  status: "NEW" | "ASSIGNED" | "CONTACTED" | "QUALIFIED" | "APPOINTMENT_BOOKED" | "APPRAISAL_COMPLETED" | "WON" | "LOST";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  propertyAddress?: string;
  assignedAgentName: string;
  officeName: string;
  createdAt: string;
  lastContactedAt?: string;
  notes?: string;
}

export const MOCK_LEADS: LeadItem[] = [
  {
    id: "lead-1001",
    name: "David Miller",
    email: "david.miller@example.com.au",
    phone: "0411 222 333",
    leadType: "PROPERTY_ENQUIRY",
    status: "NEW",
    priority: "HIGH",
    propertyAddress: "142 Church Street, Parramatta NSW",
    assignedAgentName: "Marcus Vance",
    officeName: `${AGENCY_NAME} Parramatta`,
    createdAt: "2026-08-22 19:30",
    notes: "Enquired about inspection times and contract for Parramatta residence.",
  },
  {
    id: "lead-1002",
    name: "Sophie Zhang",
    email: "sophie.zhang@example.com.au",
    phone: "0422 333 444",
    leadType: "APPRAISAL",
    status: "ASSIGNED",
    priority: "URGENT",
    propertyAddress: "88 Ocean Drive, Bondi Beach NSW",
    assignedAgentName: "Elena Rostova",
    officeName: `${AGENCY_NAME} Eastern Suburbs`,
    createdAt: "2026-08-22 16:15",
    notes: "Requested sales appraisal. Planning to sell within 3 months.",
  },
  {
    id: "lead-1003",
    name: "Robert Taylor",
    email: "robert.t@example.com.au",
    phone: "0433 444 555",
    leadType: "TENANT",
    status: "CONTACTED",
    priority: "MEDIUM",
    propertyAddress: "27 Raglan Street, Manly NSW",
    assignedAgentName: "Oliver Sterling",
    officeName: `${AGENCY_NAME} Manly`,
    createdAt: "2026-08-21 14:00",
    notes: "Submitted rental application for Manly residence.",
  },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>(MOCK_LEADS);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredLeads = leads.filter((l) => {
    if (searchTerm && !l.name.toLowerCase().includes(searchTerm.toLowerCase()) && !l.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter && l.status !== statusFilter) return false;
    return true;
  });

  const updateLeadStatus = (leadId: string, newStatus: LeadItem["status"]) => {
    setLeads(leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
    if (selectedLead?.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
              Lead Management & Pipeline
            </h1>
            <Badge variant="gold">Section 32 Compliant</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track customer enquiries, sales appraisals, lead assignments, and CRM pipeline activity.
          </p>
        </div>

        <Link href="/admin/appraisals">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <UserCheck className="h-3.5 w-3.5" />
            <span>Appraisal Requests</span>
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search lead name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
              >
                <option value="">All Pipeline Statuses</option>
                <option value="NEW">New Lead</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="WON">Won / Closed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Leads Table vs Lead Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Lead Pipeline Table</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">
                    <tr>
                      <th className="py-3 px-4">Lead Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Assigned Agent</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredLeads.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedLead(item)}
                        className={`cursor-pointer transition-colors ${
                          selectedLead?.id === item.id ? "bg-slate-100/80 font-bold" : "hover:bg-slate-50/80"
                        }`}
                      >
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-[11px] text-slate-500">{item.email}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-700">{item.leadType}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={item.status === "NEW" ? "warning" : item.status === "WON" ? "success" : "sale"}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-bold ${
                              item.priority === "URGENT" ? "text-rose-600" : item.priority === "HIGH" ? "text-amber-600" : "text-slate-600"
                            }`}
                          >
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-800">{item.assignedAgentName}</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" className="text-xs">
                            Details →
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lead Activity & Detail Panel */}
        <div className="space-y-6">
          {selectedLead ? (
            <Card className="sticky top-24 border-l-4 border-l-[#c5a059]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="gold">{selectedLead.leadType}</Badge>
                  <span className="text-[11px] text-slate-400 font-mono">ID: {selectedLead.id}</span>
                </div>
                <CardTitle className="text-xl text-[#0a192f] mt-1">{selectedLead.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs font-medium">
                <div className="space-y-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="flex items-center gap-2 text-slate-800">
                    <Mail className="h-4 w-4 text-[#c5a059]" />
                    <span>{selectedLead.email}</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-800">
                    <Phone className="h-4 w-4 text-[#c5a059]" />
                    <span>{selectedLead.phone}</span>
                  </p>
                  {selectedLead.propertyAddress && (
                    <p className="flex items-center gap-2 text-slate-800 font-semibold pt-1 border-t border-slate-200">
                      <Tag className="h-4 w-4 text-[#c5a059]" />
                      <span>{selectedLead.propertyAddress}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Update Pipeline Status</label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value as LeadItem["status"])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="NEW">New Lead</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="QUALIFIED">Qualified</option>
                    <option value="WON">Won / Closed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Assigned Agent</label>
                  <p className="p-2.5 rounded-lg bg-white border border-slate-200 font-bold text-slate-900">
                    {selectedLead.assignedAgentName} ({selectedLead.officeName})
                  </p>
                </div>

                {/* Activity Timeline (Section 35 of Prompt) */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-900 block text-xs">Activity Timeline</span>
                  <div className="space-y-2 text-[11px]">
                    <div className="p-2 rounded bg-slate-50 border border-slate-100 space-y-0.5">
                      <p className="font-bold text-slate-800">Lead Created from Website Enquiry</p>
                      <p className="text-slate-500">{selectedLead.createdAt}</p>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-100 space-y-0.5">
                      <p className="font-bold text-slate-800">Auto-Assigned to {selectedLead.assignedAgentName}</p>
                      <p className="text-slate-500">{selectedLead.createdAt}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center text-slate-500 text-xs">
              Select a lead row from the pipeline table to manage status and view activity history.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
