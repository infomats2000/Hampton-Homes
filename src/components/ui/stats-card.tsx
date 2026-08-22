import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  subtitle?: string;
}

export function StatsCard({ title, value, change, trend, isPositive = true, icon: Icon, subtitle }: StatsCardProps) {
  const displayTrend = trend || change;
  return (
    <Card className="hover:border-slate-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a192f]/5 text-[#0a192f]">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-[#0a192f]">{value}</span>
          {displayTrend && (
            <span
              className={`text-xs font-semibold ${
                isPositive ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {displayTrend}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
