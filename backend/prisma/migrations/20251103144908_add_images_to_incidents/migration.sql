-- AlterTable
ALTER TABLE "incidents" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
