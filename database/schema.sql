CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  education VARCHAR(255),
  department VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Account details collected at signup. Students fill the student columns, admins the staff columns.
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(30);
ALTER TABLE users ADD COLUMN IF NOT EXISTS register_number VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS college VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS year_of_study VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS staff_id VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS designation VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization VARCHAR(255);
CREATE UNIQUE INDEX IF NOT EXISTS users_register_number_key ON users (LOWER(register_number)) WHERE register_number IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS users_staff_id_key ON users (LOWER(staff_id)) WHERE staff_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  phone VARCHAR(50),
  location VARCHAR(255),
  degree VARCHAR(255),
  college VARCHAR(255),
  graduation_year INTEGER,
  cgpa DECIMAL(4,2),
  skills JSONB,
  interests JSONB,
  experience JSONB,
  achievements JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS careers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  overview TEXT,
  responsibilities TEXT[],
  skills TEXT[],
  education VARCHAR(255),
  salary VARCHAR(255),
  demand VARCHAR(255),
  growth VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  answers JSONB,
  recommendations JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  company VARCHAR(255),
  location VARCHAR(255),
  work_type VARCHAR(100),
  experience VARCHAR(100),
  salary VARCHAR(255),
  description TEXT,
  match_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(255),
  position VARCHAR(255),
  date DATE,
  salary VARCHAR(255),
  status VARCHAR(50),
  notes TEXT,
  interview_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  message TEXT,
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
