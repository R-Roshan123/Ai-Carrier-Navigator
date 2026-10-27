-- =====================================================================
-- Career Roadmap & Certification Tracker
-- Run AFTER schema.sql (needs the users table). Idempotent: safe to re-run.
-- All feature tables are prefixed career_ to avoid clashing with the
-- existing careers / jobs tables.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Extend existing users table (no existing columns are changed)
-- ---------------------------------------------------------------------
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_role_check') THEN
    ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));
  END IF;
END $$;

-- Keeps updated_at current on every UPDATE of the career_ tables
CREATE OR REPLACE FUNCTION career_set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------
-- Job roles
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS career_job_roles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(160) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  skills TEXT[] NOT NULL DEFAULT '{}',
  tools TEXT[] NOT NULL DEFAULT '{}',
  experience_level VARCHAR(20) NOT NULL DEFAULT 'Entry'
    CHECK (experience_level IN ('Entry', 'Mid', 'Senior')),
  salary_india VARCHAR(100),
  salary_global VARCHAR(100),
  demand_level VARCHAR(20) NOT NULL DEFAULT 'High'
    CHECK (demand_level IN ('Low', 'Medium', 'High', 'Very High')),
  growth_outlook TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_roles_category ON career_job_roles (category);
CREATE INDEX IF NOT EXISTS idx_career_roles_experience ON career_job_roles (experience_level);
CREATE INDEX IF NOT EXISTS idx_career_roles_demand ON career_job_roles (demand_level);

CREATE TABLE IF NOT EXISTS career_related_roles (
  role_id INTEGER NOT NULL REFERENCES career_job_roles(id) ON DELETE CASCADE,
  related_role_id INTEGER NOT NULL REFERENCES career_job_roles(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, related_role_id),
  CHECK (role_id <> related_role_id)
);

-- ---------------------------------------------------------------------
-- Companies
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS career_companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  locations TEXT[] NOT NULL DEFAULT '{}',
  company_type VARCHAR(20) NOT NULL
    CHECK (company_type IN ('MNC', 'Product', 'Service', 'Startup')),
  website TEXT,
  careers_url TEXT,
  hiring_process TEXT,
  package_range VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_companies_type ON career_companies (company_type);

CREATE TABLE IF NOT EXISTS career_company_roles (
  company_id INTEGER NOT NULL REFERENCES career_companies(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES career_job_roles(id) ON DELETE CASCADE,
  PRIMARY KEY (company_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_career_company_roles_role ON career_company_roles (role_id);

-- ---------------------------------------------------------------------
-- Certifications (master list)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS career_certifications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  provider VARCHAR(100) NOT NULL,
  level VARCHAR(20) NOT NULL DEFAULT 'Beginner'
    CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  cost VARCHAR(150),
  is_free BOOLEAN NOT NULL DEFAULT FALSE,
  validity VARCHAR(100),
  exam_details TEXT,
  official_url TEXT NOT NULL,
  importance VARCHAR(20) NOT NULL DEFAULT 'Recommended'
    CHECK (importance IN ('Recommended', 'Optional', 'Highly Valued')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (name, provider)
);

CREATE INDEX IF NOT EXISTS idx_career_certs_provider ON career_certifications (provider);
CREATE INDEX IF NOT EXISTS idx_career_certs_level ON career_certifications (level);
CREATE INDEX IF NOT EXISTS idx_career_certs_importance ON career_certifications (importance);

CREATE TABLE IF NOT EXISTS career_certification_roles (
  certification_id INTEGER NOT NULL REFERENCES career_certifications(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES career_job_roles(id) ON DELETE CASCADE,
  PRIMARY KEY (certification_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_career_cert_roles_role ON career_certification_roles (role_id);

-- ---------------------------------------------------------------------
-- Roadmaps: one ordered list of stages per role, each with ordered steps.
-- Steps keep stable ids so user progress survives roadmap edits.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS career_roadmap_stages (
  id SERIAL PRIMARY KEY,
  role_id INTEGER NOT NULL REFERENCES career_job_roles(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  stage_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_stages_role ON career_roadmap_stages (role_id, stage_order);

CREATE TABLE IF NOT EXISTS career_roadmap_steps (
  id SERIAL PRIMARY KEY,
  stage_id INTEGER NOT NULL REFERENCES career_roadmap_stages(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  topics TEXT[] NOT NULL DEFAULT '{}',
  skills TEXT[] NOT NULL DEFAULT '{}',
  -- [{ "title": "...", "url": "https://...", "type": "Course|Docs|Video|Article|Practice|Book", "isFree": true }]
  resources JSONB NOT NULL DEFAULT '[]'::jsonb,
  projects TEXT[] NOT NULL DEFAULT '{}',
  estimated_hours INTEGER NOT NULL DEFAULT 10 CHECK (estimated_hours > 0),
  step_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_steps_stage ON career_roadmap_steps (stage_id, step_order);

CREATE TABLE IF NOT EXISTS career_step_certifications (
  step_id INTEGER NOT NULL REFERENCES career_roadmap_steps(id) ON DELETE CASCADE,
  certification_id INTEGER NOT NULL REFERENCES career_certifications(id) ON DELETE CASCADE,
  PRIMARY KEY (step_id, certification_id)
);

-- ---------------------------------------------------------------------
-- Per-user data
-- ---------------------------------------------------------------------
-- A user's target roles (max 3, enforced in the API). created_at = "started at".
CREATE TABLE IF NOT EXISTS career_user_target_roles (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES career_job_roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_career_target_roles_role ON career_user_target_roles (role_id);

-- Step status per user. A step belongs to exactly one role, so progress for
-- (user, role) is the set of rows whose step is in that role's roadmap.
CREATE TABLE IF NOT EXISTS career_user_step_progress (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  step_id INTEGER NOT NULL REFERENCES career_roadmap_steps(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'Not Started'
    CHECK (status IN ('Not Started', 'In Progress', 'Completed')),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, step_id)
);

CREATE INDEX IF NOT EXISTS idx_career_step_progress_step ON career_user_step_progress (step_id);

CREATE TABLE IF NOT EXISTS career_user_certificates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  certification_id INTEGER REFERENCES career_certifications(id) ON DELETE SET NULL,
  custom_name VARCHAR(200),
  issuer VARCHAR(200) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_id VARCHAR(200),
  credential_url TEXT,
  -- Storage key relative to the upload dir; files are served only through the
  -- authenticated /api/career/certificates/:id/file endpoint, never statically.
  file_path TEXT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  original_name VARCHAR(255),
  file_size INTEGER,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending'
    CHECK (status IN ('Pending', 'Verified', 'Rejected')),
  admin_remark TEXT,
  verified_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CHECK (certification_id IS NOT NULL OR custom_name IS NOT NULL),
  CHECK (expiry_date IS NULL OR expiry_date >= issue_date)
);

CREATE INDEX IF NOT EXISTS idx_career_user_certs_user ON career_user_certificates (user_id);
CREATE INDEX IF NOT EXISTS idx_career_user_certs_status ON career_user_certificates (status, created_at);
CREATE INDEX IF NOT EXISTS idx_career_user_certs_cert ON career_user_certificates (certification_id);

-- ---------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'career_job_roles', 'career_companies', 'career_certifications',
    'career_roadmap_stages', 'career_roadmap_steps',
    'career_user_step_progress', 'career_user_certificates'
  ] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = t || '_set_updated_at'
    ) THEN
      EXECUTE format(
        'CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION career_set_updated_at()',
        t || '_set_updated_at', t
      );
    END IF;
  END LOOP;
END $$;
