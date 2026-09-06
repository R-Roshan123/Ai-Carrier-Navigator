import express from 'express';
import { protect } from '../middleware/auth.js';
import aiService from '../services/aiService.js';

const router = express.Router();

const assessmentQuestions = [
  { id: 1, category: 'Interests', question: 'Which domains interest you most?', options: ['Programming', 'Design', 'Business', 'Data'] },
  { id: 2, category: 'Skills', question: 'How confident are you in problem solving?', options: ['Low', 'Moderate', 'High', 'Very High'] },
  { id: 3, category: 'Work Style', question: 'Do you prefer structure or flexibility?', options: ['Structured', 'Flexible', 'Hybrid'] },
];

router.get('/questions', protect, (req, res) => {
  res.json({ questions: assessmentQuestions });
});

router.post('/', protect, async (req, res) => {
  const result = await aiService.analyzeCareerAssessment(req.body || {});
  res.json({
    message: 'Assessment submitted successfully.',
    recommendations: result.recommendations || [
      { career: 'Data Scientist', match: 92 },
      { career: 'Machine Learning Engineer', match: 89 },
    ],
  });
});

export default router;
