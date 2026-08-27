"use client";

import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, CheckCircle2, Clock, AlertTriangle, FileText, UserCheck, Search, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_AML_VERIFICATIONS, AMLCustomerVerification, performAMLCheck } from "@/lib/aml/eidv-service";

export default function AMLVerificationPage() {
  const [verifications, setVerifications] = useState<AMLCustomerVerification[]>(MOCK_AML_VERIFICATIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);

  // New Verification Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState<AMLCustomerVerification["role"]>("BUYER");
  const [formDocType, setFormDocType] = useState<AMLCustomerVerification["idDocumentType"]>("AU_DRIVER_LICENCE");
  const [formDocNum, setFormDocNum] = useState("");

  const handleRunVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDocNum) return;

    const newRecord = performAMLCheck({
      fullName: formName,
      email: formEmail,
      phone: formPhone,
      role: formRole,
      idDocumentType: formDocType,
      documentNumber: formDocNum,
    });

    setVerifications([newRecord, ...verifications]);
    setModalOpen(false);
    setFormName("");
    setFormDocNum("");
  };

  const filtered = verifications.filter((item) => {
    if (roleFilter !== "ALL" && item.role !== roleFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.fullName.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term) ||
        item.documentNumber.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <span>AUSTRAC AML/CTF 2026 eIDV Compliance</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#0a192f] mt-1.5">
            Digital Identity &amp; AML Verification
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Statutory Document Verification Service (DVS), PEP/Sanctions screening, and client risk assessments.
          </p>
        </div>

        <Button variant="gold" onClick={() => setModalOpen(true)} className="gap-2 text-xs">
          <UserCheck className="h-4 w-4" />
          <span>New Identity Check</span>
        </Button>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card className="border border-slate-200">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Total Verified</p>
              <p className="text-2xl font-bold text-[#0a192f] mt-1">{verifications.length}</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1">100% Statutory Compliant</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Avg DVS Match</p>
              <p className="text-2xl font-bold text-[#0a192f] mt-1">98.2%</p>
              <p className="text-[10px] text-slate-500 mt-1">Services Australia Gateway</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Pending Review</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {verifications.filter(v => v.verificationStatus === "PENDING_REVIEW").length}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">FIRB &amp; Foreign Passports</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">PEP / Sanctions</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">0 Hits</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1">DFAT List Clean</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Verification Matrix Table */}
      <Card className="border border-slate-200 shadow-xs">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-base font-serif text-[#0a192f]">
            AUSTRAC Client Verification Ledger
          </CardTitle>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search name, ID, doc..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
              />
            </div>

            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Roles</option>
              <option value="BUYER">Buyers</option>
              <option value="VENDOR">Vendors</option>
              <option value="TENANT">Tenants</option>
              <option value="LANDLORD">Landlords</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 whitespace-nowrap">
                <tr>
                  <th className="py-3 px-4">Verification ID</th>
                  <th className="py-3 px-4">Customer Name &amp; Contact</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">ID Document</th>
                  <th className="py-3 px-4">DVS Match</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Audit Trail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0a192f] whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{item.fullName}</p>
                      <p className="text-[11px] text-slate-500">{item.email} • {item.phone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className="text-[10px]">
                        {item.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{item.idDocumentType.replace("_", " ")}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{item.documentNumber}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${item.dvsMatchScore > 90 ? "bg-emerald-500" : "bg-amber-500"}`}
                            style={{ width: `${item.dvsMatchScore}%` }}
                          />
                        </div>
                        <span className="font-bold font-mono">{item.dvsMatchScore}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.verificationStatus === "VERIFIED" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-[11px] font-bold border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          VERIFIED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-[11px] font-bold border border-amber-200">
                          <Clock className="h-3 w-3" />
                          PENDING REVIEW
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(item.verifiedAt).toLocaleDateString("en-AU")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* New eIDV Verification Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#0a192f]">Run AUSTRAC eIDV Verification</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
            </div>

            <form onSubmit={handleRunVerification} className="space-y-3 text-xs font-medium">
              <div className="space-y-1">
                <label htmlFor="aml-name" className="text-slate-700 font-bold">Full Legal Name *</label>
                <input
                  id="aml-name"
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Lachlan Vance"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="aml-email" className="text-slate-700 font-bold">Email</label>
                  <input
                    id="aml-email"
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="email@example.com.au"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="aml-phone" className="text-slate-700 font-bold">Mobile Phone</label>
                  <input
                    id="aml-phone"
                    type="tel"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="0400 000 000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="aml-role" className="text-slate-700 font-bold">Transaction Role</label>
                  <select
                    id="aml-role"
                    value={formRole}
                    onChange={e => setFormRole(e.target.value as AMLCustomerVerification["role"])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="BUYER">Buyer</option>
                    <option value="VENDOR">Vendor</option>
                    <option value="TENANT">Tenant</option>
                    <option value="LANDLORD">Landlord</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="aml-doctype" className="text-slate-700 font-bold">ID Type</label>
                  <select
                    id="aml-doctype"
                    value={formDocType}
                    onChange={e => setFormDocType(e.target.value as AMLCustomerVerification["idDocumentType"])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="AU_DRIVER_LICENCE">AU Driver Licence</option>
                    <option value="AU_PASSPORT">AU Passport</option>
                    <option value="MEDICARE_CARD">Medicare Card</option>
                    <option value="FOREIGN_PASSPORT">Foreign Passport</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="aml-docnum" className="text-slate-700 font-bold">Document Number *</label>
                <input
                  id="aml-docnum"
                  type="text"
                  required
                  value={formDocNum}
                  onChange={e => setFormDocNum(e.target.value)}
                  placeholder="e.g. DL-9920192"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="w-1/2">
                  Cancel
                </Button>
                <Button type="submit" variant="gold" className="w-1/2">
                  Execute eIDV Check
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
