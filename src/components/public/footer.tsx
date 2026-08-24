import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import {
  AGENCY_NAME,
  AGENCY_LEGAL_NAME,
  AGENCY_LOGO_URL,
  AGENCY_PHONE,
  AGENCY_EMAIL,
  AGENCY_ABN,
  AGENCY_HEAD_OFFICE_ADDRESS,
} from "@/lib/agency-config";

export function PublicFooter() {
  return (
    <footer className="bg-[#071325] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-[#c5a059] border border-white/20 flex items-center justify-center font-serif font-bold text-xl shadow-md">
                I
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg text-white tracking-tight leading-none">
                  {AGENCY_NAME}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                  Real Estate ERP System
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {AGENCY_NAME} — your local real estate experts. Powered by direct MRI Vault and
              Property Tree synchronisation for seamless real-time listings.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#c5a059]" />
                <span>Head Office: {AGENCY_HEAD_OFFICE_ADDRESS}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#c5a059]" />
                <span>{AGENCY_PHONE}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#c5a059]" />
                <span>{AGENCY_EMAIL}</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Properties
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/buy" className="hover:text-[#c5a059] transition-colors">Properties for Sale</Link></li>
              <li><Link href="/rent" className="hover:text-[#c5a059] transition-colors">Properties for Rent</Link></li>
              <li><Link href="/sold" className="hover:text-[#c5a059] transition-colors">Recent Sales</Link></li>
              <li><Link href="/commercial" className="hover:text-[#c5a059] transition-colors">Commercial Estate</Link></li>
              <li><Link href="/projects" className="hover:text-[#c5a059] transition-colors">New Developments</Link></li>
              <li><Link href="/inspections" className="hover:text-[#c5a059] transition-colors">Upcoming Inspections</Link></li>
            </ul>
          </div>

          {/* Agency & Services */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Our Agency
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/agents" className="hover:text-[#c5a059] transition-colors">Our Agents</Link></li>
              <li><Link href="/offices" className="hover:text-[#c5a059] transition-colors">Office Locations</Link></li>
              <li><Link href="/suburbs" className="hover:text-[#c5a059] transition-colors">Suburb Guides</Link></li>
              <li><Link href="/sell" className="hover:text-[#c5a059] transition-colors">Request Appraisal</Link></li>
              <li><Link href="/property-management" className="hover:text-[#c5a059] transition-colors">Property Management</Link></li>
              <li><Link href="/about" className="hover:text-[#c5a059] transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal & Portals */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Portals &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/admin" className="hover:text-[#c5a059] transition-colors flex items-center gap-1">Staff Portal <ExternalLink className="h-3 w-3" /></Link></li>
              <li><Link href="/customer/dashboard" className="hover:text-[#c5a059] transition-colors">Customer Portal</Link></li>
              <li><Link href="/privacy" className="hover:text-[#c5a059] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#c5a059] transition-colors">Terms of Service</Link></li>
              <li><Link href="/news" className="hover:text-[#c5a059] transition-colors">Market Insights</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {AGENCY_LEGAL_NAME}. ABN {AGENCY_ABN}. All rights reserved.</p>
          <p className="mt-2 md:mt-0">MRI Vault &amp; Property Tree Direct Integration Engine</p>
        </div>
      </div>
    </footer>
  );
}
