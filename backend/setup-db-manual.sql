-- Setup Guardian Route Database
-- Run this with: psql -U postgres -f setup-db-manual.sql

-- Create user
CREATE USER guardian_admin WITH PASSWORD 'guardian_password_2024';

-- Create database
CREATE DATABASE guardian_route WITH OWNER guardian_admin;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE guardian_route TO guardian_admin;

-- Connect to database and enable PostGIS
\c guardian_route

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify PostGIS
SELECT PostGIS_Version();

-- Show success message
\echo 'Database setup complete!'
