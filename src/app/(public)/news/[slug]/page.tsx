"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, User, ArrowLeft, Share2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_ARTICLES } from "@/lib/cms/service";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = (params.slug as string) || "";
  const article = MOCK_ARTICLES.find((a) => a.slug === slug) || MOCK_ARTICLES[0];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link href="/news" className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0a192f]">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Market Insights</span>
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="gold">{article.category}</Badge>
            <span className="text-xs text-slate-400 font-mono">Published {article.publishedAt}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0a192f] leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-200">
            <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-[#c5a059]" /> Written by {article.author}</span>
          </div>
        </div>

        <Card className="p-8 sm:p-12 space-y-6 shadow-md">
          <CardContent className="space-y-4 text-slate-700 leading-relaxed text-base">
            <p className="font-semibold text-slate-900 text-lg">{article.excerpt}</p>
            <p>
              The Australian property market continues to demonstrate strong fundamentals throughout 2026. Premium residential assets across Parramatta, Bondi Beach, and Manly have recorded consistent buyer inquiry volumes, supported by live CRM synchronization via MRI Vault.
            </p>
            <p>
              Investors and homeowners seeking long-term capital growth are prioritizing high-specification developments with proximity to major transit corridors and coastal precincts.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
