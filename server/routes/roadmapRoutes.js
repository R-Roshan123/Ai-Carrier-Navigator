import express from 'express';
import { protect } from '../middleware/auth.js';
import aiService from '../services/aiService.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const result = await aiService.generateLearningRoadmap('Machine Learning Engineer');
  res.json(result);
});

router.put('/:id', protect, (req, res) => {
  res.json({ message: 'Roadmap updated successfully.', roadmap: req.body });
});

export default router;
