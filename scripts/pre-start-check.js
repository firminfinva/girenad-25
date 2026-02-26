const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const projectRoot = path.join(__dirname, '..');
const nextBuildDir = path.join(projectRoot, '.next');
const logsDir = path.join(projectRoot, 'logs');

// Required environment variables
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

// Console colors
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkLogsDirectory() {
  log('📁 Checking logs directory...', 'cyan');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    log('✅ Logs directory created', 'green');
  } else {
    log('✅ Logs directory exists', 'green');
  }
}

function checkBuildDirectory() {
  log('🔍 Checking production build...', 'cyan');
  
  if (!fs.existsSync(nextBuildDir)) {
    log('❌ ERROR: Production build (.next folder) is missing!', 'red');
    log('   Please run "npm run build" before starting the server.', 'yellow');
    log('');
    log('   To fix:', 'yellow');
    log('   1. Run: npm run build', 'yellow');
    log('   2. Then start with: pm2 start ecosystem.config.js', 'yellow');
    return false;
  }

  const buildFiles = fs.readdirSync(nextBuildDir);
  if (buildFiles.length === 0) {
    log('❌ ERROR: Production build (.next folder) is empty!', 'red');
    log('   Please run "npm run build" before starting the server.', 'yellow');
    return false;
  }

  log(`✅ Production build found! (${buildFiles.length} items)`, 'green');
  return true;
}

function checkEnvironmentVariables() {
  log('🔍 Checking environment variables...', 'cyan');
  
  const missingVars = [];
  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    log('❌ ERROR: Missing required environment variables:', 'red');
    missingVars.forEach(v => log(`   - ${v}`, 'red'));
    log('');
    log('   Please ensure these are set in your .env file:', 'yellow');
    return false;
  }

  log('✅ All required environment variables are set', 'green');
  return true;
}

async function checkDatabaseConnection() {
  log('🔍 Checking database connection...', 'cyan');
  
  // Create a temporary script to test database connection with the adapter
  const testScript = `
    const { PrismaClient } = require('@prisma/client');
    const { PrismaPg } = require('@prisma/adapter-pg');
    const { Pool } = require('pg');
    
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('DATABASE_URL not set');
      process.exit(1);
    }
    
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });
    
    async function test() {
      try {
        await prisma.$connect();
        console.log('SUCCESS');
        await prisma.$disconnect();
        pool.end();
        process.exit(0);
      } catch (e) {
        console.error(e.message);
        process.exit(1);
      }
    }
    test();
  `;
  
  const testScriptPath = path.join(projectRoot, 'scripts', 'db-test-temp.js');
  fs.writeFileSync(testScriptPath, testScript);
  
  return new Promise((resolve) => {
    const dbCheck = spawn('node', [testScriptPath], {
      cwd: projectRoot,
      stdio: 'pipe',
      env: { ...process.env }
    });

    let output = '';
    let errorOutput = '';

    dbCheck.stdout.on('data', (data) => {
      output += data.toString();
    });

    dbCheck.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    dbCheck.on('close', (code) => {
      // Clean up temp script
      try { fs.unlinkSync(testScriptPath); } catch (e) {}
      
      if (code === 0) {
        log('✅ Database connection successful', 'green');
        resolve(true);
      } else {
        log('❌ ERROR: Database connection failed!', 'red');
        log('   Please check your DATABASE_URL in .env', 'yellow');
        log(`   Error: ${errorOutput || output || 'Unknown error'}`, 'red');
        resolve(false);
      }
    });

    dbCheck.on('error', (err) => {
      // Clean up temp script
      try { fs.unlinkSync(testScriptPath); } catch (e) {}
      log('❌ ERROR: Could not run database check', 'red');
      log(`   Error: ${err.message}`, 'red');
      resolve(false);
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      dbCheck.kill();
      try { fs.unlinkSync(testScriptPath); } catch (e) {}
      log('⚠️  Database check timed out, continuing...', 'yellow');
      resolve(true);
    }, 10000);
  });
}

async function startServer() {
  log('', 'reset');
  log('🚀 Starting Next.js server...', 'green');
  log('', 'reset');

  const server = spawn('npx', ['next', 'start'], {
    cwd: projectRoot,
    stdio: 'inherit',
    env: { ...process.env }
  });

  // Graceful shutdown handling
  const shutdown = (signal) => {
    log(`\n⚠️  Received ${signal}, shutting down gracefully...`, 'yellow');
    server.kill('SIGTERM');
    setTimeout(() => {
      log('👋 Server stopped', 'cyan');
      process.exit(0);
    }, 5000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  server.on('error', (err) => {
    log(`❌ Failed to start Next.js server: ${err.message}`, 'red');
    process.exit(1);
  });

  server.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      log(`❌ Server exited with code ${code}`, 'red');
      process.exit(code);
    }
  });
}

async function main() {
  log('========================================', 'cyan');
  log('  Production Startup Check', 'cyan');
  log('========================================', 'cyan');
  log('');

  // Step 1: Create logs directory
  checkLogsDirectory();
  log('');

  // Step 2: Check build directory
  if (!checkBuildDirectory()) {
    process.exit(1);
  }
  log('');

  // Step 3: Check environment variables
  if (!checkEnvironmentVariables()) {
    process.exit(1);
  }
  log('');

  // Step 4: Check database connection
  const dbOk = await checkDatabaseConnection();
  if (!dbOk) {
    process.exit(1);
  }
  log('');

  // All checks passed, start server
  await startServer();
}

main().catch((err) => {
  log(`❌ Unexpected error: ${err.message}`, 'red');
  process.exit(1);
});
