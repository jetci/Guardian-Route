-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ReportStatus" ADD VALUE 'GENERATING';
ALTER TYPE "ReportStatus" ADD VALUE 'READY';
ALTER TYPE "ReportStatus" ADD VALUE 'ERROR';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ReportType" ADD VALUE 'INCIDENT_SUMMARY';
ALTER TYPE "ReportType" ADD VALUE 'TASK_PROGRESS';
ALTER TYPE "ReportType" ADD VALUE 'SURVEY_RESULTS';
ALTER TYPE "ReportType" ADD VALUE 'MONTHLY_SUMMARY';

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "content" JSONB,
ADD COLUMN     "survey_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "task_ids" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "report_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,
    "description" TEXT,
    "structure" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "report_templates_type_idx" ON "report_templates"("type");

-- CreateIndex
CREATE INDEX "report_templates_is_active_idx" ON "report_templates"("is_active");
