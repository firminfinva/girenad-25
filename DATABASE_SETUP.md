# PostgreSQL Database Setup Guide

## Current Configuration
Your `.env` file is configured to use:
- **Database**: `girenad`
- **User**: `postgres`
- **Password**: `postgres`
- **Host**: `localhost`
- **Port**: `5432`

## Setup Steps

### Option 1: Set PostgreSQL Password (Recommended)

If your PostgreSQL `postgres` user doesn't have the password `postgres`, you need to set it:

1. **Open PowerShell as Administrator**

2. **Connect to PostgreSQL** (you'll be prompted for the current password):
   ```powershell
   psql -U postgres
   ```

3. **Set the password**:
   ```sql
   ALTER USER postgres WITH PASSWORD 'postgres';
   \q
   ```

4. **Or use this one-liner** (replace `current_password` with your actual password):
   ```powershell
   $env:PGPASSWORD="current_password"; psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
   ```

### Option 2: Update .env with Your Current Password

If you know your PostgreSQL password, update the `.env` file:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/girenad?schema=public
```

### Option 3: Create Database Using pgAdmin

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases" → "Create" → "Database"
4. Name it `girenad`
5. Click "Save"

### After Database Setup

Once the database connection is working:

1. **Generate Prisma Client**:
   ```powershell
   npm run db:generate
   ```

2. **Push the schema to database**:
   ```powershell
   npm run db:push
   ```

   Or create a migration:
   ```powershell
   npm run db:migrate
   ```

## Troubleshooting

### PostgreSQL Service Not Running
Start the PostgreSQL service:
```powershell
# Find the service name
Get-Service | Where-Object { $_.DisplayName -like "*postgres*" }

# Start it (replace with actual service name)
net start postgresql-x64-16
```

### Authentication Failed
- Verify the password is correct
- Check `pg_hba.conf` file (usually in PostgreSQL data directory)
- Ensure PostgreSQL is configured to accept local connections

### Database Already Exists
If the database already exists, Prisma will update the schema. No action needed.

