"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Users,
  CheckCircle2,
  Copy,
  Check,
  Send,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Clock,
  Building2,
  Flame,
  Award,
  Search,
  Filter,
  CheckSquare,
  Square,
  RefreshCw,
  Plus,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MOCK_AUSTRALIAN_PROPERTIES } from "@/lib/mri/mock-provider";
import { MRIRawProperty } from "@/lib/mri/provider.interface";
import {
  generateAICopyForProperty,
  AICopyResult,
  AICopyTone,
} from "@/lib/ai/copywriter";
import {
  getTopBuyerMatchesForProperty,
  BuyerMatchResult,
  MOCK_BUYERS,
} from "@/lib/crm/buyer-matcher";
import {
  MOCK_AGENT_TASKS,
  AgentTaskItem,
  getTaskMatrixSummary,
} from "@/lib/crm/task-matrix";

export default function AdminMarketingTasksPage() {
  const [activeTab, setActiveTab] = useState<"COPYWRITER" | "MATCHER" | "TASKS">("COPYWRITER");
  const [properties] = useState<MRIRawProperty[]>(MOCK_AUSTRALIAN_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<MRIRawProperty>(MOCK_AUSTRALIAN_PROPERTIES[0]);

  // AI Copywriter State
  const [selectedTone, setSelectedTone] = useState<AICopyTone>("LUXURY_PRESTIGE");
  const [aiCopy, setAiCopy] = useState<AICopyResult>(
    generateAICopyForProperty(MOCK_AUSTRALIAN_PROPERTIES[0], "LUXURY_PRESTIGE")
  );
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Buyer Matcher State
  const [buyerMatches, setBuyerMatches] = useState<BuyerMatchResult[]>(
    getTopBuyerMatchesForProperty(MOCK_AUSTRALIAN_PROPERTIES[0].externalId)
  );
  const [sentAlertNotice, setSentAlertNotice] = useState<string | null>(null);

  // Task Matrix State
  const [tasks, setTasks] = useState<AgentTaskItem[]>(MOCK_AGENT_TASKS);
  const taskSummary = getTaskMatrixSummary(tasks);

  const handlePropertyChange = (propId: string) => {
    const prop = properties.find((p) => p.externalId === propId) || properties[0];
    setSelectedProperty(prop);
    setAiCopy(generateAICopyForProperty(prop, selectedTone));
    setBuyerMatches(getTopBuyerMatchesForProperty(prop.externalId));
  };

  const handleToneChange = (tone: AICopyTone) => {
    setSelectedTone(tone);
    setAiCopy(generateAICopyForProperty(selectedProperty, tone));
  };

  const handleRegenerateCopy = () => {
    setIsGeneratingCopy(true);
    setTimeout(() => {
      setAiCopy(generateAICopyForProperty(selectedProperty, selectedTone));
      setIsGeneratingCopy(false);
    }, 600);
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSendBuyerAlert = (buyerName: string, method: "SMS" | "EMAIL") => {
    setSentAlertNotice(`Instant ${method} alert sent to ${buyerName}!`);
    setTimeout(() => setSentAlertNotice(null), 4000);
  };

  const toggleTaskCompleted = (taskId: string) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  return (
    <div className="space-y-8 max-w-7xl">

      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-[#0a192f] text-[#c5a059]">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">AI Marketing &amp; Agent Task Matrix</h1>
            <Badge variant="gold">Gemini AI Powered</Badge>
          </div>
          <p className="text-sm text-slate-500">
            Instant AI real estate copy generation, smart buyer-property matching algorithms, and daily agent action plan matrix.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => setActiveTab("MATCHER")} className="text-xs gap-1.5 border-slate-300">
            <Users className="h-3.5 w-3.5" />
            Buyer Matcher
          </Button>
          <Button variant="gold" size="sm" onClick={() => setActiveTab("COPYWRITER")} className="text-xs gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Generate AI Copy
          </Button>
        </div>
      </div>

      {/* ── Alert Banner ────────────────────────────────────────── */}
      {sentAlertNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>{sentAlertNotice}</span>
        </div>
      )}

      {/* ── Top Metric Cards ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200">
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Matched Buyers</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <p className="font-serif text-2xl font-bold text-slate-900">
              {buyerMatches.filter((m) => m.isHotMatch).length} Hot Buyers
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              {buyerMatches.length} Total Matched Candidates
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">AI Copy Formats</span>
              <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <p className="font-serif text-2xl font-bold text-slate-900">
              4 Formats
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              Editorial, Portal, Social &amp; SMS
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Agent Action Matrix</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <CheckSquare className="h-4 w-4" />
              </div>
            </div>
            <p className="font-serif text-2xl font-bold text-slate-900">
              {taskSummary.pendingTasksCount} Tasks Pending
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              {taskSummary.urgentCount} High-Priority | {taskSummary.completionPercentage}% Done
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Property</span>
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <p className="font-serif font-bold text-slate-900 text-sm truncate">
              {selectedProperty.suburb} Listing
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              ID: {selectedProperty.externalId}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Tab Navigation ────────────────────────────────────── */}
      <div className="border-b border-slate-200 flex gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("COPYWRITER")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "COPYWRITER"
              ? "border-[#c5a059] text-[#0a192f]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles className="h-4 w-4 text-[#c5a059]" />
          <span>AI Property Copywriter</span>
        </button>

        <button
          onClick={() => setActiveTab("MATCHER")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "MATCHER"
              ? "border-[#c5a059] text-[#0a192f]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Flame className="h-4 w-4 text-[#c5a059]" />
          <span>Smart Buyer-Property Matcher</span>
          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 font-bold border-emerald-200">
            {buyerMatches.filter((m) => m.isHotMatch).length} Hot Matches
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("TASKS")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "TASKS"
              ? "border-[#c5a059] text-[#0a192f]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <CheckSquare className="h-4 w-4 text-[#c5a059]" />
          <span>Agent Daily Action Matrix</span>
          <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 font-bold border-amber-200">
            {taskSummary.pendingTasksCount} Pending
          </Badge>
        </button>
      </div>

      {/* ── TAB 1: AI PROPERTY COPYWRITER ──────────────────────────── */}
      {activeTab === "COPYWRITER" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <Card className="border border-slate-200">
            <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Property Selector */}
              <div className="space-y-1 w-full sm:w-80">
                <label className="text-xs font-bold text-slate-700">Select Property Listing</label>
                <select
                  value={selectedProperty.externalId}
                  onChange={(e) => handlePropertyChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                >
                  {properties.map((p) => (
                    <option key={p.externalId} value={p.externalId}>
                      {p.headline} ({p.suburb})
                    </option>
                  ))}
                </select>
              </div>

              {/* Copy Tone Selector */}
              <div className="space-y-1 w-full sm:w-72">
                <label className="text-xs font-bold text-slate-700">Select Marketing Tone</label>
                <select
                  value={selectedTone}
                  onChange={(e) => handleToneChange(e.target.value as AICopyTone)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                >
                  <option value="LUXURY_PRESTIGE">Prestige &amp; Luxury</option>
                  <option value="EMOTIONAL_FAMILY">Family Sanctuary</option>
                  <option value="INVESTOR_YIELD">Investor High-Yield</option>
                </select>
              </div>

              <Button variant="gold" size="sm" onClick={handleRegenerateCopy} disabled={isGeneratingCopy} className="text-xs gap-1.5 shrink-0 self-end sm:self-center">
                <RefreshCw className={`h-3.5 w-3.5 ${isGeneratingCopy ? "animate-spin" : ""}`} />
                <span>{isGeneratingCopy ? "Generating..." : "Regenerate AI Copy"}</span>
              </Button>
            </CardContent>
          </Card>

          {/* 4 Generated Copy Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* 1. Prestige Editorial Copy */}
            <Card className="relative overflow-hidden border border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#c5a059]" />
                    <span>Prestige Editorial Description</span>
                  </CardTitle>
                  <CardDescription className="text-[10px]">For brochure, website hero, and editorial print</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyText(aiCopy.editorialCopy, "editorial")}
                  className="h-7 px-2 text-[11px] gap-1 text-[#c5a059]"
                >
                  {copiedKey === "editorial" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedKey === "editorial" ? "Copied" : "Copy"}
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-xs text-slate-700 leading-relaxed font-serif">
                  {aiCopy.editorialCopy}
                </p>
              </CardContent>
            </Card>

            {/* 2. Portal Summary (REA / Domain) */}
            <Card className="relative overflow-hidden border border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-sky-600" />
                    <span>Portal Summary (REA &amp; Domain)</span>
                  </CardTitle>
                  <CardDescription className="text-[10px]">Bullet-point feature stack for portal listings</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyText(aiCopy.portalSummaryCopy, "portal")}
                  className="h-7 px-2 text-[11px] gap-1 text-sky-600"
                >
                  {copiedKey === "portal" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedKey === "portal" ? "Copied" : "Copy"}
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                <pre className="text-xs text-slate-700 font-sans whitespace-pre-wrap leading-relaxed">
                  {aiCopy.portalSummaryCopy}
                </pre>
              </CardContent>
            </Card>

            {/* 3. Social Media Caption */}
            <Card className="relative overflow-hidden border border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-pink-600" />
                    <span>Social Media Caption &amp; Hashtags</span>
                  </CardTitle>
                  <CardDescription className="text-[10px]">Instagram &amp; Facebook post caption</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyText(aiCopy.socialMediaCaption, "social")}
                  className="h-7 px-2 text-[11px] gap-1 text-pink-600"
                >
                  {copiedKey === "social" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedKey === "social" ? "Copied" : "Copy"}
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                <pre className="text-xs text-slate-700 font-sans whitespace-pre-wrap leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {aiCopy.socialMediaCaption}
                </pre>
              </CardContent>
            </Card>

            {/* 4. SMS Off-Market Buyer Blast */}
            <Card className="relative overflow-hidden border border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-emerald-600" />
                    <span>SMS Off-Market Buyer Blast</span>
                  </CardTitle>
                  <CardDescription className="text-[10px]">Short 160-character SMS alert for matched buyers</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyText(aiCopy.smsBuyerAlert, "sms")}
                  className="h-7 px-2 text-[11px] gap-1 text-emerald-600"
                >
                  {copiedKey === "sms" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedKey === "sms" ? "Copied" : "Copy"}
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 font-mono text-xs leading-relaxed">
                  {aiCopy.smsBuyerAlert}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-right">Character count: {aiCopy.smsBuyerAlert.length} / 160</p>
              </CardContent>
            </Card>

          </div>
        </div>
      )}

      {/* ── TAB 2: SMART BUYER-PROPERTY MATCHER ───────────────────── */}
      {activeTab === "MATCHER" && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-serif flex items-center gap-2">
                  <Flame className="h-5 w-5 text-emerald-600" />
                  <span>Smart Buyer-Property Matching Engine</span>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Showing top matched buyers for <strong>{selectedProperty.headline}</strong> ({selectedProperty.suburb}).
                </CardDescription>
              </div>

              {/* Property Selector */}
              <div className="w-full sm:w-72">
                <select
                  value={selectedProperty.externalId}
                  onChange={(e) => handlePropertyChange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                >
                  {properties.map((p) => (
                    <option key={p.externalId} value={p.externalId}>
                      {p.headline} ({p.suburb})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200 whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-4">Buyer Name</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4 font-mono">Max Budget</th>
                    <th className="py-3 px-4">Preferred Suburbs</th>
                    <th className="py-3 px-4">Match Score</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {buyerMatches.map((m) => (
                    <tr key={m.buyer.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <p className="font-serif font-bold text-slate-900">{m.buyer.name}</p>
                          {m.isHotMatch && (
                            <Badge variant="outline" className="text-[9px] bg-red-50 text-red-700 border-red-200 font-bold">
                              🔥 HOT MATCH
                            </Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {m.buyer.preApprovedFinance ? "✅ Pre-approved Finance" : "Pending Pre-approval"}
                        </p>
                      </td>

                      <td className="py-3 px-4">
                        <p className="text-slate-900 font-mono">{m.buyer.phone}</p>
                        <p className="text-slate-400 text-[10px]">{m.buyer.email}</p>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                        ${m.buyer.maxBudget.toLocaleString("en-AU")}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {m.buyer.preferredSuburbs.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Match Score Bar */}
                      <td className="py-3 px-4 min-w-40">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-slate-900">{m.matchScore}% Match</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${m.matchScore >= 75 ? "bg-emerald-500" : m.matchScore >= 50 ? "bg-amber-500" : "bg-slate-400"}`}
                              style={{ width: `${m.matchScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendBuyerAlert(m.buyer.name, "SMS")}
                            className="h-8 px-2 text-[11px] gap-1 text-emerald-700 hover:text-emerald-900"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>SMS Alert</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendBuyerAlert(m.buyer.name, "EMAIL")}
                            className="h-8 px-2 text-[11px] gap-1 text-sky-700 hover:text-sky-900"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span>Email</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── TAB 3: AGENT DAILY ACTION MATRIX ──────────────────────── */}
      {activeTab === "TASKS" && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-serif flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-[#c5a059]" />
                  <span>Agent Daily Action Plan &amp; Workflow Matrix</span>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Prioritized daily action items: Hot lead follow-ups, post-inspection call list, 7-day appraisal check-ins, and settlement anniversaries.
                </CardDescription>
              </div>

              <Badge variant="gold">
                {taskSummary.completedCount} / {taskSummary.totalTasksCount} Tasks Completed ({taskSummary.completionPercentage}%)
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 text-xs">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    task.isCompleted ? "bg-slate-50/50 opacity-60" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskCompleted(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition"
                    >
                      {task.isCompleted ? (
                        <CheckSquare className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-300" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-serif font-bold ${task.isCompleted ? "line-through text-slate-500" : "text-slate-900 text-sm"}`}>
                          {task.taskTitle}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-bold ${
                            task.priority === "URGENT"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : task.priority === "HIGH"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {task.priority}
                        </Badge>
                      </div>

                      <p className="text-slate-600">
                        <strong>Contact:</strong> {task.contactName} ({task.contactPhone}) • <strong>Property:</strong> {task.propertyAddress}
                      </p>

                      {task.notes && <p className="text-[11px] text-slate-400 italic">{task.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#c5a059]" />
                      {task.dueDateDescription}
                    </span>
                    <a
                      href={`tel:${task.contactPhone}`}
                      className="px-3 py-1.5 rounded-lg bg-[#0a192f] text-white text-[11px] font-bold flex items-center gap-1.5 hover:bg-[#112544] transition"
                    >
                      <Phone className="h-3 w-3 text-[#c5a059]" />
                      Call Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
