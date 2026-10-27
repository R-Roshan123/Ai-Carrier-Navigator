// Creates the database if it does not exist yet, then applies database/schema.sql and
// database/career_schema.sql and database/course_schema.sql in order. Both files are idempotent (IF NOT EXISTS), so this is safe to re-run.
// Usage: npm run db:setup
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import pool, { connectionString, sslConfig } from '../config/db.js';

const databaseDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../database');
const SQL_FILES = ['schema.sql', 'career_schema.sql', 'course_schema.sql'];

// CREATE DATABASE cannot run inside the target database, so connect to the default `postgres` one.
const ensureDatabaseExists = async () => {
  const url = new URL(connectionString);
  const name = decodeURIComponent(url.pathname.slice(1));
  url.pathname = '/postgres';
  const client = new pg.Client({ connectionString: url.toString(), ssl: sslConfig });
  await client.connect();
  try {
    const { rowCount } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [name]);
    if (!rowCount) {
      await client.query(`CREATE DATABASE "${name.replace(/"/g, '""')}"`);
      console.log(`Created database ${name}`);
    }
  } finally {
    await client.end();
  }
};

const run = async () => {
  await ensureDatabaseExists().catch((error) => {
    // Hosted databases (e.g. Supabase) already exist and may not allow this; carry on.
    console.warn(`Could not check or create the database: ${error.message}`);
  });
  for (const file of SQL_FILES) {
    const sql = await readFile(path.join(databaseDir, file), 'utf8');
    await pool.query(sql);
    console.log(`Applied ${file}`);
  }
};

run()
  .then(() => console.log('Database setup complete.'))
  .catch((error) => {
    console.error('Database setup failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
