import Link from "next/link";
import { Calendar, Gavel, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SafeImage } from "@/components/ui/safe-image";
import { getPublishedProperties } from "@/lib/properties/database-service";

export const dynamic = "force-dynamic";

export default async function AuctionsPage() {
  const properties = (await getPublishedProperties()).filter((property) => property.status === "AUCTION" || (property.auctionDate && new Date(property.auctionDate) >= new Date()));
  return <div className="min-h-screen space-y-12 bg-slate-50 py-12"><div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-3xl space-y-3 text-center"><Badge variant="gold" className="gap-1"><Gavel className="h-3.5 w-3.5" />Auction Calendar</Badge><h1 className="font-serif text-4xl font-bold text-[#0a192f] sm:text-5xl">Upcoming Property Auctions</h1><p className="text-base font-light text-slate-600">Browse scheduled auctions from our live property database.</p></div>
    {properties.length === 0 ? <Card className="mx-auto max-w-2xl"><CardContent className="space-y-3 p-10 text-center"><Gavel className="mx-auto h-10 w-10 text-[#c5a059]" /><h2 className="font-serif text-2xl font-bold text-[#0a192f]">No upcoming auctions</h2><p className="text-sm text-slate-500">New auction listings will appear here as soon as they are scheduled.</p><Link href="/buy"><Button variant="gold">Browse properties for sale</Button></Link></CardContent></Card> : <div className="grid gap-8 md:grid-cols-2">{properties.map((item) => <Card key={item.externalId} className="overflow-hidden border-l-4 border-l-purple-600"><div className="flex flex-col sm:flex-row"><div className="relative h-48 shrink-0 bg-slate-100 sm:w-56"><SafeImage src={item.photos[0]} alt={item.headline} fallbackTitle={item.suburb} className="h-full w-full object-cover" /><Badge variant="auction" className="absolute left-3 top-3">AUCTION</Badge></div><CardContent className="flex flex-1 flex-col justify-between space-y-4 p-6"><div><p className="font-serif text-xl font-bold text-[#0a192f]">{item.priceDisplay}</p><h2 className="font-serif font-bold text-[#0a192f]">{item.headline}</h2><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5 text-[#c5a059]" />{item.streetNumber} {item.streetName}, {item.suburb} {item.state}</p></div><div className="space-y-2 rounded-xl border border-purple-100 bg-purple-50 p-3 text-xs font-semibold text-purple-950"><p className="flex gap-2"><Calendar className="h-4 w-4" />{item.auctionDate ? new Date(item.auctionDate).toLocaleString("en-AU", { dateStyle: "full", timeStyle: "short", timeZone: "Australia/Sydney" }) : "Auction time to be confirmed"}</p><p className="flex gap-2"><MapPin className="h-4 w-4" />{item.auctionLocation || "On-site at the property"}</p></div><Link href={`/property/${item.externalId}`}><Button variant="gold" size="sm" className="w-full">View property and enquire</Button></Link></CardContent></div></Card>)}</div>}
  </div></div>;
}
