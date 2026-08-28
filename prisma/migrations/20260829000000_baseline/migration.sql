-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "SystemRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MARKETING_ADMIN', 'OFFICE_MANAGER', 'AGENT', 'SUPPORT', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('DRAFT', 'COMING_SOON', 'FOR_SALE', 'FOR_RENT', 'AUCTION', 'UNDER_OFFER', 'UNDER_CONTRACT', 'SOLD', 'LEASED', 'WITHDRAWN', 'OFF_MARKET');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('RESIDENTIAL_SALE', 'RESIDENTIAL_RENT', 'COMMERCIAL_SALE', 'COMMERCIAL_RENT', 'PROJECT');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'ASSIGNED', 'CONTACTED', 'QUALIFIED', 'APPOINTMENT_BOOKED', 'APPRAISAL_COMPLETED', 'NEGOTIATING', 'WON', 'LOST', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('BUYER', 'SELLER', 'TENANT', 'LANDLORD', 'APPRAISAL', 'PROPERTY_ENQUIRY', 'INSPECTION', 'COMMERCIAL', 'GENERAL');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'WARNING', 'FAILED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('PHOTO', 'FLOORPLAN', 'VIDEO', 'VIRTUAL_TOUR', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "IntegrationStatus" AS ENUM ('CONNECTED', 'DEGRADED', 'DISCONNECTED', 'PENDING_SETUP');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'SIGNED', 'COMPLETED', 'DECLINED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('APPRAISAL', 'INSPECTION', 'VIEWING', 'AUCTION', 'FOLLOW_UP', 'MEETING');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "PropertyInsightVisibility" AS ENUM ('INTERNAL_ONLY', 'AGENT_ONLY', 'MANAGEMENT_ONLY');

-- CreateEnum
CREATE TYPE "WebhookEventStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "ContactMatchAction" AS ENUM ('PENDING', 'MERGED', 'KEPT_SEPARATE', 'DISMISSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "CustomerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferences" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Office" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'NSW',
    "postcode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT,
    "isHeadOffice" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "bio" TEXT,
    "photoUrl" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "position" TEXT NOT NULL DEFAULT 'Sales Agent',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "streetNumber" TEXT,
    "streetName" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'NSW',
    "postcode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Australia',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "carSpaces" INTEGER,
    "landAreaSqm" DOUBLE PRECISION,
    "buildingAreaSqm" DOUBLE PRECISION,
    "propertyType" TEXT NOT NULL,
    "mriId" TEXT,
    "mriProvider" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "listingType" "ListingType" NOT NULL DEFAULT 'RESIDENTIAL_SALE',
    "status" "PropertyStatus" NOT NULL DEFAULT 'FOR_SALE',
    "headline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceDisplay" TEXT NOT NULL,
    "priceNumeric" DOUBLE PRECISION,
    "auctionDate" TIMESTAMP(3),
    "auctionLocation" TEXT,
    "availableDate" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyAgent" (
    "listingId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PropertyAgent_pkey" PRIMARY KEY ("listingId","agentId")
);

-- CreateTable
CREATE TABLE "PropertyMedia" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL DEFAULT 'PHOTO',
    "title" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyFeature" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "featureName" TEXT NOT NULL,
    "category" TEXT,

    CONSTRAINT "PropertyFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyInspection" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyInspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyWebsiteOverride" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "customHeadline" TEXT,
    "customBadge" TEXT,
    "isFeaturedHomepage" BOOLEAN NOT NULL DEFAULT false,
    "isFeaturedSearch" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyWebsiteOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalEntityMapping" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "internalId" TEXT NOT NULL,
    "propertyId" TEXT,
    "externalUpdatedAt" TIMESTAMP(3),
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncHash" TEXT,

    CONSTRAINT "ExternalEntityMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncJob" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "status" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "recordsProcessed" INTEGER NOT NULL DEFAULT 0,
    "recordsUpdated" INTEGER NOT NULL DEFAULT 0,
    "recordsFailed" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,

    CONSTRAINT "SyncJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "syncJobId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncError" (
    "id" TEXT NOT NULL,
    "syncJobId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "errorMessage" TEXT NOT NULL,
    "rawPayload" JSONB,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncError_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "leadType" "LeadType" NOT NULL DEFAULT 'PROPERTY_ENQUIRY',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "source" TEXT NOT NULL DEFAULT 'WEBSITE',
    "notes" TEXT,
    "officeId" TEXT,
    "agentId" TEXT,
    "propertyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadActivity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "leadId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "mriPushed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favourite" (
    "id" TEXT NOT NULL,
    "customerProfileId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favourite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedSearch" (
    "id" TEXT NOT NULL,
    "customerProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "alertFrequency" TEXT NOT NULL DEFAULT 'DAILY',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecentlyViewed" (
    "id" TEXT NOT NULL,
    "customerProfileId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentlyViewed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "actorEmail" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "previousValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "correlationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'GENERAL',
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationProviderConfig" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "status" "IntegrationStatus" NOT NULL DEFAULT 'PENDING_SETUP',
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "credentialsMasked" JSONB,
    "credentialsEnc" TEXT,
    "featureFlags" JSONB DEFAULT '{}',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "lastHealthCheckAt" TIMESTAMP(3),
    "lastSyncAt" TIMESTAMP(3),
    "webhookUrl" TEXT,
    "webhookSecret" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationProviderConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalAccountConnection" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalUserId" TEXT,
    "externalEmail" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalAccountConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactExternalLink" (
    "id" TEXT NOT NULL,
    "internalType" TEXT NOT NULL,
    "internalId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactExternalLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarConnection" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "calendarId" TEXT,
    "calendarName" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "syncDirection" TEXT NOT NULL DEFAULT 'BIDIRECTIONAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalCalendarEvent" (
    "id" TEXT NOT NULL,
    "calendarConnectionId" TEXT NOT NULL,
    "internalAppointmentId" TEXT,
    "externalEventId" TEXT NOT NULL,
    "externalProvider" TEXT NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalCalendarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "type" "AppointmentType" NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "locationAddress" TEXT,
    "propertyId" TEXT,
    "agentId" TEXT,
    "leadId" TEXT,
    "homepassEventId" TEXT,
    "icsExported" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "propertyId" TEXT,
    "agentId" TEXT,
    "leadId" TEXT,
    "signerName" TEXT,
    "signerEmail" TEXT,
    "sentAt" TIMESTAMP(3),
    "viewedAt" TIMESTAMP(3),
    "signedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentExternalLink" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "externalUrl" TEXT,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentExternalLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyInsight" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT,
    "addressFull" TEXT NOT NULL,
    "suburb" TEXT,
    "state" TEXT,
    "postcode" TEXT,
    "estimatedValue" DOUBLE PRECISION,
    "estimatedValueLow" DOUBLE PRECISION,
    "estimatedValueHigh" DOUBLE PRECISION,
    "lastSaleDate" TIMESTAMP(3),
    "lastSalePrice" DOUBLE PRECISION,
    "daysOnMarket" INTEGER,
    "comparableSales" JSONB,
    "rentalEstimate" DOUBLE PRECISION,
    "landValue" DOUBLE PRECISION,
    "zoning" TEXT,
    "visibility" "PropertyInsightVisibility" NOT NULL DEFAULT 'INTERNAL_ONLY',
    "source" TEXT NOT NULL DEFAULT 'CORELOGIC',
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "rawResponse" JSONB,

    CONSTRAINT "PropertyInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "status" "WebhookEventStatus" NOT NULL DEFAULT 'RECEIVED',
    "correlationId" TEXT,
    "signatureValid" BOOLEAN,
    "rawPayload" JSONB NOT NULL,
    "processedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMatchCandidate" (
    "id" TEXT NOT NULL,
    "primaryType" TEXT NOT NULL,
    "primaryId" TEXT NOT NULL,
    "matchType" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "matchScore" DOUBLE PRECISION NOT NULL,
    "matchReason" TEXT,
    "action" "ContactMatchAction" NOT NULL DEFAULT 'PENDING',
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMatchCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE INDEX "Permission_code_idx" ON "Permission"("code");

-- CreateIndex
CREATE INDEX "RolePermission_roleId_idx" ON "RolePermission"("roleId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE INDEX "UserRole_userId_idx" ON "UserRole"("userId");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_userId_key" ON "CustomerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Office_slug_key" ON "Office"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_userId_key" ON "Agent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Property_mriId_key" ON "Property"("mriId");

-- CreateIndex
CREATE INDEX "Property_suburb_state_postcode_idx" ON "Property"("suburb", "state", "postcode");

-- CreateIndex
CREATE INDEX "Property_mriId_idx" ON "Property"("mriId");

-- CreateIndex
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");

-- CreateIndex
CREATE INDEX "Property_createdAt_idx" ON "Property"("createdAt");

-- CreateIndex
CREATE INDEX "Listing_status_listingType_idx" ON "Listing"("status", "listingType");

-- CreateIndex
CREATE INDEX "Listing_propertyId_idx" ON "Listing"("propertyId");

-- CreateIndex
CREATE INDEX "Listing_priceNumeric_idx" ON "Listing"("priceNumeric");

-- CreateIndex
CREATE INDEX "Listing_publishedAt_idx" ON "Listing"("publishedAt");

-- CreateIndex
CREATE INDEX "Listing_createdAt_idx" ON "Listing"("createdAt");

-- CreateIndex
CREATE INDEX "PropertyAgent_listingId_idx" ON "PropertyAgent"("listingId");

-- CreateIndex
CREATE INDEX "PropertyAgent_agentId_idx" ON "PropertyAgent"("agentId");

-- CreateIndex
CREATE INDEX "PropertyMedia_propertyId_mediaType_idx" ON "PropertyMedia"("propertyId", "mediaType");

-- CreateIndex
CREATE INDEX "PropertyMedia_propertyId_isPrimary_idx" ON "PropertyMedia"("propertyId", "isPrimary");

-- CreateIndex
CREATE INDEX "PropertyMedia_propertyId_displayOrder_idx" ON "PropertyMedia"("propertyId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyWebsiteOverride_propertyId_key" ON "PropertyWebsiteOverride"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalEntityMapping_provider_entityType_externalId_key" ON "ExternalEntityMapping"("provider", "entityType", "externalId");

-- CreateIndex
CREATE INDEX "Lead_status_createdAt_idx" ON "Lead"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_agentId_idx" ON "Lead"("agentId");

-- CreateIndex
CREATE INDEX "Lead_officeId_idx" ON "Lead"("officeId");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Enquiry_listingId_idx" ON "Enquiry"("listingId");

-- CreateIndex
CREATE INDEX "Enquiry_leadId_idx" ON "Enquiry"("leadId");

-- CreateIndex
CREATE INDEX "Favourite_customerProfileId_idx" ON "Favourite"("customerProfileId");

-- CreateIndex
CREATE INDEX "Favourite_propertyId_idx" ON "Favourite"("propertyId");

-- CreateIndex
CREATE INDEX "SavedSearch_customerProfileId_idx" ON "SavedSearch"("customerProfileId");

-- CreateIndex
CREATE INDEX "RecentlyViewed_customerProfileId_idx" ON "RecentlyViewed"("customerProfileId");

-- CreateIndex
CREATE INDEX "RecentlyViewed_propertyId_idx" ON "RecentlyViewed"("propertyId");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_actorEmail_idx" ON "AuditLog"("actorEmail");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

-- CreateIndex
CREATE INDEX "Setting_category_idx" ON "Setting"("category");

-- CreateIndex
CREATE INDEX "Setting_isPublic_idx" ON "Setting"("isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationProviderConfig_provider_key" ON "IntegrationProviderConfig"("provider");

-- CreateIndex
CREATE INDEX "IntegrationProviderConfig_provider_idx" ON "IntegrationProviderConfig"("provider");

-- CreateIndex
CREATE INDEX "IntegrationProviderConfig_status_idx" ON "IntegrationProviderConfig"("status");

-- CreateIndex
CREATE INDEX "ExternalAccountConnection_agentId_idx" ON "ExternalAccountConnection"("agentId");

-- CreateIndex
CREATE INDEX "ExternalAccountConnection_provider_idx" ON "ExternalAccountConnection"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalAccountConnection_agentId_provider_key" ON "ExternalAccountConnection"("agentId", "provider");

-- CreateIndex
CREATE INDEX "ContactExternalLink_internalId_idx" ON "ContactExternalLink"("internalId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactExternalLink_internalType_internalId_provider_key" ON "ContactExternalLink"("internalType", "internalId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarConnection_agentId_provider_key" ON "CalendarConnection"("agentId", "provider");

-- CreateIndex
CREATE INDEX "ExternalCalendarEvent_internalAppointmentId_idx" ON "ExternalCalendarEvent"("internalAppointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalCalendarEvent_calendarConnectionId_externalEventId_key" ON "ExternalCalendarEvent"("calendarConnectionId", "externalEventId");

-- CreateIndex
CREATE INDEX "Appointment_type_status_idx" ON "Appointment"("type", "status");

-- CreateIndex
CREATE INDEX "Appointment_propertyId_idx" ON "Appointment"("propertyId");

-- CreateIndex
CREATE INDEX "Appointment_agentId_idx" ON "Appointment"("agentId");

-- CreateIndex
CREATE INDEX "Appointment_startTime_idx" ON "Appointment"("startTime");

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "Document"("status");

-- CreateIndex
CREATE INDEX "Document_propertyId_idx" ON "Document"("propertyId");

-- CreateIndex
CREATE INDEX "Document_agentId_idx" ON "Document"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentExternalLink_documentId_provider_key" ON "DocumentExternalLink"("documentId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentExternalLink_provider_externalId_key" ON "DocumentExternalLink"("provider", "externalId");

-- CreateIndex
CREATE INDEX "PropertyInsight_propertyId_idx" ON "PropertyInsight"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyInsight_addressFull_idx" ON "PropertyInsight"("addressFull");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_correlationId_key" ON "WebhookEvent"("correlationId");

-- CreateIndex
CREATE INDEX "WebhookEvent_provider_eventType_idx" ON "WebhookEvent"("provider", "eventType");

-- CreateIndex
CREATE INDEX "WebhookEvent_status_idx" ON "WebhookEvent"("status");

-- CreateIndex
CREATE INDEX "WebhookEvent_createdAt_idx" ON "WebhookEvent"("createdAt");

-- CreateIndex
CREATE INDEX "ContactMatchCandidate_action_idx" ON "ContactMatchCandidate"("action");

-- CreateIndex
CREATE INDEX "ContactMatchCandidate_primaryId_idx" ON "ContactMatchCandidate"("primaryId");

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAgent" ADD CONSTRAINT "PropertyAgent_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAgent" ADD CONSTRAINT "PropertyAgent_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyMedia" ADD CONSTRAINT "PropertyMedia_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyFeature" ADD CONSTRAINT "PropertyFeature_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyInspection" ADD CONSTRAINT "PropertyInspection_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyWebsiteOverride" ADD CONSTRAINT "PropertyWebsiteOverride_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalEntityMapping" ADD CONSTRAINT "ExternalEntityMapping_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncLog" ADD CONSTRAINT "SyncLog_syncJobId_fkey" FOREIGN KEY ("syncJobId") REFERENCES "SyncJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncError" ADD CONSTRAINT "SyncError_syncJobId_fkey" FOREIGN KEY ("syncJobId") REFERENCES "SyncJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSearch" ADD CONSTRAINT "SavedSearch_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentlyViewed" ADD CONSTRAINT "RecentlyViewed_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalCalendarEvent" ADD CONSTRAINT "ExternalCalendarEvent_calendarConnectionId_fkey" FOREIGN KEY ("calendarConnectionId") REFERENCES "CalendarConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentExternalLink" ADD CONSTRAINT "DocumentExternalLink_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
