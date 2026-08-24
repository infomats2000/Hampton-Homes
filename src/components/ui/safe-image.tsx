"use client";

import React, { useState } from "react";
import { Building2 } from "lucide-react";
import { AGENCY_NAME } from "@/lib/agency-config";

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  className?: string;
}

export function SafeImage({
  src,
  alt = AGENCY_NAME,
  fallbackTitle = AGENCY_NAME,
  fallbackSubtitle = "Real Estate Australia",
  className = "",
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`bg-gradient-to-br from-[#071325] via-[#0a192f] to-[#1a365d] flex flex-col items-center justify-center p-6 text-white text-center select-none ${className}`}
      >
        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center mb-2 shadow-inner">
          <Building2 className="h-6 w-6 text-[#c5a059]" />
        </div>
        <p className="font-serif font-bold text-sm tracking-wide text-white truncate max-w-full">
          {fallbackTitle}
        </p>
        <p className="text-[10px] text-amber-400/90 font-medium uppercase tracking-widest mt-0.5">
          {fallbackSubtitle}
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={className}
      {...props}
    />
  );
}
