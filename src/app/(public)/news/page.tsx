import React from "react";
import Link from "next/link";
import { Newspaper, Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_ARTICLES } from "@/lib/cms/service";

export default function NewsPage() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="gold">Market Insights</Badge>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0a192f]">
            Real Estate News & Research
          </h1>
          <p className="text-slate-600 text-base font-light">
            Stay informed with Australian property market trends, auction clearance rates, interest rate analysis, and home selling guides.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_ARTICLES.map((art) => (
            <Card key={art.id} className="overflow-hidden hover:shadow-xl transition-all">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="gold">{art.category}</Badge>
                  <span className="text-xs text-slate-400 font-mono">{art.publishedAt}</span>
                </div>

                <h2 className="font-serif font-bold text-2xl text-[#0a192f] hover:text-[#c5a059] transition-colors">
                  <Link href={`/news/${art.slug}`}>{art.title}</Link>
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed">{art.excerpt}</p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">By {art.author}</span>
                  <Link href={`/news/${art.slug}`}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <span>Read Full Article</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
