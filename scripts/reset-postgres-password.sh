#!/bin/bash

# PostgreSQL Password Reset Helper Script
# This script helps you reset the postgres user password

NEW_PASSWORD="Hkes6A4DKyrNfuQS7R3A"
PG_HBA_PATH="/Library/PostgreSQL/16/data/pg_hba.conf"

echo "=== PostgreSQL Password Reset ==="
echo ""
echo "Generated new password: $NEW_PASSWORD"
echo ""

# Check if pg_hba.conf exists
if [ ! -f "$PG_HBA_PATH" ]; then
    echo "⚠️  Could not find pg_hba.conf at $PG_HBA_PATH"
    echo "Please find your PostgreSQL data directory and update the script."
    exit 1
fi

echo "This script will:"
echo "1. Backup pg_hba.conf"
echo "2. Temporarily allow passwordless connections"
echo "3. Reset the postgres password"
echo "4. Restore pg_hba.conf security"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

# Backup pg_hba.conf
echo "📋 Backing up pg_hba.conf..."
sudo cp "$PG_HBA_PATH" "${PG_HBA_PATH}.backup.$(date +%Y%m%d_%H%M%S)"

# Modify pg_hba.conf to allow trust for local connections
echo "🔧 Temporarily modifying pg_hba.conf..."
sudo sed -i.bak 's/^\(local.*all.*all.*\)md5/\1trust/' "$PG_HBA_PATH"
sudo sed -i.bak 's/^\(local.*all.*all.*\)scram-sha-256/\1trust/' "$PG_HBA_PATH"
sudo sed -i.bak 's/^\(host.*all.*all.*127\.0\.0\.1.*\)md5/\1trust/' "$PG_HBA_PATH"
sudo sed -i.bak 's/^\(host.*all.*all.*127\.0\.0\.1.*\)scram-sha-256/\1trust/' "$PG_HBA_PATH"
sudo sed -i.bak 's/^\(host.*all.*all.*::1.*\)md5/\1trust/' "$PG_HBA_PATH"
sudo sed -i.bak 's/^\(host.*all.*all.*::1.*\)scram-sha-256/\1trust/' "$PG_HBA_PATH"

echo "✅ pg_hba.conf modified"
echo ""
echo "🔄 Please reload PostgreSQL now:"
echo "   You can do this via:"
echo "   - System Preferences > PostgreSQL > Restart"
echo "   - Or: sudo launchctl unload ~/Library/LaunchAgents/com.edb.launchd.postgresql-*.plist"
echo "        sudo launchctl load ~/Library/LaunchAgents/com.edb.launchd.postgresql-*.plist"
echo ""
read -p "Press Enter after you've reloaded PostgreSQL..."

# Reset password
echo "🔑 Resetting password..."
if psql -U postgres -h localhost -c "ALTER USER postgres WITH PASSWORD '$NEW_PASSWORD';" 2>/dev/null; then
    echo "✅ Password reset successful!"
    
    # Restore pg_hba.conf
    echo "🔒 Restoring pg_hba.conf security..."
    sudo cp "${PG_HBA_PATH}.backup.$(date +%Y%m%d_%H%M%S)" "$PG_HBA_PATH" 2>/dev/null || \
    sudo cp "${PG_HBA_PATH}.backup" "$PG_HBA_PATH" 2>/dev/null || \
    sudo sed -i.bak 's/^\(local.*all.*all.*\)trust/\1md5/' "$PG_HBA_PATH" && \
    sudo sed -i.bak 's/^\(host.*all.*all.*127\.0\.0\.1.*\)trust/\1md5/' "$PG_HBA_PATH" && \
    sudo sed -i.bak 's/^\(host.*all.*all.*::1.*\)trust/\1md5/' "$PG_HBA_PATH"
    
    echo "🔄 Please reload PostgreSQL again to apply security settings..."
    read -p "Press Enter after you've reloaded PostgreSQL..."
    
    # Update .env.local
    if [ -f .env.local ]; then
        echo "📝 Updating .env.local..."
        sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://postgres:$NEW_PASSWORD@localhost:5432/cms?schema=public\"|" .env.local
        echo "✅ .env.local updated!"
    else
        echo "⚠️  .env.local not found, creating it..."
        cat > .env.local << ENVEOF
# Database
DATABASE_URL="postgresql://postgres:$NEW_PASSWORD@localhost:5432/cms?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Public URL for sitemap
NEXT_PUBLIC_URL="http://localhost:3000"
ENVEOF
        echo "✅ .env.local created!"
    fi
    
    echo ""
    echo "✅ All done! Your new PostgreSQL password is: $NEW_PASSWORD"
    echo "   (Saved in .env.local)"
    
else
    echo "❌ Failed to reset password. PostgreSQL might not be reloaded yet."
    echo "   Please reload PostgreSQL and try again, or reset manually."
    echo ""
    echo "   Manual reset command:"
    echo "   psql -U postgres -h localhost"
    echo "   ALTER USER postgres WITH PASSWORD '$NEW_PASSWORD';"
fi
