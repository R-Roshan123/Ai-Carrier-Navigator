import express from 'express';
import rateLimit from 'express-rate-limit';
import { protect } from '../middleware/auth.js';
import { resumeUpload } from '../middleware/resumeUpload.js';
import { AssistantError, reviewResume } from '../services/careerAssistant.js';
import { ResumeParseError, extractResumeText } from '../services/resumeParser.js';

const router = express.Router();

// AI reviews call the Groq API, so limit them per user.
const reviewLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 8,
  keyGenerator: (req) => String(req.user?.id),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many resume reviews in a short time. Please wait a minute.' },
});

// POST /api/resume/extract (multipart, field "resume"): returns the resume's plain text.
router.post('/extract', protect, resumeUpload, async (req, res) => {
  try {
    const text = await extractResumeText(req.file.buffer, req.resumeKind);
    res.json({ fileName: req.file.originalname, text, wordCount: text.split(/\s+/).filter(Boolean).length });
  } catch (error) {
    if (error instanceof ResumeParseError) return res.status(400).json({ message: error.message });
    throw error;
  }
});

// POST /api/resume/review { text, role }: AI score and feedback for one role (role = slug).
router.post('/review', protect, reviewLimiter, async (req, res) => {
  try {
    res.json(await reviewResume({ text: req.body?.text, roleSlug: req.body?.role }));
  } catch (error) {
    if (error instanceof AssistantError) return res.status(error.status).json({ message: error.message });
    throw error;
  }
});

export default router;
