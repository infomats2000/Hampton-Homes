import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#0a192f] text-white",
        gold: "bg-[#fdf8eb] text-[#b38b38] border border-[#c5a059]/30",
        sale: "bg-emerald-100 text-emerald-800 border border-emerald-200",
        rent: "bg-sky-100 text-sky-800 border border-sky-200",
        auction: "bg-purple-100 text-purple-800 border border-purple-200",
        sold: "bg-slate-800 text-white",
        underOffer: "bg-amber-100 text-amber-800 border border-amber-200",
        outline: "border border-slate-300 text-slate-700 bg-white",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        warning: "bg-amber-50 text-amber-700 border border-amber-200",
        danger: "bg-rose-50 text-rose-700 border border-rose-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={twMerge(clsx(badgeVariants({ variant }), className))} {...props} />
  );
}
