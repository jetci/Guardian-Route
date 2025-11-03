/*
  Warnings:

  - You are about to drop the column `village` on the `incidents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "incidents" DROP COLUMN "village",
ADD COLUMN     "village_id" TEXT;

-- AlterTable
ALTER TABLE "surveys" ADD COLUMN     "village_id" TEXT;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "village_id" TEXT;

-- CreateTable
CREATE TABLE "villages" (
    "id" TEXT NOT NULL,
    "village_no" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "alternate_names" TEXT[],
    "center_point" JSONB,
    "boundary" JSONB,
    "households" INTEGER,
    "population" INTEGER,
    "area" DECIMAL(10,2),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "villages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "villages_village_no_key" ON "villages"("village_no");

-- CreateIndex
CREATE INDEX "villages_village_no_idx" ON "villages"("village_no");

-- CreateIndex
CREATE INDEX "incidents_village_id_idx" ON "incidents"("village_id");

-- CreateIndex
CREATE INDEX "surveys_village_id_idx" ON "surveys"("village_id");

-- CreateIndex
CREATE INDEX "tasks_village_id_idx" ON "tasks"("village_id");

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "villages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "villages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "villages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
