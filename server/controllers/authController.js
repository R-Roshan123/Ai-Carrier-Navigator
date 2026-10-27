import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool, { dbState } from '../config/db.js';

// Used only when PostgreSQL is unavailable (mock-data mode). Accounts here are
// lost on restart; with a database connected, users are stored in `users`.
const memoryUsers = [];

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'user' },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' },
  );

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  education: user.education || '',
  department: user.department || '',
  role: user.role || 'user',
});

const findUserByEmail = async (email) => {
  if (!dbState.connected) {
    return memoryUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
  }
  const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
  return rows[0];
};

// Login accepts either email or name; an email match wins over a name match.
const findUserByIdentifier = async (identifier) => {
  if (!dbState.connected) {
    return memoryUsers.find(
      (user) => user.email.toLowerCase() === identifier || user.name.trim().toLowerCase() === identifier,
    );
  }
  const { rows } = await pool.query(
    `SELECT * FROM users
     WHERE LOWER(email) = $1 OR LOWER(TRIM(name)) = $1
     ORDER BY (LOWER(email) = $1) DESC, id ASC
     LIMIT 1`,
    [identifier],
  );
  return rows[0];
};

const createUser = async ({ name, email, passwordHash, education, department }) => {
  if (!dbState.connected) {
    const user = {
      id: memoryUsers.length + 1,
      name,
      email,
      password_hash: passwordHash,
      education,
      department,
      role: 'user',
    };
    memoryUsers.push(user);
    return user;
  }
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash, education, department)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, email, passwordHash, education, department],
  );
  return rows[0];
};

export const registerUser = async (req, res) => {
  const { name, email, password, education, department } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  let newUser;
  try {
    newUser = await createUser({
      name,
      email,
      passwordHash,
      education: education || '',
      department: department || '',
    });
  } catch (error) {
    // Unique violation on email from a concurrent registration
    if (error.code === '23505') {
      return res.status(400).json({ message: 'User already exists.' });
    }
    throw error;
  }

  res.status(201).json({
    message: 'User registered successfully.',
    user: toPublicUser(newUser),
    token: generateToken(newUser),
  });
};

export const loginUser = async (req, res) => {
  const { username, email, password } = req.body;
  const identifier = username || email;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const user = await findUserByIdentifier(identifier.trim().toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  res.json({
    message: 'Login successful.',
    user: toPublicUser(user),
    token: generateToken(user),
  });
};

export default { registerUser, loginUser };
