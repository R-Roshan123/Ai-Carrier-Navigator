import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const users = [];

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '7d',
  });

export const registerUser = async (req, res) => {
  const { name, email, password, education, department } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    name,
    email,
    passwordHash,
    education: education || '',
    department: department || '',
  };

  users.push(newUser);

  res.status(201).json({
    message: 'User registered successfully.',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      education: newUser.education,
      department: newUser.department,
    },
    token: generateToken(newUser),
  });
};

export const loginUser = async (req, res) => {
  const { username, email, password } = req.body;
  const identifier = username || email;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const normalizedIdentifier = identifier.trim().toLowerCase();
  const user = users.find((candidate) => candidate.email.toLowerCase() === normalizedIdentifier || candidate.name.trim().toLowerCase() === normalizedIdentifier);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  res.json({
    message: 'Login successful.',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      education: user.education,
      department: user.department,
    },
    token: generateToken(user),
  });
};

export default { registerUser, loginUser };
