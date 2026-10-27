// Applies database/schema.sql and database/career_schema.sql in order.
// Both files are idempotent (IF NOT EXISTS), so this is safe to re-run.
// Usage: npm run db:setup
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pool from '../config/db.js';

const databaseDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../database');
const SQL_FILES = ['schema.sql', 'career_schema.sql'];

const run = async () => {
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
