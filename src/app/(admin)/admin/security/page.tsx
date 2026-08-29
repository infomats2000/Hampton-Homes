"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SecurityPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    const form = event.currentTarget; const body = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false); const payload = await response.json().catch(() => null);
    if (!response.ok) { setError(payload?.error ?? "Could not change your password."); return; }
    router.push("/login?passwordChanged=1");
    router.refresh();
  }
  const inputClass = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm";
  return <div className="mx-auto max-w-2xl space-y-6"><div><h1 className="flex items-center gap-2 font-serif text-3xl font-bold text-[#0a192f]"><ShieldCheck className="h-7 w-7 text-[#c5a059]" />Account Security</h1><p className="mt-1 text-sm text-slate-500">Change your password securely. You will be signed out afterward.</p></div><Card><CardHeader><CardTitle>Change password</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="space-y-4"><label className="block space-y-1 text-xs font-semibold">Current password<input name="currentPassword" type="password" autoComplete="current-password" required className={inputClass} /></label><label className="block space-y-1 text-xs font-semibold">New password<input name="newPassword" type="password" autoComplete="new-password" required minLength={12} maxLength={128} className={inputClass} /></label><label className="block space-y-1 text-xs font-semibold">Confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" required minLength={12} maxLength={128} className={inputClass} /></label><p className="text-xs text-slate-500">Use at least 12 characters with uppercase, lowercase, a number, and a special character.</p>{error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}<Button type="submit" variant="gold" disabled={saving}>{saving ? "Changing…" : "Change password"}</Button></form></CardContent></Card></div>;
}
