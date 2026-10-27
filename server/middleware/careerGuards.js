import pool, { dbState } from '../config/db.js';

// The career module needs real persistence; respond clearly in mock-data mode.
export const requireDatabase = (req, res, next) => {
  if (!dbState.connected) {
    return res.status(503).json({
      message:
        'Career Roadmap features need a PostgreSQL database. Set DATABASE_URL, run `npm run db:setup` and `npm run seed:career`, then restart the server.',
    });
  }
  next();
};

// Use after `protect` + `requireDatabase`.
// `protect` already validates the user exists and refreshes req.user.role when
// the DB is connected.  This middleware is kept as an explicit belt-and-suspenders
// guard on career routes: if for any reason req.user.role is stale it re-reads it.
export const requireCareerUser = async (req, res, next) => {
  const { rows } = await pool.query('SELECT id, role FROM users WHERE id = $1', [req.user?.id]);
  if (!rows[0]) {
    return res.status(401).json({ message: 'Your session is no longer valid. Please log in again.' });
  }
  req.user.role = rows[0].role;
  next();
};

