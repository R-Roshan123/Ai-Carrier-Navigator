import express from 'express';
import { protect } from '../middleware/auth.js';
import aiService from '../services/aiService.js';

const router = express.Router();

router.post('/analyze', protect, async (req, res) => {
  const result = await aiService.analyzeResume(req.body.resume || {});
  res.json(result);
});

router.post('/generate', protect, async (req, res) => {
  const result = await aiService.generateResume(req.body.jobProfile || {});
  res.json(result);
});

export default router;
