#!/bin/bash

# This script updates .env.local after you've manually reset the PostgreSQL password

NEW_PASSWORD="Hkes6A4DKyrNfuQS7R3A"

echo "=== Updating .env.local with new password ==="
echo ""

if [ ! -f .env.local ]; then
    echo "Creating .env.local..."
    cat > .env.local << ENVEOF
# Database
DATABASE_URL="postgresql://postgres:$NEW_PASSWORD@localhost:5432/cms?schema=public"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Public URL for sitemap
NEXT_PUBLIC_URL="http://localhost:3000"
ENVEOF
else
    echo "Updating .env.local..."
    sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://postgres:$NEW_PASSWORD@localhost:5432/cms?schema=public\"|" .env.local
fi

echo "✅ .env.local updated!"
echo ""
echo "Your new PostgreSQL password: $NEW_PASSWORD"
echo ""
echo "Next steps:"
echo "1. Test connection: psql -U postgres -h localhost -d postgres"
echo "2. Create database: psql -U postgres -h localhost -d postgres -c 'CREATE DATABASE cms;'"
echo "3. Run: npm run db:generate"
echo "4. Run: npm run db:push"
echo "5. Run: npm run db:seed"
