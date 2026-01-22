-- AlterEnum: Add DROUGHT to DisasterType enum
ALTER TYPE "DisasterType" ADD VALUE IF NOT EXISTS 'DROUGHT';
