-- CreateTable
CREATE TABLE "job_offers" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "referenceNumber" TEXT,
    "contractType" TEXT,
    "vacanciesCount" INTEGER,
    "location" TEXT,
    "duration" TEXT,
    "recruitmentType" TEXT,
    "startDate" TEXT,
    "organizationDescription" TEXT,
    "projectDescription" TEXT,
    "positionObjective" TEXT,
    "responsibilities" JSONB,
    "requirements" JSONB,
    "applicationDocuments" JSONB,
    "submissionDeadline" TIMESTAMP(3),
    "submissionEmail" TEXT,
    "emailSubjectFormat" TEXT,
    "pdfUrl" TEXT,

    CONSTRAINT "job_offers_pkey" PRIMARY KEY ("id")
);

