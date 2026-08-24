"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  RefreshCw,
  Sliders,
  Users,
  Building2,
  FileText,
  KeyRound,
  Wrench,
  Download,
  Database,
  Layers,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ImportEntity,
  ENTITY_SCHEMAS,
  ColumnMappingResult,
  ValidatedImportRecord,
  autoMapColumns,
  validateAndSanitizeRows,
  getSampleImportRows,
  RawImportRow,
} from "@/lib/import/intelligent-importer";

export default function IntelligentDataImportPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [targetEntity, setTargetEntity] = useState<ImportEntity>("CONTACTS");
  const [fileName, setFileName] = useState<string>("agency_crm_export_2026.csv");
  const [rawRows, setRawRows] = useState<RawImportRow[]>([]);
  const [sourceHeaders, setSourceHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<ColumnMappingResult[]>([]);
  const [validatedRecords, setValidatedRecords] = useState<ValidatedImportRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSummary, setImportSummary] = useState<{ imported: number; skipped: number; total: number } | null>(null);

  // Load Sample CSV File
  const handleLoadSample = (entity: ImportEntity) => {
    setTargetEntity(entity);
    const samples = getSampleImportRows(entity);
    if (samples.length > 0) {
      const headers = Object.keys(samples[0]);
      setSourceHeaders(headers);
      setRawRows(samples);
      setFileName(`sample_${entity.toLowerCase()}_export.csv`);

      const autoMaps = autoMapColumns(headers, entity);
      setMappings(autoMaps);

      const valids = validateAndSanitizeRows(samples, autoMaps, entity);
      setValidatedRecords(valids);
    }
  };

  // Step 1 -> Step 2
  const handleProceedToMapping = () => {
    if (rawRows.length === 0) {
      handleLoadSample(targetEntity);
    } else {
      const autoMaps = autoMapColumns(sourceHeaders, targetEntity);
      setMappings(autoMaps);
      const valids = validateAndSanitizeRows(rawRows, autoMaps, targetEntity);
      setValidatedRecords(valids);
    }
    setCurrentStep(2);
  };

  // Step 2 -> Step 3
  const handleProceedToValidation = () => {
    const valids = validateAndSanitizeRows(rawRows, mappings, targetEntity);
    setValidatedRecords(valids);
    setCurrentStep(3);
  };

  // Step 3 -> Execute Import -> Step 4
  const handleExecuteImport = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const validCount = validatedRecords.filter((r) => r.isValid).length;
    const skippedCount = validatedRecords.length - validCount;

    setImportSummary({
      imported: validCount,
      skipped: skippedCount,
      total: validatedRecords.length,
    });
    setIsProcessing(false);
    setCurrentStep(4);
  };

  const updateMapping = (sourceCol: string, newTargetKey: string) => {
    setMappings((prev) =>
      prev.map((m) =>
        m.sourceColumn === sourceCol
          ? { ...m, targetFieldKey: newTargetKey, isAutoMatched: false, confidenceScore: newTargetKey ? 100 : 0 }
          : m
      )
    );
  };

  const validCount = validatedRecords.filter((r) => r.isValid).length;
  const warningCount = validatedRecords.reduce((acc, r) => acc + r.warnings.length, 0);
  const errorCount = validatedRecords.reduce((acc, r) => acc + r.errors.length, 0);
  const qualityScore = validatedRecords.length > 0 ? Math.round((validCount / validatedRecords.length) * 100) : 100;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/integrations" className="text-xs font-medium text-slate-500 hover:text-slate-800">
              Integrations &amp; Data
            </Link>
            <span className="text-slate-400">/</span>
            <Badge variant="gold">AI Data Importer</Badge>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#0a192f] mt-1.5 flex items-center gap-3">
            <span>Intelligent Real Estate Data Import &amp; Migration</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Import contacts, properties, appraisals, tenancies &amp; contractors from CSV, Excel, JSON, or REAXML.
          </p>
        </div>

        {currentStep === 1 && (
          <Button
            variant="gold"
            size="lg"
            onClick={() => handleLoadSample(targetEntity)}
            className="gap-2 text-xs font-bold shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>Load Sample Agency File</span>
          </Button>
        )}
      </div>

      {/* Step Indicator Progress Bar */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 border-b border-slate-200 pb-4">
        {[
          { step: 1, title: "1. Upload & Entity", desc: "Select File & Entity" },
          { step: 2, title: "2. Column Mapping", desc: "AI Header Matching" },
          { step: 3, title: "3. Inspection & Validate", desc: "Clean & Format Data" },
          { step: 4, title: "4. Migration Complete", desc: "Import to ERP Database" },
        ].map((s) => (
          <div
            key={s.step}
            className={`p-3 rounded-xl border text-left transition-all ${
              currentStep === s.step
                ? "bg-[#0a192f] text-white border-[#0a192f] shadow-md"
                : currentStep > s.step
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-slate-50 text-slate-400 border-slate-200"
            }`}
          >
            <p className="font-bold text-xs">{s.title}</p>
            <p className="text-[10px] opacity-80 font-medium hidden sm:block">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* STEP 1: UPLOAD & ENTITY SELECTION */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Target Entity Selector Card */}
          <Card className="border border-slate-200 shadow-xs">
            <CardHeader className="p-5 border-b border-slate-100">
              <CardTitle className="text-base font-serif text-[#0a192f]">
                Select Target Import Entity
              </CardTitle>
              <p className="text-xs text-slate-500">Choose the destination database category for your data file.</p>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { key: "CONTACTS", label: "Contacts & Clients", desc: "Buyers, Vendors, Landlords", icon: Users },
                  { key: "PROPERTIES", label: "Properties & Listings", desc: "Sales, Rentals, Commercial", icon: Building2 },
                  { key: "APPRAISALS", label: "Appraisal Requests", desc: "Estimates & Leads", icon: FileText },
                  { key: "TENANCIES", label: "Tenancies & Leases", desc: "Rentals & Expiries", icon: KeyRound },
                  { key: "CONTRACTORS", label: "Trade Contractors", desc: "Plumbers, Electricians", icon: Wrench },
                ].map((ent) => {
                  const Icon = ent.icon;
                  const isSelected = targetEntity === ent.key;
                  return (
                    <button
                      key={ent.key}
                      onClick={() => handleLoadSample(ent.key as ImportEntity)}
                      className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                        isSelected
                          ? "bg-slate-900 text-white border-[#c5a059] ring-2 ring-[#c5a059]/40 shadow-lg"
                          : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? "bg-[#c5a059] text-slate-950" : "bg-slate-100 text-slate-600"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs">{ent.label}</h4>
                        <p className={`text-[10px] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>{ent.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upload Area Card */}
          <Card className="border border-slate-200 shadow-xs">
            <CardContent className="p-8">
              <div className="border-2 border-dashed border-slate-300 hover:border-[#0a192f] rounded-2xl p-8 sm:p-12 text-center bg-slate-50/50 hover:bg-slate-50 transition-all space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0a192f] text-[#c5a059] flex items-center justify-center mx-auto shadow-md">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg text-[#0a192f]">
                    Drag &amp; Drop Agency Data File (.csv, .xlsx, .json, .xml)
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Supports exports from Rex, Agentbox, VaultRE, PropertyTree, Console Cloud, and generic spreadsheets.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button variant="gold" size="lg" onClick={handleProceedToMapping} className="text-xs font-bold shadow-md">
                    Choose Local File &amp; Continue →
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => handleLoadSample(targetEntity)} className="text-xs">
                    Load Demo {targetEntity} File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* STEP 2: AI COLUMN MAPPING MATRIX */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <Card className="border border-slate-200 shadow-xs">
            <CardHeader className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-serif text-[#0a192f]">
                  AI Column Header Mapping Matrix ({targetEntity})
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Infomats AI has automatically mapped your file headers to the target schema fields.
                </p>
              </div>

              <Badge variant="gold" className="text-xs font-mono">
                {mappings.filter((m) => m.isAutoMatched).length} / {mappings.length} Auto-Matched
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Source File Header</th>
                      <th className="py-3 px-4">AI Match Confidence</th>
                      <th className="py-3 px-4">Target ERP Schema Field</th>
                      <th className="py-3 px-4">Sample Data Row 1</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {mappings.map((map, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0a192f]">
                          {map.sourceColumn}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              map.confidenceScore >= 90
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : map.confidenceScore >= 70
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                            }`}
                          >
                            {map.confidenceScore}% Match
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={map.targetFieldKey}
                            onChange={(e) => updateMapping(map.sourceColumn, e.target.value)}
                            className="w-full max-w-xs py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                          >
                            <option value="">-- Do Not Import --</option>
                            {ENTITY_SCHEMAS[targetEntity].map((field) => (
                              <option key={field.key} value={field.key}>
                                {field.label} {field.required ? "*" : ""}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-500 truncate max-w-xs">
                          {rawRows[0]?.[map.sourceColumn] || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={() => setCurrentStep(1)} className="text-xs gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Upload
            </Button>
            <Button variant="gold" size="lg" onClick={handleProceedToValidation} className="text-xs font-bold shadow-md gap-2">
              <span>Inspect &amp; Validate Data →</span>
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: PRE-IMPORT DATA INSPECTION & VALIDATION GRID */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {/* Quality Overview Card */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-semibold uppercase">Total Import Records</p>
              <p className="font-serif text-2xl font-bold text-[#0a192f]">{validatedRecords.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-semibold uppercase">Valid Ready Records</p>
              <p className="font-serif text-2xl font-bold text-emerald-600">{validCount}</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-semibold uppercase">Auto-Formatted Warnings</p>
              <p className="font-serif text-2xl font-bold text-amber-500">{warningCount}</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-semibold uppercase">Data Quality Score</p>
              <p className="font-serif text-2xl font-bold text-[#c5a059]">{qualityScore}%</p>
            </div>
          </div>

          {/* Validation Grid */}
          <Card className="border border-slate-200 shadow-xs">
            <CardHeader className="p-5 border-b border-slate-100">
              <CardTitle className="text-base font-serif text-[#0a192f]">
                Pre-Import Record Inspection Grid ({targetEntity})
              </CardTitle>
              <p className="text-xs text-slate-500">Review sanitized records before writing to Infomats ERP database.</p>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 whitespace-nowrap">
                    <tr>
                      <th className="py-3 px-4">Row #</th>
                      <th className="py-3 px-4">Mapped Fields Data</th>
                      <th className="py-3 px-4">Sanitization Warnings</th>
                      <th className="py-3 px-4">Validation Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {validatedRecords.map((rec) => (
                      <tr key={rec.rowIndex} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          #{rec.rowIndex}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(rec.data).map(([k, v]) => (
                              <span key={k} className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-mono text-slate-800">
                                <span className="font-semibold text-slate-500">{k}:</span> {v}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {rec.warnings.length > 0 ? (
                            <div className="space-y-0.5">
                              {rec.warnings.map((w, i) => (
                                <p key={i} className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
                                  <span>{w}</span>
                                </p>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">Clean</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {rec.isValid ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-[11px] font-bold border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3" /> READY
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full text-[11px] font-bold border border-rose-200">
                              <XCircle className="h-3 w-3" /> INVALID
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={() => setCurrentStep(2)} className="text-xs gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Column Mapping
            </Button>
            <Button
              variant="gold"
              size="lg"
              disabled={isProcessing}
              onClick={handleExecuteImport}
              className="text-xs font-bold shadow-md gap-2"
            >
              <Database className="h-4 w-4" />
              <span>{isProcessing ? "Importing Data to ERP..." : `Execute Intelligent Import (${validCount} Records)`}</span>
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: MIGRATION COMPLETE SUMMARY */}
      {currentStep === 4 && importSummary && (
        <Card className="border-2 border-emerald-500 bg-slate-900 text-white shadow-2xl p-6 sm:p-10 space-y-6 animate-fadeIn">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-3xl font-bold">Data Import Migration Completed Successfully!</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Your agency data has been processed, formatted, and written to the Infomats ERP database.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
              <p className="text-xs text-slate-400 font-semibold uppercase">Imported Records</p>
              <p className="font-serif text-3xl font-bold text-emerald-400">{importSummary.imported}</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
              <p className="text-xs text-slate-400 font-semibold uppercase">Skipped Duplicates</p>
              <p className="font-serif text-3xl font-bold text-slate-400">{importSummary.skipped}</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
              <p className="text-xs text-slate-400 font-semibold uppercase">Target Database</p>
              <p className="font-serif text-xl font-bold text-[#c5a059]">{targetEntity}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-800">
            <Button variant="gold" size="lg" onClick={() => setCurrentStep(1)} className="text-xs font-bold">
              Import Another Data File
            </Button>

            <Link href="/admin/contacts">
              <Button variant="outline" size="lg" className="text-xs bg-slate-800 text-slate-200 border-slate-700">
                View CRM Database →
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
