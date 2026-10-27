import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

export const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/career_navigator';

// A local PostgreSQL server usually has SSL turned off, so only hosted databases use it.
const isLocalDatabase = /@(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/.test(connectionString);

export const sslConfig =
  !isLocalDatabase && (process.env.NODE_ENV === 'production' || process.env.SUPABASE_URL)
    ? { rejectUnauthorized: false }
    : false;

const pool = new Pool({ connectionString, ssl: sslConfig, max: 20 });

// Read by features that need real persistence (auth, career module) to decide
// between PostgreSQL and mock-data mode.
export const dbState = { connected: false };

export const connectDB = async () => {
  try {
    await pool.query('SELECT 1');
    dbState.connected = true;
    console.log('PostgreSQL connected successfully.');
    return true;
  } catch (error) {
    dbState.connected = false;
    console.warn(
      `PostgreSQL is not available (${error.message}). Continuing in mock-data mode; sign up and login are disabled until the database is reachable.`,
    );
    return false;
  }
};

export default pool;
