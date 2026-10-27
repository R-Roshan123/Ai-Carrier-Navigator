import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool, { connectDB, dbState } from '../config/db.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

// Fields each account type must provide at signup (request body names).
const REQUIRED_FIELDS = {
  student: { name: 'Full name', email: 'Email', password: 'Password', registerNumber: 'Register number', college: 'College', education: 'Degree / course', department: 'Department', yearOfStudy: 'Year of study' },
  admin: { name: 'Full name', email: 'Email', password: 'Password', staffId: 'Staff ID', designation: 'Designation', organization: 'Organization' },
};

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
  phone: user.phone || '',
  education: user.education || '',
  department: user.department || '',
  registerNumber: user.register_number || '',
  college: user.college || '',
  yearOfStudy: user.year_of_study || '',
  staffId: user.staff_id || '',
  designation: user.designation || '',
  organization: user.organization || '',
  role: user.role || 'user',
});

// Accounts must survive restarts, so auth never falls back to memory. If the server started
// before PostgreSQL was up, try connecting again before giving up.
const ensureDatabase = async () => dbState.connected || connectDB();

const databaseUnavailable = (res) =>
  res.status(503).json({ message: 'The account database is not available right now. Please try again shortly.' });

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

// Compares digests so the check takes the same time whatever the input length.
const matchesSecret = (input, secret) =>
  crypto.timingSafeEqual(
    crypto.createHash('sha256').update(String(input)).digest(),
    crypto.createHash('sha256').update(String(secret)).digest(),
  );

const findUserByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
  return rows[0];
};

// Register numbers and staff IDs identify one person, so they must be unique too.
const findUserByColumn = async (column, value) => {
  if (!value) return null;
  const { rows } = await pool.query(`SELECT id FROM users WHERE LOWER(${column}) = LOWER($1)`, [value]);
  return rows[0];
};

// Login accepts either email or name; an email match wins over a name match.
const findUserByIdentifier = async (identifier) => {
  const { rows } = await pool.query(
    `SELECT * FROM users
     WHERE LOWER(email) = $1 OR LOWER(TRIM(name)) = $1
     ORDER BY (LOWER(email) = $1) DESC, id ASC
     LIMIT 1`,
    [identifier],
  );
  return rows[0];
};

const createUser = async (fields) => {
  const columns = Object.keys(fields);
  const { rows } = await pool.query(
    `INSERT INTO users (${columns.join(', ')})
     VALUES (${columns.map((_, index) => `$${index + 1}`).join(', ')})
     RETURNING *`,
    Object.values(fields),
  );
  return rows[0];
};

export const registerUser = async (req, res) => {
  const accountType = req.body.accountType === 'admin' ? 'admin' : 'student';
  const body = Object.fromEntries(Object.entries(req.body || {}).map(([key, value]) => [key, key === 'password' ? value : clean(value)]));

  const missing = Object.entries(REQUIRED_FIELDS[accountType]).filter(([key]) => !body[key]).map(([, label]) => label);
  if (missing.length) {
    return res.status(400).json({ message: `Please fill in: ${missing.join(', ')}.` });
  }
  if (!EMAIL_PATTERN.test(body.email)) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }
  if (typeof body.password !== 'string' || body.password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
  }

  if (!(await ensureDatabase())) return databaseUnavailable(res);

  if (accountType === 'admin') {
    // Admin signup is only open to people who have the code configured on the server.
    const adminCode = process.env.ADMIN_SIGNUP_CODE;
    if (!adminCode) {
      return res.status(403).json({ message: 'Admin registration is disabled. Ask an existing admin to grant you access.' });
    }
    if (!body.adminCode || !matchesSecret(body.adminCode, adminCode)) {
      return res.status(403).json({ message: 'Invalid admin access code.' });
    }
  }

  if (await findUserByEmail(body.email)) {
    return res.status(400).json({ message: 'An account with this email already exists.' });
  }
  if (accountType === 'student' && (await findUserByColumn('register_number', body.registerNumber))) {
    return res.status(400).json({ message: 'An account with this register number already exists.' });
  }
  if (accountType === 'admin' && (await findUserByColumn('staff_id', body.staffId))) {
    return res.status(400).json({ message: 'An account with this staff ID already exists.' });
  }

  const common = {
    name: body.name,
    email: body.email,
    password_hash: await bcrypt.hash(body.password, 10),
    phone: body.phone || null,
    department: body.department || '',
    role: accountType === 'admin' ? 'admin' : 'user',
  };
  const details =
    accountType === 'admin'
      ? { staff_id: body.staffId, designation: body.designation, organization: body.organization }
      : { register_number: body.registerNumber, college: body.college, education: body.education, year_of_study: body.yearOfStudy };

  let newUser;
  try {
    newUser = await createUser({ ...common, ...details });
  } catch (error) {
    // Unique violation from a concurrent registration
    if (error.code === '23505') {
      return res.status(400).json({ message: 'An account with these details already exists.' });
    }
    throw error;
  }

  // No token here: the new account signs in through its login page like any other.
  res.status(201).json({
    message: 'Account created successfully. Please log in.',
    user: toPublicUser(newUser),
  });
};

export const loginUser = async (req, res) => {
  const { username, email, password } = req.body;
  const portal = req.body.portal === 'admin' ? 'admin' : 'student';
  const identifier = username || email;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  if (!(await ensureDatabase())) return databaseUnavailable(res);

  const user = await findUserByIdentifier(identifier.trim().toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  // Each portal only signs in its own account type.
  const isAdmin = user.role === 'admin';
  if (portal === 'admin' && !isAdmin) {
    return res.status(403).json({ message: 'This is a student account. Please use the student login.' });
  }
  if (portal === 'student' && isAdmin) {
    return res.status(403).json({ message: 'This is an admin account. Please use the admin login.' });
  }

  res.json({
    message: 'Login successful.',
    user: toPublicUser(user),
    token: generateToken(user),
  });
};

export default { registerUser, loginUser };
