-- AlterEnum: Add new report types
CREATE TYPE "ReportType" AS ENUM ('INCIDENT', 'TASK', 'SURVEY', 'MONTHLY', 'CUSTOM');

-- AlterTable: Add new fields to Report model
ALTER TABLE "reports" 
ADD COLUMN "type" "ReportType" NOT NULL DEFAULT 'INCIDENT',
ADD COLUMN "template_id" TEXT,
ADD COLUMN "period_start" TIMESTAMP(3),
ADD COLUMN "period_end" TIMESTAMP(3),
ADD COLUMN "metadata" JSONB,
ADD COLUMN "pdf_url" TEXT,
ADD COLUMN "pdf_generated_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "reports_type_idx" ON "reports"("type");
CREATE INDEX "reports_period_start_idx" ON "reports"("period_start");
CREATE INDEX "reports_created_at_idx" ON "reports"("created_at");

-- Add comment
COMMENT ON COLUMN "reports"."type" IS 'Type of report: INCIDENT, TASK, SURVEY, MONTHLY, or CUSTOM';
COMMENT ON COLUMN "reports"."template_id" IS 'Optional template identifier for custom reports';
COMMENT ON COLUMN "reports"."metadata" IS 'Additional metadata for report generation (filters, parameters, etc.)';
COMMENT ON COLUMN "reports"."pdf_url" IS 'URL to generated PDF file';
