import express from 'express';
import rateLimit from 'express-rate-limit';
import { protect } from '../middleware/auth.js';
import { AssistantError, askCareerAssistant, isAssistantConfigured } from '../services/careerAssistant.js';

const router = express.Router();

// Each chat message costs an AI API call, so limit them per user on top of the global API limit.
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  keyGenerator: (req) => String(req.user?.id),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'You are sending messages too quickly. Please wait a minute.' },
});

router.get('/status', protect, (req, res) => {
  res.json({ configured: isAssistantConfigured() });
});

// Body: { messages: [{ role: 'user' | 'assistant', content }], context: { targetCareer, assessments } }
router.post('/chat', protect, chatLimiter, async (req, res) => {
  const { context } = req.body || {};
  // Older clients sent a single `message`.
  const messages = req.body?.messages || (req.body?.message ? [{ role: 'user', content: req.body.message }] : []);

  try {
    const result = await askCareerAssistant({ userId: req.user.id, messages, context });
    res.json(result);
  } catch (error) {
    if (error instanceof AssistantError) return res.status(error.status).json({ message: error.message });
    throw error;
  }
});

export default router;
