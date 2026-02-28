-- ========================================
-- Guardian Route - Database Setup Script
-- ========================================
-- Date: November 13, 2025
-- Phase: 1 - Database Setup
-- Duration: ~5 minutes
-- ========================================

-- Step 1: Create Database
-- Run this as PostgreSQL superuser (postgres)
-- ========================================

-- Create the database
CREATE DATABASE guardian_route;

-- Create the user
CREATE USER guardian_admin WITH PASSWORD 'guardian_password_2024';

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE guardian_route TO guardian_admin;

-- ========================================
-- Step 2: Enable PostGIS Extension
-- Connect to guardian_route database first: \c guardian_route
-- ========================================

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify PostGIS installation
SELECT PostGIS_Version();

-- ========================================
-- Step 3: Grant Schema Permissions
-- ========================================

-- Grant usage on public schema
GRANT USAGE ON SCHEMA public TO guardian_admin;

-- Grant create on public schema
GRANT CREATE ON SCHEMA public TO guardian_admin;

-- Grant all privileges on all tables in public schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO guardian_admin;

-- Grant all privileges on all sequences in public schema
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO guardian_admin;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO guardian_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO guardian_admin;

-- ========================================
-- Verification Queries
-- ========================================

-- Check database exists
SELECT datname FROM pg_database WHERE datname = 'guardian_route';

-- Check user exists
SELECT usename FROM pg_user WHERE usename = 'guardian_admin';

-- Check PostGIS version
SELECT PostGIS_Version();

-- Check extensions
SELECT * FROM pg_extension WHERE extname = 'postgis';

-- ========================================
-- Success Message
-- ========================================
-- If all queries above return results, database setup is complete!
-- Next steps:
-- 1. Update backend/.env with DATABASE_URL
-- 2. Run: npx prisma migrate dev
-- 3. Run: npx prisma db seed
-- ========================================
