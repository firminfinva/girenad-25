const fs = require('fs');
const { Pool } = require('pg');

function loadEnv() {
  const envPath = '.env';
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) {
      let val = m[2];
      // strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[m[1]] = val;
    }
  }
  return env;
}

(async () => {
  try {
    const env = loadEnv();
    const connectionString = env.DATABASE_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('DATABASE_URL not found in .env or env');
      process.exit(1);
    }

    const pool = new Pool({ connectionString });
    const client = await pool.connect();

    try {
      // Use quoted identifiers for camelCase columns
      const res = await client.query('SELECT id, title, "pdfUrl", "applicationDocuments" FROM job_offers LIMIT 5');
      console.log('Rows:', res.rowCount);
      console.dir(res.rows, { depth: null });

      const cols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='job_offers'");
      console.log('\nColumns for job_offers:');
      console.table(cols.rows);
    } finally {
      client.release();
      await pool.end();
    }
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
})();