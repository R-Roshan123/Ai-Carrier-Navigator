// In-app courses and learning roadmaps: lesson and topic progress, final exams, and certificates – mounted at /api/courses
import express from 'express';
import { protect } from '../middleware/auth.js';
import { requireCareerUser, requireDatabase } from '../middleware/careerGuards.js';
import { getProgress, setLessonComplete, setTopicComplete, submitExam, verifyCertificate } from '../controllers/courseController.js';

const router = express.Router();
const signedIn = [protect, requireCareerUser];

router.use(requireDatabase);

router.get('/certificates/:code', verifyCertificate);

router.get('/progress', ...signedIn, getProgress);
router.put('/:slug/lessons/:lessonId', ...signedIn, setLessonComplete);
router.delete('/:slug/lessons/:lessonId', ...signedIn, setLessonComplete);
router.post('/:slug/exam', ...signedIn, submitExam);
router.put('/:slug/roadmap/:topicId', ...signedIn, setTopicComplete);
router.delete('/:slug/roadmap/:topicId', ...signedIn, setTopicComplete);

export default router;
