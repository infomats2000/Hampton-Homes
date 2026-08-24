"use client";

import React, { useState } from "react";
import { Star, Quote, ShieldCheck, CheckCircle2, Building2, MapPin } from "lucide-react";
import { INITIAL_TESTIMONIALS, TestimonialItem } from "@/lib/cms/testimonials-service";
import { SafeImage } from "@/components/ui/safe-image";

export function PublicTestimonialsSection() {
  const [testimonials] = useState<TestimonialItem[]>(
    INITIAL_TESTIMONIALS.filter((t) => t.status === "PUBLISHED" && t.featuredOnHome)
  );

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden border-t border-b border-slate-800">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#d4af37] text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>4.98 ★ Average Rating • 1,280+ Verified Client Reviews</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Client Stories &amp; Successes
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Discover how Australia&apos;s leading homeowners, luxury vendors, and investors achieve benchmark property results with Infomats Real Estate ERP.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-[#c5a059]/50 transition-all shadow-xl flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                {/* 5-Star Rating Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-slate-700 group-hover:text-[#c5a059] transition-colors" />
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed font-light">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Client & Property Details */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                <SafeImage
                  src={item.avatarUrl}
                  alt={item.clientName}
                  className="w-11 h-11 rounded-full object-cover border border-[#c5a059]/40 shadow-sm shrink-0"
                  fallbackTitle={item.clientName[0]}
                />

                <div className="space-y-0.5 overflow-hidden">
                  <h4 className="font-serif font-bold text-sm text-white truncate">
                    {item.clientName}
                  </h4>
                  <p className="text-[11px] text-[#c5a059] font-medium truncate">
                    {item.clientRole}
                  </p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3 shrink-0 text-slate-500" />
                    <span>{item.suburb}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Badge Footer */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c5a059]/20 text-[#c5a059] flex items-center justify-center font-bold text-lg">
              ✓
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-white">Verified Australian Real Estate Reviews</h4>
              <p className="text-xs text-slate-400">Independently audited sales &amp; rental feedback via Infomats ERP.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> 100% Verified Vendors
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> REAXML Integrated
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
