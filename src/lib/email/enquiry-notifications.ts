import "server-only";

import { AGENCY_NAME } from "@/lib/agency-config";

interface EnquiryNotification {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  propertyAddress: string;
  agentName: string;
  agentEmail: string;
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from || apiKey.includes("XXXX")) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
  return true;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

export async function sendEnquiryNotifications(details: EnquiryNotification) {
  const safe = Object.fromEntries(Object.entries(details).map(([key, value]) => [key, escapeHtml(value)])) as unknown as EnquiryNotification;
  const results = await Promise.allSettled([
    sendEmail(details.agentEmail, `New property enquiry: ${details.propertyAddress}`, `<h2>New property enquiry</h2><p><strong>Property:</strong> ${safe.propertyAddress}</p><p><strong>Name:</strong> ${safe.customerName}</p><p><strong>Email:</strong> ${safe.customerEmail}</p><p><strong>Phone:</strong> ${safe.customerPhone}</p><p>${safe.message}</p>`),
    sendEmail(details.customerEmail, `We received your enquiry | ${AGENCY_NAME}`, `<h2>Thank you, ${safe.customerName}</h2><p>We received your enquiry about <strong>${safe.propertyAddress}</strong>.</p><p>${safe.agentName} or a member of our team will contact you shortly.</p>`),
  ]);
  for (const result of results) if (result.status === "rejected") console.error("[Enquiry email]", result.reason);
  return results.some((result) => result.status === "fulfilled" && result.value);
}
