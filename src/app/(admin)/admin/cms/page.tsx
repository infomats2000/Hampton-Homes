"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, Plus, Edit, Eye, Sparkles, CheckCircle2, Layout, Layers, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface CMSPageItem {
  id: string;
  title: string;
  slug: string;
  status: "PUBLISHED" | "DRAFT" | "SCHEDULED";
  sectionsCount: number;
  lastUpdated: string;
}

export default function AdminCMSPage() {
  const [pages, setPages] = useState<CMSPageItem[]>([
    { id: "page-1", title: "Homepage", slug: "/", status: "PUBLISHED", sectionsCount: 6, lastUpdated: "2026-08-22 14:00" },
    { id: "page-2", title: "About Us", slug: "/about", status: "PUBLISHED", sectionsCount: 4, lastUpdated: "2026-08-20 10:15" },
    { id: "page-3", title: "Property Management", slug: "/property-management", status: "PUBLISHED", sectionsCount: 5, lastUpdated: "2026-08-18 16:30" },
    { id: "page-4", title: "Contact Us", slug: "/contact", status: "PUBLISHED", sectionsCount: 3, lastUpdated: "2026-08-15 11:20" },
    { id: "page-5", title: "Selling Strategy Guide", slug: "/sell-guide", status: "DRAFT", sectionsCount: 3, lastUpdated: "2026-08-12 09:00" },
  ]);

  const [selectedPage, setSelectedPage] = useState<CMSPageItem | null>(pages[0]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
              Controlled Page Builder & CMS
            </h1>
            <Badge variant="gold">Section 46 Compliant</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage website pages using structured, design-safe components (Hero, Rich Text, Property Grid, Agent Grid, CTA).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="gold" size="sm" className="gap-2 text-xs">
            <Plus className="h-4 w-4" />
            <span>Create New CMS Page</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Page List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">CMS Pages</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {pages.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPage(p)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedPage?.id === p.id ? "bg-slate-100/80 font-semibold" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{p.title}</span>
                    <Badge variant={p.status === "PUBLISHED" ? "success" : "outline"}>{p.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-mono">{p.slug}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Page Builder Section Editor (Controlled Components) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPage ? (
            <Card className="border-l-4 border-l-[#c5a059]">
              <CardHeader className="pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-[#0a192f]">{selectedPage.title} Builder</CardTitle>
                    <CardDescription className="text-xs">Page URL: {selectedPage.slug}</CardDescription>
                  </div>
                  <Link href={selectedPage.slug} target="_blank">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Live Preview</span>
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-sm text-[#0a192f]">Allowed Design-Safe Sections</h4>
                  <p className="text-xs text-slate-500">
                    To prevent design breakage, pages are constructed using pre-styled design system blocks.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { type: "Hero Banner", desc: "Large background banner with property search widget" },
                    { type: "Featured Properties Carousel", desc: "Dynamic listing grid from MRI Vault" },
                    { type: "Appraisal Request CTA", desc: "High-converting property appraisal form" },
                    { type: "Agent Team Grid", desc: "Local sales executive profiles" },
                    { type: "Suburb Guides Section", desc: "Market stats and location highlights" },
                  ].map((sec, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-3">
                        <span className="h-7 w-7 rounded-lg bg-[#0a192f] text-white flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{sec.type}</p>
                          <p className="text-[11px] text-slate-500">{sec.desc}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Configure Block
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center text-slate-500 text-xs">
              Select a page to open the controlled page builder.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
