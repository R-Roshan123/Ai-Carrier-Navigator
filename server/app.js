// The Express app, shared by the local server (server/index.js) and the Vercel function (api/index.js).
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import careerTrackerRoutes from './routes/careerTrackerRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// On Vercel requests arrive through a proxy; trust it so rate limits see the real client IP.
if (process.env.VERCEL) app.set('trust proxy', 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ai-career-navigator-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/career', careerTrackerRoutes);
app.use('/api/courses', courseRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
