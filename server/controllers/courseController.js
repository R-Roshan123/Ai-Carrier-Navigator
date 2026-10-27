import crypto from 'node:crypto';
import pool from '../config/db.js';
import { getCourse, gradeExam } from '../../shared/courseContent.js';
import { roadmapTopicIds } from '../../shared/roadmaps.js';

const mapCertificate = (row) => ({
  code: row.certificate_code,
  courseSlug: row.course_slug,
  courseTitle: row.course_title,
  score: row.score,
  issuedAt: row.issued_at,
  ...(row.student_name ? { studentName: row.student_name } : {}),
});

// e.g. ACN-7F3A9-C21DE: random, so certificates cannot be guessed from their number.
const newCertificateCode = () => {
  const hex = crypto.randomBytes(5).toString('hex').toUpperCase();
  return `ACN-${hex.slice(0, 5)}-${hex.slice(5)}`;
};

const completedLessons = async (userId, slug) => {
  const { rows } = await pool.query(
    'SELECT lesson_id FROM course_lesson_progress WHERE user_id = $1 AND course_slug = $2',
    [userId, slug],
  );
  return rows.map((row) => row.lesson_id);
};

const findCourseOr404 = (req, res) => {
  const course = getCourse(req.params.slug);
  if (!course) res.status(404).json({ message: 'Course not found.' });
  return course;
};

const groupBy = (rows, key, value) => {
  const grouped = {};
  for (const row of rows) (grouped[row[key]] ||= []).push(row[value]);
  return grouped;
};

const completedTopics = async (userId, slug) => {
  const { rows } = await pool.query(
    'SELECT topic_id FROM roadmap_topic_progress WHERE user_id = $1 AND role_slug = $2',
    [userId, slug],
  );
  return rows.map((row) => row.topic_id);
};

// GET /api/courses/progress: everything a user has done in courses and learning roadmaps,
// so every page can show it from one request.
export const getProgress = async (req, res) => {
  const [lessons, topics, certificates] = await Promise.all([
    pool.query('SELECT course_slug, lesson_id FROM course_lesson_progress WHERE user_id = $1', [req.user.id]),
    pool.query('SELECT role_slug, topic_id FROM roadmap_topic_progress WHERE user_id = $1', [req.user.id]),
    pool.query('SELECT * FROM course_certificates WHERE user_id = $1 ORDER BY issued_at DESC', [req.user.id]),
  ]);

  res.json({
    progress: groupBy(lessons.rows, 'course_slug', 'lesson_id'),
    roadmap: groupBy(topics.rows, 'role_slug', 'topic_id'),
    certificates: certificates.rows.map(mapCertificate),
  });
};

// PUT /api/courses/:slug/roadmap/:topicId marks a roadmap topic complete; DELETE unmarks it.
export const setTopicComplete = async (req, res) => {
  const course = findCourseOr404(req, res);
  if (!course) return;
  if (!roadmapTopicIds(course.slug).includes(req.params.topicId)) {
    return res.status(404).json({ message: 'Roadmap topic not found.' });
  }

  if (req.method === 'DELETE') {
    await pool.query(
      'DELETE FROM roadmap_topic_progress WHERE user_id = $1 AND role_slug = $2 AND topic_id = $3',
      [req.user.id, course.slug, req.params.topicId],
    );
  } else {
    await pool.query(
      `INSERT INTO roadmap_topic_progress (user_id, role_slug, topic_id) VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [req.user.id, course.slug, req.params.topicId],
    );
  }
  res.json({ completedTopics: await completedTopics(req.user.id, course.slug) });
};

// PUT /api/courses/:slug/lessons/:lessonId marks a lesson complete; DELETE unmarks it.
export const setLessonComplete = async (req, res) => {
  const course = findCourseOr404(req, res);
  if (!course) return;
  if (!course.lessons.some((lesson) => lesson.id === req.params.lessonId)) {
    return res.status(404).json({ message: 'Lesson not found.' });
  }

  if (req.method === 'DELETE') {
    await pool.query(
      'DELETE FROM course_lesson_progress WHERE user_id = $1 AND course_slug = $2 AND lesson_id = $3',
      [req.user.id, course.slug, req.params.lessonId],
    );
  } else {
    await pool.query(
      `INSERT INTO course_lesson_progress (user_id, course_slug, lesson_id) VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [req.user.id, course.slug, req.params.lessonId],
    );
  }
  res.json({ completedLessons: await completedLessons(req.user.id, course.slug) });
};

// POST /api/courses/:slug/exam: grades the final exam and issues a certificate on a pass.
export const submitExam = async (req, res) => {
  const course = findCourseOr404(req, res);
  if (!course) return;

  const done = new Set(await completedLessons(req.user.id, course.slug));
  if (!course.lessons.every((lesson) => done.has(lesson.id))) {
    return res.status(400).json({ message: 'Complete every lesson before taking the final exam.' });
  }

  const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
  const result = gradeExam(course, answers);
  if (!result.passed) {
    return res.json({ ...result, certificate: null });
  }

  // One certificate per course. Retaking keeps the original code and date but records the best score.
  const { rows } = await pool.query(
    `INSERT INTO course_certificates (user_id, course_slug, course_title, certificate_code, score)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, course_slug) DO UPDATE SET score = GREATEST(course_certificates.score, EXCLUDED.score)
     RETURNING *`,
    [req.user.id, course.slug, course.title, newCertificateCode(), result.score],
  );
  res.json({ ...result, certificate: mapCertificate(rows[0]) });
};

// GET /api/courses/certificates/:code: public, so anyone with the link can verify a certificate.
export const verifyCertificate = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT cc.*, u.name AS student_name
     FROM course_certificates cc JOIN users u ON u.id = cc.user_id
     WHERE cc.certificate_code = $1`,
    [String(req.params.code).toUpperCase()],
  );
  if (!rows[0]) {
    return res.status(404).json({ message: 'No certificate exists with this code.' });
  }
  res.json({ certificate: mapCertificate(rows[0]) });
};
