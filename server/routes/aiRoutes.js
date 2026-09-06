import express from 'express';
import { protect } from '../middleware/auth.js';
import aiService from '../services/aiService.js';

const router = express.Router();

router.post('/chat', protect, async (req, res) => {
  const { message, context } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  const result = await aiService.careerChat(message, context || {});
  res.json(result);
});

export default router;
