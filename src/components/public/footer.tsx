import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-[#071325] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Hampton Homes Realtors"
                className="h-12 w-auto object-contain rounded-md shadow-sm"
              />
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Australia&apos;s premier real estate agency platform. Powered by direct MRI Vault and Property Tree synchronization for seamless real-time listings.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#c5a059]" />
                <span>Head Office: Level 24, 100 Barangaroo Ave, Sydney NSW 2000</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#c5a059]" />
                <span>1300 426 786 (1300 HAMPTON)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#c5a059]" />
                <span>enquiries@hamptonhomes.com.au</span>
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
              Portals & Legal
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
          <p>© {new Date().getFullYear()} Hampton Homes Real Estate Pty Ltd. ABN 84 123 456 789. All rights reserved.</p>
          <p className="mt-2 md:mt-0">MRI Vault & Property Tree Direct Integration Engine</p>
        </div>
      </div>
    </footer>
  );
}
