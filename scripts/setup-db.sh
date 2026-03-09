#!/bin/bash

# Database Setup Script for CMS
# This script helps you set up the PostgreSQL database

echo "=== CMS Database Setup ==="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your DATABASE_URL"
    exit 1
fi

# Extract DATABASE_URL from .env.local
DATABASE_URL=$(grep DATABASE_URL .env.local | cut -d '=' -f2 | tr -d '"')

if [ -z "$DATABASE_URL" ] || [ "$DATABASE_URL" = "postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/cms?schema=public" ]; then
    echo "⚠️  Please update DATABASE_URL in .env.local with your actual PostgreSQL password"
    echo ""
    echo "Current format should be:"
    echo "DATABASE_URL=\"postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/cms?schema=public\""
    exit 1
fi

echo "Testing database connection..."
echo ""

# Test connection
npx prisma db push --skip-generate 2>&1 | head -20

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database connection successful!"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm run db:generate"
    echo "2. Run: npm run db:push (if not already done)"
    echo "3. Run: npm run db:seed (to create admin user)"
else
    echo ""
    echo "❌ Database connection failed!"
    echo ""
    echo "Common issues:"
    echo "1. Wrong password - Update DATABASE_URL in .env.local"
    echo "2. Database doesn't exist - Create it with: CREATE DATABASE cms;"
    echo "3. PostgreSQL not running - Start PostgreSQL service"
    echo ""
    echo "To create the database manually:"
    echo "  psql -U postgres -h localhost"
    echo "  CREATE DATABASE cms;"
    echo "  \\q"
fi
