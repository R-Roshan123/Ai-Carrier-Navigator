import jwt from 'jsonwebtoken';
import pool, { dbState } from '../config/db.js';

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized. Missing token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized. Invalid token.' });
  }
};

// Use after `protect`. The role is re-read from the database so promotions and
// demotions take effect immediately instead of when the token expires.
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
