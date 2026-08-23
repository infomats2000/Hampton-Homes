"use client";

import React, { useState } from "react";
import {
  FileSignature,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  Eye,
  Send,
  XCircle,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  FileText,
  Home,
  Key,
} from "lucide-react";

type DocStatus = "DRAFT" | "SENT" | "VIEWED" | "SIGNED" | "COMPLETED" | "DECLINED" | "EXPIRED";
type DocType = "SALE_CONTRACT" | "TENANCY_AGREEMENT" | "LEASE_RENEWAL" | "MANAGEMENT_AGREEMENT" | "OTHER";

interface Document {
  id: string;
  type: DocType;
  title: string;
  status: DocStatus;
  signerName: string;
  signerEmail: string;
  propertyAddress?: string;
  agentName?: string;
  sentAt?: string;
  signedAt?: string;
  completedAt?: string;
  expiresAt?: string;
  flkId?: string;
}

const DEMO_DOCUMENTS: Document[] = [
  { id: "1", type: "SALE_CONTRACT", title: "Contract of Sale — 42 Harbour View Drive", status: "SIGNED", signerName: "James Carrington", signerEmail: "james.c@gmail.com", propertyAddress: "42 Harbour View Drive, Mosman NSW 2088", agentName: "Sarah Johnson", sentAt: "2026-08-18", signedAt: "2026-08-20", flkId: "flk_doc_001" },
  { id: "2", type: "TENANCY_AGREEMENT", title: "Residential Tenancy Agreement — 7/15 Neutral Bay Ave", status: "COMPLETED", signerName: "Liam Chen", signerEmail: "liam.c@example.com", propertyAddress: "7/15 Neutral Bay Avenue, Neutral Bay NSW 2089", agentName: "Mike Williams", sentAt: "2026-08-10", completedAt: "2026-08-12", flkId: "flk_doc_002" },
  { id: "3", type: "SALE_CONTRACT", title: "Contract of Sale — 88 Cremorne Road", status: "VIEWED", signerName: "Sophia Williams", signerEmail: "sophia.w@outlook.com", propertyAddress: "88 Cremorne Road, Cremorne NSW 2090", agentName: "Sarah Johnson", sentAt: "2026-08-21", flkId: "flk_doc_003" },
  { id: "4", type: "LEASE_RENEWAL", title: "Lease Renewal — 3/22 Kirribilli Ave", status: "SENT", signerName: "Emma Davies", signerEmail: "emma.d@company.com", propertyAddress: "3/22 Kirribilli Avenue, Kirribilli NSW 2061", agentName: "Tom Lee", sentAt: "2026-08-22", expiresAt: "2026-09-05", flkId: "flk_doc_004" },
  { id: "5", type: "MANAGEMENT_AGREEMENT", title: "Property Management Agreement — 15 Manly Rd", status: "DRAFT", signerName: "Noah Thompson", signerEmail: "noah.t@icloud.com", propertyAddress: "15 Manly Road, Manly NSW 2095", agentName: "Sarah Johnson" },
  { id: "6", type: "TENANCY_AGREEMENT", title: "Residential Tenancy — 9 Balmain Street", status: "DECLINED", signerName: "Ava Brown", signerEmail: "ava.b@email.com", propertyAddress: "9 Balmain Street, Balmain NSW 2041", agentName: "Mike Williams", sentAt: "2026-08-15", flkId: "flk_doc_006" },
];

const STATUS_CONFIG: Record<DocStatus, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  DRAFT: { label: "Draft", icon: FileText, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" },
  SENT: { label: "Sent", icon: Send, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  VIEWED: { label: "Viewed", icon: Eye, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  SIGNED: { label: "Signed", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  COMPLETED: { label: "Completed", icon: CheckCircle2, color: "text-[#c5a059]", bg: "bg-[#c5a059]/10", border: "border-[#c5a059]/20" },
  DECLINED: { label: "Declined", icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  EXPIRED: { label: "Expired", icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
};

const DOC_TYPE_CONFIG: Record<DocType, { label: string; icon: React.ElementType }> = {
  SALE_CONTRACT: { label: "Sale Contract", icon: Home },
  TENANCY_AGREEMENT: { label: "Tenancy Agreement", icon: Key },
  LEASE_RENEWAL: { label: "Lease Renewal", icon: Key },
  MANAGEMENT_AGREEMENT: { label: "Management Agreement", icon: FileText },
  OTHER: { label: "Other", icon: FileText },
};

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | DocStatus>("ALL");
  const [showModal, setShowModal] = useState(false);

  const filtered = DEMO_DOCUMENTS.filter((doc) => {
    const searchOk =
      !search ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.signerName.toLowerCase().includes(search.toLowerCase()) ||
      doc.propertyAddress?.toLowerCase().includes(search.toLowerCase());
    const statusOk = statusFilter === "ALL" || doc.status === statusFilter;
    return searchOk && statusOk;
  });

  const byStatus = (status: DocStatus) => DEMO_DOCUMENTS.filter((d) => d.status === status).length;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center">
              <FileSignature className="h-5 w-5 text-[#c5a059]" />
            </div>
            <h1 className="text-2xl font-bold text-white">Digital Documents</h1>
          </div>
          <p className="text-slate-400 text-sm">
            FLK it over digital agreements, leasing contracts & e-signatures
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#c5a059] hover:bg-[#b8923f] text-slate-900 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Document
        </button>
      </div>

      {/* Status Pipeline */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {(Object.entries(STATUS_CONFIG) as [DocStatus, typeof STATUS_CONFIG[DocStatus]][]).map(([status, cfg]) => {
          const Icon = cfg.icon;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? "ALL" : status)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                statusFilter === status
                  ? `${cfg.bg} ${cfg.border} border`
                  : "bg-[#0d2444]/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <Icon className={`h-4 w-4 ${cfg.color}`} />
              <span className="text-lg font-bold text-white">{byStatus(status)}</span>
              <span className={`text-[10px] font-medium ${cfg.color}`}>{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by document title, signer name, or property address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#0d2444]/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#c5a059]/50"
        />
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filtered.map((doc) => {
          const statusCfg = STATUS_CONFIG[doc.status];
          const docTypeCfg = DOC_TYPE_CONFIG[doc.type];
          const StatusIcon = statusCfg.icon;
          const DocTypeIcon = docTypeCfg.icon;

          return (
            <div
              key={doc.id}
              className="bg-[#0d2444]/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Doc Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <DocTypeIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white text-sm truncate">{doc.title}</h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.color}`}
                      >
                        <StatusIcon className="h-2.5 w-2.5" />
                        {statusCfg.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-400">
                      <span>{docTypeCfg.label}</span>
                      <span>Signer: <span className="text-white">{doc.signerName}</span></span>
                      {doc.propertyAddress && <span className="truncate max-w-xs">{doc.propertyAddress}</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] text-slate-500">
                      {doc.sentAt && <span>Sent: {doc.sentAt}</span>}
                      {doc.signedAt && <span>Signed: {doc.signedAt}</span>}
                      {doc.completedAt && <span>Completed: {doc.completedAt}</span>}
                      {doc.expiresAt && <span className="text-amber-500">Expires: {doc.expiresAt}</span>}
                      {doc.agentName && <span>Agent: {doc.agentName}</span>}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {doc.flkId && (
                    <a
                      href={`https://app.flkitover.com/documents/${doc.flkId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-xs font-medium hover:bg-indigo-500/20 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View in FLK
                    </a>
                  )}
                  {doc.status === "DRAFT" && (
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/20 transition-colors">
                      <Send className="h-3.5 w-3.5" />
                      Send
                    </button>
                  )}
                  {(doc.status === "SENT" || doc.status === "VIEWED") && (
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors">
                      <Send className="h-3.5 w-3.5" />
                      Resend
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <FileSignature className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No documents found</p>
          </div>
        )}
      </div>

      {/* FLK Connect CTA */}
      <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-900/10 border border-indigo-500/20 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white">Connect FLK it over</h3>
          <p className="text-sm text-slate-400 mt-1">
            Link your FLK account to send real agreements, track signing status live, and receive webhook notifications.
          </p>
        </div>
        <a
          href="/admin/integrations/flk"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
        >
          Configure FLK
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
