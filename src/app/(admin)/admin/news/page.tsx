"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Newspaper, Plus, Edit, Eye, Trash2, Calendar, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MOCK_ARTICLES, ArticleItem } from "@/lib/cms/service";

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<ArticleItem[]>(MOCK_ARTICLES);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
              News & Market Insights CMS
            </h1>
            <Badge variant="gold">Section 47 Compliant</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Publish real estate market reports, suburb research guides, and property news articles.
          </p>
        </div>

        <Button variant="gold" size="sm" className="gap-2 text-xs">
          <Plus className="h-4 w-4" />
          <span>Write New Article</span>
        </Button>
      </div>

      <div className="space-y-4">
        {articles.map((art) => (
          <Card key={art.id} className="hover:shadow-md transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={art.status === "PUBLISHED" ? "success" : "outline"}>{art.status}</Badge>
                    <span className="text-xs font-semibold text-[#b38b38]">{art.category}</span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#0a192f]">{art.title}</h3>
                  <p className="text-xs text-slate-600 font-normal max-w-2xl">{art.excerpt}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/news/${art.slug}`} target="_blank">
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> Author: {art.author}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Published: {art.publishedAt}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
