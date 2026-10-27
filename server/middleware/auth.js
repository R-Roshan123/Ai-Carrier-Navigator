import jwt from 'jsonwebtoken';
import pool, { dbState } from '../config/db.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized. Missing token.' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
  } catch {
    return res.status(401).json({ message: 'Not authorized. Invalid token.' });
  }

  // When the database is available, verify the user still exists.
  // This rejects tokens issued before the JWT_SECRET was rotated that happen
  // to verify (same secret) but belong to a user that no longer exists, as
  // well as tokens from the old in-memory auth store.
  if (dbState.connected) {
    try {
      const { rows } = await pool.query(
        'SELECT id, role FROM users WHERE id = $1',
        [decoded.id],
      );
      if (!rows[0]) {
        return res.status(401).json({ message: 'Session no longer valid. Please log in again.' });
      }
      // Refresh the role from DB so promotions/demotions take effect immediately.
      decoded.role = rows[0].role;
    } catch (error) {
      // DB query failed unexpectedly – fail closed.
      console.error(`Auth check failed: ${error.message}`);
      return res.status(503).json({ message: 'The database is temporarily unreachable. Please try again in a moment.' });
    }
  }

  req.user = decoded;
  next();
};

// Use after `protect`. The role is re-read from the database so promotions and
// demotions take effect immediately instead of when the token expires.
// NOTE: `protect` already refreshes `req.user.role` from the DB when connected,
// so this middleware now only adds the guard when `protect` ran without DB
// access (mock-data mode) or is used on a route that needs an explicit admin check.
export const requireAdmin = async (req, res, next) => {
  let role = req.user?.role;
  if (dbState.connected) {
    const { rows } = await pool.query('SELECT role FROM users WHERE id = $1', [req.user?.id]);
    role = rows[0]?.role;
  }

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
};
