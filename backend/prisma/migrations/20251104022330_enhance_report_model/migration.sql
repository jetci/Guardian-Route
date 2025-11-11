/*
  Warnings:

  - You are about to drop the column `affected_area` on the `surveys` table. All the data in the column will be lost.
  - You are about to drop the column `affected_houses` on the `surveys` table. All the data in the column will be lost.
  - You are about to drop the column `affected_people` on the `surveys` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `surveys` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_damage` on the `surveys` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `surveys` table. All the data in the column will be lost.
  - You are about to drop the column `photo_urls` on the `surveys` table. All the data in the column will be lost.
  - You are about to drop the column `surveyed_at` on the `surveys` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `surveys` table. All the data in the column will be lost.
  - Added the required column `created_by_id` to the `surveys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `template_id` to the `surveys` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SurveyStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "reports" ALTER COLUMN "incident_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "surveys" DROP COLUMN "affected_area",
DROP COLUMN "affected_houses",
DROP COLUMN "affected_people",
DROP COLUMN "created_at",
DROP COLUMN "estimated_damage",
DROP COLUMN "notes",
DROP COLUMN "photo_urls",
DROP COLUMN "surveyed_at",
DROP COLUMN "updated_at",
ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "polygon" JSONB,
ADD COLUMN     "status" "SurveyStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "template_id" TEXT NOT NULL,
ALTER COLUMN "incident_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "survey_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fields" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "survey_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_responses" (
    "id" TEXT NOT NULL,
    "survey_id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_by_id" TEXT NOT NULL,

    CONSTRAINT "survey_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "survey_responses_survey_id_idx" ON "survey_responses"("survey_id");

-- CreateIndex
CREATE INDEX "survey_responses_submitted_by_id_idx" ON "survey_responses"("submitted_by_id");

-- CreateIndex
CREATE INDEX "surveys_template_id_idx" ON "surveys"("template_id");

-- CreateIndex
CREATE INDEX "surveys_created_by_id_idx" ON "surveys"("created_by_id");

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "survey_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_submitted_by_id_fkey" FOREIGN KEY ("submitted_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
