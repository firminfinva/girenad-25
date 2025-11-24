# PostgreSQL Database Setup Script for Girenad
# This script helps set up the local PostgreSQL database

Write-Host "=== Girenad PostgreSQL Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
Write-Host "Checking PostgreSQL installation..." -ForegroundColor Yellow
$psqlVersion = psql --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: PostgreSQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install PostgreSQL from https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}
Write-Host "PostgreSQL found: $psqlVersion" -ForegroundColor Green
Write-Host ""

# Prompt for PostgreSQL superuser password
Write-Host "Please enter your PostgreSQL superuser (postgres) password:" -ForegroundColor Yellow
$securePassword = Read-Host -AsSecureString
$password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

# Set password as environment variable
$env:PGPASSWORD = $password

Write-Host ""
Write-Host "Attempting to connect to PostgreSQL..." -ForegroundColor Yellow

# Try to connect and create database
$createDbQuery = @"
SELECT 1 FROM pg_database WHERE datname = 'girenad'
"@

$dbExists = psql -U postgres -h localhost -p 5432 -d postgres -t -c $createDbQuery 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Could not connect to PostgreSQL" -ForegroundColor Red
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "  1. PostgreSQL service is not running" -ForegroundColor Yellow
    Write-Host "  2. Incorrect password" -ForegroundColor Yellow
    Write-Host "  3. PostgreSQL is not configured to accept connections" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To start PostgreSQL service, run:" -ForegroundColor Cyan
    Write-Host "  net start postgresql-x64-16" -ForegroundColor White
    Write-Host "  (or check your PostgreSQL service name)" -ForegroundColor Gray
    exit 1
}

if ($dbExists -match "1") {
    Write-Host "Database 'girenad' already exists" -ForegroundColor Green
} else {
    Write-Host "Creating database 'girenad'..." -ForegroundColor Yellow
    psql -U postgres -h localhost -p 5432 -d postgres -c "CREATE DATABASE girenad;" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database 'girenad' created successfully!" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Failed to create database" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Updating .env file with the correct password..." -ForegroundColor Yellow

# Update .env file with the provided password
$envContent = Get-Content .env -Raw
$newDatabaseUrl = "postgresql://postgres:$password@localhost:5432/girenad?schema=public"
$envContent = $envContent -replace 'DATABASE_URL=.*', "DATABASE_URL=$newDatabaseUrl"
$envContent | Set-Content .env -NoNewline

Write-Host ".env file updated!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm run db:push" -ForegroundColor White
Write-Host "  2. Run: npm run db:generate" -ForegroundColor White
Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green

