-- =====================================================================
-- In-app courses: lesson progress and completion certificates.
-- Run AFTER schema.sql (needs the users table). Idempotent: safe to re-run.
-- Course and lesson ids are slugs from shared/courseContent.js.
-- =====================================================================

CREATE TABLE IF NOT EXISTS course_lesson_progress (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_slug VARCHAR(100) NOT NULL,
  lesson_id VARCHAR(50) NOT NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, course_slug, lesson_id)
);

CREATE TABLE IF NOT EXISTS course_certificates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_slug VARCHAR(100) NOT NULL,
  course_title VARCHAR(150) NOT NULL,
  certificate_code VARCHAR(30) UNIQUE NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  issued_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_slug)
);

CREATE INDEX IF NOT EXISTS idx_course_certificates_user ON course_certificates (user_id);
