#!/bin/bash

# Guardian Route - User Seeder Script
# This script seeds the database with default users for development and testing

echo "🌱 Guardian Route - User Seeder"
echo "================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
  echo "❌ Error: .env file not found"
  echo "Please create .env file with DATABASE_URL"
  exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL not set in .env"
  exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔄 Running user seeder..."
npx ts-node prisma/seed-users.ts

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ User seeding completed successfully!"
  echo ""
  echo "📌 You can now login with any of the seeded accounts"
  echo "   Password for all accounts: Password123!"
else
  echo ""
  echo "❌ User seeding failed"
  exit 1
fi
