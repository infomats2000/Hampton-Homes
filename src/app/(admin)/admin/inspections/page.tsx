import Link from "next/link";
import { Calendar, Clock, MapPin, UserCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SafeImage } from "@/components/ui/safe-image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminInspectionsPage() {
  const sessions = await prisma.propertyInspection.findMany({
    where: { endTime: { gte: new Date() } },
    include: {
      listing: {
        include: {
          property: { include: { media: { where: { mediaType: "PHOTO" }, orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }], take: 1 } } },
          agents: { where: { isPrimary: true }, take: 1, include: { agent: { include: { user: true } } } },
          _count: { select: { enquiries: true } },
        },
      },
    },
    orderBy: { startTime: "asc" },
  });

  return <div className="space-y-8">
    <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end"><div><div className="flex items-center gap-2"><h1 className="font-serif text-3xl font-bold text-[#0a192f]">Upcoming Inspection Sessions</h1><Badge variant="gold">Live Database</Badge></div><p className="mt-1 text-sm text-slate-500">Inspection schedules synchronized with each listing in DigitalOcean.</p></div><Link href="/admin/properties"><Button variant="gold" size="sm">Manage property schedules</Button></Link></div>
    {sessions.length === 0 ? <Card><CardContent className="space-y-3 p-12 text-center"><Calendar className="mx-auto h-10 w-10 text-[#c5a059]" /><h2 className="font-serif text-xl font-bold text-[#0a192f]">No upcoming inspections</h2><p className="text-sm text-slate-500">Inspection sessions will appear here when they are added to a listing or synchronized from MRI.</p></CardContent></Card> : <div className="space-y-5">{sessions.map((session) => {
      const listing = session.listing; const property = listing.property; const agent = listing.agents[0]?.agent;
      return <Card key={session.id} className="overflow-hidden"><CardHeader className="border-b bg-slate-50"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div className="flex items-center gap-4"><div className="h-16 w-24 overflow-hidden rounded-lg bg-slate-100"><SafeImage src={property.media[0]?.url} alt={listing.headline} fallbackTitle={property.suburb} className="h-full w-full object-cover" /></div><div><span className="text-xs font-bold uppercase text-[#b38b38]">{property.suburb}</span><h2 className="font-serif text-lg font-bold text-[#0a192f]">{property.streetNumber} {property.streetName}, {property.suburb}</h2><p className="text-xs text-slate-500">{listing.priceDisplay}</p></div></div><Link href={`/admin/properties/${listing.id}`}><Button variant="outline" size="sm">Edit listing</Button></Link></div></CardHeader><CardContent className="space-y-4 p-6"><div className="grid gap-3 rounded-lg border bg-slate-50 p-4 text-xs font-semibold text-slate-700 sm:grid-cols-2 lg:grid-cols-4"><p className="flex gap-2"><Calendar className="h-4 w-4 text-[#c5a059]" />{session.startTime.toLocaleDateString("en-AU", { dateStyle: "full", timeZone: "Australia/Sydney" })}</p><p className="flex gap-2"><Clock className="h-4 w-4 text-[#c5a059]" />{session.startTime.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", timeZone: "Australia/Sydney" })}–{session.endTime.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", timeZone: "Australia/Sydney" })}</p><p className="flex gap-2"><UserCheck className="h-4 w-4 text-[#c5a059]" />{agent ? `${agent.user.firstName} ${agent.user.lastName}` : "Agent not assigned"}</p><p className="flex gap-2"><MapPin className="h-4 w-4 text-[#c5a059]" />{listing._count.enquiries} listing enquiries</p></div>{session.notes && <p className="text-sm text-slate-600">{session.notes}</p>}</CardContent></Card>;
    })}</div>}
  </div>;
}
