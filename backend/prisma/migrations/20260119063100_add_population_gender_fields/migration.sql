-- Add population gender fields to villages table
ALTER TABLE "villages" ADD COLUMN IF NOT EXISTS "population_female" INTEGER;
ALTER TABLE "villages" ADD COLUMN IF NOT EXISTS "population_male" INTEGER;
