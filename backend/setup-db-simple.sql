-- Simple setup for guardian_admin
-- This will be executed via Prisma

-- Create user (if running as postgres)
CREATE USER guardian_admin WITH PASSWORD 'guardian_password_2024';

-- Create database
CREATE DATABASE guardian_route WITH OWNER guardian_admin;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE guardian_route TO guardian_admin;
