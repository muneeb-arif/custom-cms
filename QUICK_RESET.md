# Quick PostgreSQL Password Reset

## Generated New Password
**Password:** `Hkes6A4DKyrNfuQS7R3A`

## Method 1: Interactive Reset (Easiest)

Run this command and when prompted for password, try:
- Press Enter (empty password)
- Or try common defaults: `postgres`, `admin`, `password`

```bash
psql -U postgres -h localhost
```

Once connected, run:
```sql
ALTER USER postgres WITH PASSWORD 'Hkes6A4DKyrNfuQS7R3A';
\q
```

## Method 2: Modify pg_hba.conf (If Method 1 doesn't work)

1. **Find pg_hba.conf:**
   ```bash
   sudo find /Library/PostgreSQL -name pg_hba.conf
   ```
   Usually at: `/Library/PostgreSQL/16/data/pg_hba.conf`

2. **Backup it:**
   ```bash
   sudo cp /Library/PostgreSQL/16/data/pg_hba.conf /Library/PostgreSQL/16/data/pg_hba.conf.backup
   ```

3. **Edit it:**
   ```bash
   sudo nano /Library/PostgreSQL/16/data/pg_hba.conf
   ```

4. **Find and change these lines:**
   Change `md5` or `scram-sha-256` to `trust` for local connections:
   ```
   # Change from:
   local   all             all                                     md5
   # To:
   local   all             all                                     trust
   
   # And:
   host    all             all             127.0.0.1/32            md5
   # To:
   host    all             all             127.0.0.1/32            trust
   ```

5. **Reload PostgreSQL:**
   - Via System Preferences: PostgreSQL > Restart
   - Or via command:
     ```bash
     sudo launchctl unload ~/Library/LaunchAgents/com.edb.launchd.postgresql-*.plist
     sudo launchctl load ~/Library/LaunchAgents/com.edb.launchd.postgresql-*.plist
     ```

6. **Reset password:**
   ```bash
   psql -U postgres -h localhost
   ALTER USER postgres WITH PASSWORD 'Hkes6A4DKyrNfuQS7R3A';
   \q
   ```

7. **Restore security (change `trust` back to `md5`):**
   ```bash
   sudo cp /Library/PostgreSQL/16/data/pg_hba.conf.backup /Library/PostgreSQL/16/data/pg_hba.conf
   # Reload PostgreSQL again
   ```

## After Reset

Once password is reset, update `.env.local`:

```env
DATABASE_URL="postgresql://postgres:Hkes6A4DKyrNfuQS7R3A@localhost:5432/cms?schema=public"
```

Then run:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```
