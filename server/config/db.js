import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/career_navigator',
  ssl:
    process.env.NODE_ENV === 'production' || process.env.SUPABASE_URL
      ? { rejectUnauthorized: false }
      : false,
  max: 20,
});

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
      'PostgreSQL is not available. Continuing in mock-data mode for setup and UI validation.',
    );
    return false;
  }
};

export default pool;
