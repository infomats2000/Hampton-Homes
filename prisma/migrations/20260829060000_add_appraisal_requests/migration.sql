CREATE TYPE "AppraisalStatus" AS ENUM ('NEW', 'ASSIGNED', 'SCHEDULED', 'COMPLETED', 'ARCHIVED');

CREATE TABLE "AppraisalRequest" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "assignedAgentId" TEXT,
    "appointmentId" TEXT,
    "address" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'NSW',
    "postcode" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL DEFAULT 0,
    "bathrooms" INTEGER NOT NULL DEFAULT 0,
    "sellingTimeframe" TEXT NOT NULL,
    "status" "AppraisalStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AppraisalRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AppraisalRequest_leadId_key" ON "AppraisalRequest"("leadId");
CREATE UNIQUE INDEX "AppraisalRequest_appointmentId_key" ON "AppraisalRequest"("appointmentId");
CREATE INDEX "AppraisalRequest_status_createdAt_idx" ON "AppraisalRequest"("status", "createdAt");
CREATE INDEX "AppraisalRequest_assignedAgentId_idx" ON "AppraisalRequest"("assignedAgentId");

ALTER TABLE "AppraisalRequest" ADD CONSTRAINT "AppraisalRequest_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AppraisalRequest" ADD CONSTRAINT "AppraisalRequest_assignedAgentId_fkey" FOREIGN KEY ("assignedAgentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
