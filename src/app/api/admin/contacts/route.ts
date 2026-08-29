import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(8).max(30),
  type: z.enum(["LEAD", "TENANT"]),
  notes: z.string().trim().max(3000).optional().default(""),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.roles.some((role) => role === "ADMIN" || role === "SUPER_ADMIN")) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check the contact details", details: parsed.error.flatten() }, { status: 400 });
  const input = parsed.data;
  const lead = await prisma.lead.create({ data: {
    name: `${input.firstName} ${input.lastName}`, email: input.email.toLowerCase(), phone: input.phone,
    leadType: input.type === "TENANT" ? "TENANT" : "GENERAL", source: "MANUAL", notes: input.notes || null,
    activities: { create: { actionType: "CREATED", description: "Contact created manually", actorName: `${user.firstName} ${user.lastName}` } },
  } });
  return NextResponse.json({ id: lead.id }, { status: 201 });
}

