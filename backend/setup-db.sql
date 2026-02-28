-- Guardian Route Database Setup
-- Run this with: psql -U postgres -f setup-db.sql

-- Create user if not exists
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'guardian_admin') THEN
      CREATE USER guardian_admin WITH PASSWORD 'guardian_password_2024';
   END IF;
END
$do$;

-- Create database if not exists
SELECT 'CREATE DATABASE guardian_route'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'guardian_route')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE guardian_route TO guardian_admin;

-- Connect to guardian_route database
\c guardian_route

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO guardian_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO guardian_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO guardian_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO guardian_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO guardian_admin;

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

\echo 'Database setup complete!'
