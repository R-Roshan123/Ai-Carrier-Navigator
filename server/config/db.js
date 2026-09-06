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

export const connectDB = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected successfully.');
    return true;
  } catch (error) {
    console.warn(
      'PostgreSQL is not available. Continuing in mock-data mode for setup and UI validation.',
    );
    return false;
  }
};

export default pool;
