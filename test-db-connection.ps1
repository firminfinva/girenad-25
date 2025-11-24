# Test PostgreSQL Connection Script
Write-Host "=== Testing PostgreSQL Connection ===" -ForegroundColor Cyan
Write-Host ""

# Read DATABASE_URL from .env
$envContent = Get-Content .env
$dbUrl = $envContent | Where-Object { $_ -match "^DATABASE_URL=" } | ForEach-Object { $_ -replace "DATABASE_URL=", "" }

if (-not $dbUrl) {
    Write-Host "ERROR: DATABASE_URL not found in .env file" -ForegroundColor Red
    exit 1
}

Write-Host "Connection string from .env:" -ForegroundColor Yellow
Write-Host $dbUrl -ForegroundColor Gray
Write-Host ""

# Parse connection string
if ($dbUrl -match "postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)") {
    $username = $matches[1]
    $password = $matches[2]
    $dbHost = $matches[3]
    $port = $matches[4]
    $database = $matches[5]
    
    Write-Host "Parsed connection details:" -ForegroundColor Yellow
    Write-Host "  Host: $dbHost" -ForegroundColor White
    Write-Host "  Port: $port" -ForegroundColor White
    Write-Host "  User: $username" -ForegroundColor White
    Write-Host "  Database: $database" -ForegroundColor White
    Write-Host ""
    
    # Test connection to postgres database first
    Write-Host "Testing connection to postgres database..." -ForegroundColor Yellow
    $env:PGPASSWORD = $password
    $testResult = psql -U $username -h $dbHost -p $port -d postgres -c "SELECT version();" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Connection successful!" -ForegroundColor Green
        Write-Host ""
        
        # Check if girenad database exists
        Write-Host "Checking if girenad database exists..." -ForegroundColor Yellow
        $dbCheck = psql -U $username -h $dbHost -p $port -d postgres -t -c "SELECT 1 FROM pg_database WHERE datname = 'girenad';" 2>&1
        
        if ($dbCheck -match "1") {
            Write-Host "Database girenad already exists" -ForegroundColor Green
        } else {
            Write-Host "Creating girenad database..." -ForegroundColor Yellow
            $createResult = psql -U $username -h $dbHost -p $port -d postgres -c "CREATE DATABASE girenad;" 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Database girenad created successfully!" -ForegroundColor Green
            } else {
                Write-Host "Failed to create database" -ForegroundColor Red
                Write-Host $createResult -ForegroundColor Red
                exit 1
            }
        }
        
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "  1. Run: npm run db:generate" -ForegroundColor White
        Write-Host "  2. Run: npm run db:push" -ForegroundColor White
        
    } else {
        Write-Host "Connection failed!" -ForegroundColor Red
        Write-Host $testResult -ForegroundColor Red
        Write-Host ""
        Write-Host "Possible solutions:" -ForegroundColor Yellow
        Write-Host "  1. Verify PostgreSQL service is running" -ForegroundColor White
        Write-Host "  2. Check if the password is correct" -ForegroundColor White
        Write-Host "  3. Update the DATABASE_URL in .env with correct credentials" -ForegroundColor White
        exit 1
    }
} else {
    Write-Host "ERROR: Could not parse DATABASE_URL" -ForegroundColor Red
    exit 1
}
