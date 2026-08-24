# Hampton Homes — Production Readiness Implementation Plan

Full upgrade from a demo-data UI to a live production real estate platform.
Covers authentication, real database, email, MRI live sync, and platform polish.

---

## PHASE 1 — Critical Infrastructure (Do First)
> Nothing works in production without these. Estimated effort: 1-2 days.

---

### 1.1 Real PostgreSQL Database (Neon or Supabase)

**Problem**: No DATABASE_URL is set. Every Prisma call fails. All data shown is hardcoded demo data.
**Solution**: Provision a free-tier cloud PostgreSQL instance and connect it.
**Recommended**: Neon (https://neon.tech) - free tier, serverless, Vercel-native

**Files to create/modify:**
- [NEW] .env.local — Add DATABASE_URL=postgresql://...
- [MODIFY] prisma/schema.prisma — Add url field to datasource db
- [NEW] prisma/seed.ts — Seed script: admin user, roles, office, demo properties
- [NEW] package.json — Add "db:seed": "tsx prisma/seed.ts" script

**Steps:**
1. Create Neon project, copy connection string
2. Add DATABASE_URL to .env.local AND Vercel environment variables
3. Run: npx prisma migrate dev --name init
4. Run: npm run db:seed

---

### 1.2 Authentication — NextAuth.js v5

**Problem**: Admin panel, customer portal, agent pages have zero access control. Any URL is publicly accessible.
**Solution**: NextAuth v5 (App Router compatible) with credentials provider + session middleware.

**Files to create/modify:**
- [NEW] src/lib/auth.ts — NextAuth config (credentials provider, JWT, role callbacks)
- [NEW] src/app/api/auth/[...nextauth]/route.ts — NextAuth API handler
- [NEW] src/app/(auth)/login/page.tsx — Premium branded login page
- [NEW] src/app/(auth)/login/layout.tsx — Auth layout wrapper
- [NEW] middleware.ts — Route protection (guards /admin/*, /customer/*, /api/admin/*)
- [MODIFY] prisma/seed.ts — Seed default super-admin user (admin@hamptonhomes.com.au)

**Auth Route Rules:**
| Route Pattern        | Allowed Roles                                              |
|----------------------|------------------------------------------------------------|
| /admin/*             | SUPER_ADMIN, ADMIN, OFFICE_MANAGER, AGENT, MARKETING_ADMIN, SUPPORT |
| /customer/*          | CUSTOMER (authenticated)                                   |
| /api/admin/*         | SUPER_ADMIN, ADMIN                                         |
| /api/webhooks/*      | Public (HMAC signature-verified)                           |
| Everything else      | Public                                                     |

**Environment Variables needed:**
  NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
  NEXTAUTH_URL=https://hampton-homes.vercel.app

---

### 1.3 Vercel Environment Variables

**Problem**: Vercel production has no environment variables. All integrations, auth, and DB will fail.
**Solution**: Add all required variables to Vercel dashboard ? Settings ? Environment Variables.

**Full variable list:**
  # Database
  DATABASE_URL=postgresql://...

  # Auth
  NEXTAUTH_SECRET=...
  NEXTAUTH_URL=https://hampton-homes.vercel.app

  # MRI Integration
  MRI_VAULT_BASE_URL=
  MRI_VAULT_API_KEY=
  MRI_VAULT_AGENCY_ID=
  MRI_PROPERTY_TREE_BASE_URL=
  MRI_PROPERTY_TREE_API_KEY=

  # Integration Hub (add when vendor accounts created)
  HOMEPASS_API_KEY=
  HOMEPASS_WEBHOOK_SECRET=
  FLK_API_KEY=
  FLK_WEBHOOK_SECRET=
  CORELOGIC_CLIENT_ID=
  CORELOGIC_CLIENT_SECRET=
  PROPERTYME_API_KEY=
  PROPERTYME_AGENCY_ID=
  PROPERTYME_WEBHOOK_SECRET=

  # Google OAuth
  GOOGLE_CLIENT_ID=
  GOOGLE_CLIENT_SECRET=

  # Microsoft OAuth
  MICROSOFT_CLIENT_ID=
  MICROSOFT_CLIENT_SECRET=

  # Email
  RESEND_API_KEY=

  # Public
  NEXT_PUBLIC_SITE_URL=https://hampton-homes.vercel.app
  NEXT_PUBLIC_AGENCY_NAME=Hampton Homes Realtors
  NEXT_PUBLIC_AGENCY_PHONE=+61 2 9000 0000
  NEXT_PUBLIC_AGENCY_EMAIL=info@hamptonhomes.com.au

---

## PHASE 2 — Core Platform Functionality
> Makes the platform functionally real. Estimated effort: 2-3 days.

---

### 2.1 Lead Capture -> Live Database

**Problem**: Enquiry forms submit to nowhere. No data is saved.
**Solution**: Wire all form submissions to real Prisma Lead + Enquiry + LeadActivity writes.

**Files to create/modify:**
- [NEW] src/app/api/leads/route.ts — POST /api/leads (create lead from public enquiry forms)
- [NEW] src/app/api/enquiries/route.ts — POST /api/enquiries (property enquiry + auto-link lead)
- [NEW] src/app/api/appraisals/route.ts — POST /api/appraisals (appraisal request form)
- [MODIFY] src/components/public/EnquiryForm.tsx — Wire to POST /api/enquiries
- [MODIFY] src/app/(public)/contact/page.tsx — Wire contact form to POST /api/leads
- [MODIFY] src/app/(public)/sell/page.tsx — Wire appraisal form to POST /api/appraisals

---

### 2.2 Email Notifications (Resend)

**Problem**: No one is notified when leads submit enquiries. Agents are flying blind.
**Solution**: Integrate Resend (https://resend.com) — free tier: 3,000 emails/month.

**Email types to build:**
| Trigger                   | Recipient                  | Template                              |
|---------------------------|----------------------------|---------------------------------------|
| New enquiry submitted     | Assigned agent + office    | Lead details, property, contact info  |
| New appraisal request     | Office manager             | Appraisal request details             |
| Inspection confirmed      | Enquirer                   | Confirmation + iCal attachment        |
| Lead status changed       | Agent                      | Status update notification            |
| Welcome email             | New customer               | Welcome + portal login link           |
| Open home reminder        | Registered attendees       | 24hr before reminder                  |

**Files to create:**
- [NEW] src/lib/email/resend.ts — Resend client singleton
- [NEW] src/lib/email/templates/new-enquiry.tsx — React Email template
- [NEW] src/lib/email/templates/appraisal-request.tsx — React Email template
- [NEW] src/lib/email/templates/inspection-confirmation.tsx — React Email + iCal attachment
- [NEW] src/lib/email/templates/welcome.tsx — Customer welcome email
- [NEW] src/lib/email/send.ts — Unified send helper with error handling

  Environment Variable: RESEND_API_KEY=re_xxxxxxxxxxxxxxxx

---

### 2.3 Live Property Data from MRI Vault

**Problem**: Properties page shows mock data. MRI sync exists but is not fetching real listings.
**Solution**: Activate MRI sync job to pull live listings into PostgreSQL every 15 minutes.

**Files to create/modify:**
- [NEW] src/app/api/admin/mri/sync/route.ts — POST (manual sync trigger)
- [NEW] src/app/api/cron/mri-sync/route.ts — Vercel Cron handler
- [MODIFY] vercel.json — Add cron: {"path": "/api/cron/mri-sync", "schedule": "*/15 * * * *"}
- [MODIFY] src/app/(public)/buy/page.tsx — Fetch from DB (Prisma) not mock
- [MODIFY] src/app/(public)/rent/page.tsx — Fetch rentals from DB
- [MODIFY] src/app/(public)/property/[slug]/page.tsx — Fetch property detail from DB

---

### 2.4 Fix Property Detail Page

**Problem**: Clicking a property listing card does not open the property detail page (reported bug).
**Root cause**: Slug mismatch between listing cards and dynamic route [slug].

**Files to modify:**
- [MODIFY] src/app/(public)/property/[slug]/page.tsx — Fix slug resolution, add 404 handling
- [MODIFY] Property listing card components — Ensure href uses consistent slug format
- [MODIFY] src/lib/properties/ — Add generatePropertySlug() utility used everywhere

---

### 2.5 Admin Panel — Live Data Wiring

**Problem**: All admin pages show static mock arrays (leads, properties, inspections, appraisals).
**Solution**: Replace mock data with Prisma queries. Add pagination, search, filters.

**Files to modify:**
- [MODIFY] src/app/(admin)/admin/leads/page.tsx — prisma.lead.findMany() with filters
- [MODIFY] src/app/(admin)/admin/properties/page.tsx — prisma.property.findMany() with search
- [MODIFY] src/app/(admin)/admin/appraisals/page.tsx — prisma.lead.findMany({ leadType: APPRAISAL })
- [MODIFY] src/app/(admin)/admin/inspections/page.tsx — prisma.propertyInspection.findMany()
- [MODIFY] src/app/(admin)/admin/dashboard/page.tsx — Live KPI counts from Prisma aggregations

**New API routes needed:**
- [NEW] src/app/api/admin/leads/route.ts — CRUD for leads
- [NEW] src/app/api/admin/properties/route.ts — Property management
- [NEW] src/app/api/admin/inspections/route.ts — Inspection CRUD

---

## PHASE 3 — Customer Portal & Agent Tools
> Estimated effort: 2 days.

---

### 3.1 Customer Portal — Live Functionality

**Problem**: Saved Searches, Favourites, Inspections, Profile pages are static UI only.
**Solution**: Wire to Prisma CustomerProfile, Favourite, SavedSearch, RecentlyViewed models.

**Files to modify:**
- [MODIFY] src/app/(customer)/customer/favourites/page.tsx — Live from DB
- [MODIFY] src/app/(customer)/customer/saved-searches/page.tsx — Live management
- [MODIFY] src/app/(customer)/customer/inspections/page.tsx — From Appointment model
- [MODIFY] src/app/(customer)/customer/profile/page.tsx — Real update form
- [NEW] src/app/api/customer/favourites/route.ts — Add/remove favourites
- [NEW] src/app/api/customer/saved-searches/route.ts — CRUD saved searches

---

### 3.2 Saved Search Email Alerts

**Problem**: Customers save searches but never get notified of new matching listings.
**Solution**: Daily cron job matching new listings to saved search criteria.

**Files to create:**
- [NEW] src/app/api/cron/saved-search-alerts/route.ts — Daily: match listings -> send email
- [MODIFY] vercel.json — Add cron: {"path": "/api/cron/saved-search-alerts", "schedule": "0 8 * * *"}

---

### 3.3 Agent Productivity Bar on Leads

**Problem**: Leads page has no quick-action buttons for agents.
**Solution**: Add Agent Action Bar to lead detail drawer.

**Files to modify:**
- [MODIFY] src/app/(admin)/admin/leads/page.tsx — Add action bar with:
    - Add to Apple Contacts -> GET /api/contacts/[id]/vcard (.vcf download)
    - Schedule Appointment -> Create Appointment + .ics download
    - Send FLK Agreement -> Document creation modal
    - Sync to Google/MS -> Trigger contact sync

---

## PHASE 4 — Polish & Growth Features
> Nice-to-have upgrades. Estimated effort: 2-3 days.

---

### 4.1 Homepass -> Inspections Integration

**Problem**: Homepass webhook fires but doesn't create leads or sync attendees.

**Files to modify:**
- [MODIFY] src/app/api/webhooks/homepass/route.ts — Wire visitor.checkin -> prisma.lead.upsert()
- [MODIFY] src/app/(admin)/admin/inspections/page.tsx — Homepass attendee count badge
- [NEW] Action: "Export All Attendees (.vcf)" bulk vCard download

---

### 4.2 CoreLogic Intelligence in Appraisals

**Problem**: Appraisals page has no property intelligence panel.

**Files to modify:**
- [MODIFY] src/app/(admin)/admin/appraisals/page.tsx — Add "View RP Data Report" button
- [MODIFY] src/app/api/admin/appraisals/route.ts — Auto-fetch CoreLogicProvider.getPropertyReport()
- Data stored in PropertyInsight model, shown in appraisal detail panel

---

### 4.3 FLK Documents -> Lead Auto-Link

**Problem**: FLK webhook fires on signing but doesn't update Document model or notify agent.

**Files to modify:**
- [MODIFY] src/app/api/webhooks/flk/route.ts — Full status update via Prisma
- [NEW] src/lib/email/templates/document-signed.tsx — Agent notification email

---

### 4.4 SEO & Dynamic Sitemap

**Problem**: Sitemap is static. Active property and suburb pages are not included.

**Files to modify:**
- [MODIFY] src/app/sitemap.ts — Fetch all active listing slugs from DB
- [MODIFY] src/app/(public)/property/[slug]/page.tsx — generateMetadata() with property SEO
- [MODIFY] src/app/(public)/suburb/[slug]/page.tsx — generateMetadata() for suburb SEO

---

### 4.5 Stripe — Premium Listing Features (Optional)

**Files to create:**
- [NEW] src/app/api/stripe/checkout/route.ts — Stripe Checkout session
- [NEW] src/app/api/stripe/webhook/route.ts — Payment webhook handler
- [NEW] src/lib/stripe.ts — Stripe singleton
- [MODIFY] src/app/(admin)/admin/properties/[id]/page.tsx — "Boost Listing" button

  Environment Variables:
    STRIPE_SECRET_KEY=sk_live_...
    STRIPE_WEBHOOK_SECRET=whsec_...
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

---

## Recommended Implementation Order

  Week 1 — Foundation:
    Phase 1.1 — Real Database (Neon)
    Phase 1.2 — Authentication (NextAuth v5)
    Phase 1.3 — Vercel Environment Variables

  Week 2 — Core:
    Phase 2.1 — Lead Capture -> Live DB
    Phase 2.2 — Email Notifications (Resend)
    Phase 2.4 — Fix Property Detail Page
    Phase 2.5 — Admin Panel Live Data

  Week 3 — Platform:
    Phase 2.3 — MRI Vault Live Sync + Cron
    Phase 3.1 — Customer Portal Live
    Phase 3.3 — Agent Action Bar on Leads

  Week 4 — Polish:
    Phase 3.2 — Saved Search Email Alerts
    Phase 4.1 — Homepass -> Inspections
    Phase 4.2 — CoreLogic in Appraisals
    Phase 4.3 — FLK Document Auto-Link
    Phase 4.4 — SEO & Dynamic Sitemap

---

## Tech Stack Additions

  Neon (neon.tech)           - Serverless PostgreSQL  - Free tier
  NextAuth v5 (authjs.dev)   - Authentication         - Free
  Resend (resend.com)        - Transactional email    - Free (3k/mo)
  React Email                - Email templates        - Free
  Stripe (stripe.com)        - Payments (optional)    - % of transactions

---

## Security Checklist

  [ ] All admin routes protected by NextAuth middleware
  [ ] All API routes validate session server-side before executing
  [ ] Webhook routes verify HMAC signatures before processing
  [ ] CoreLogic data enforces INTERNAL_ONLY visibility at all times
  [ ] Integration credentials AES-256 encrypted in IntegrationProviderConfig
  [ ] Rate limiting on public API routes (/api/leads, /api/enquiries)
  [ ] NEXTAUTH_SECRET is a cryptographically random 32-byte secret
  [ ] No secrets committed to Git (.env.local in .gitignore)
  [ ] Prisma queries use parameterized inputs (no raw SQL injection risk)
