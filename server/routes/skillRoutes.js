import express from 'express';
import { protect } from '../middleware/auth.js';
import aiService from '../services/aiService.js';

const router = express.Router();

const skillProgress = [
  { skill: 'Python', current: 82, target: 90, lastUpdated: '2 days ago' },
  { skill: 'SQL', current: 58, target: 80, lastUpdated: '1 week ago' },
  { skill: 'Statistics', current: 66, target: 80, lastUpdated: '3 days ago' },
  { skill: 'Machine Learning', current: 42, target: 75, lastUpdated: '5 days ago' },
  { skill: 'Power BI', current: 35, target: 70, lastUpdated: '1 day ago' },
];

router.get('/', protect, (req, res) => {
  res.json({ skills: skillProgress });
});

router.get('/gap', protect, async (req, res) => {
  const result = await aiService.analyzeSkillGap(skillProgress, 'Data Scientist');
  res.json(result);
});

export default router;
