import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const applications = [
  {
    id: 1,
    company: 'Northstar Analytics',
    position: 'Junior Data Analyst',
    date: '2026-08-10',
    salary: '$90k',
    status: 'Applied',
    notes: 'Resume submitted; waiting on recruiter feedback',
    interviewDate: '2026-08-20',
  },
  {
    id: 2,
    company: 'BrightLabs',
    position: 'Data Science Intern',
    date: '2026-08-14',
    salary: '$75k',
    status: 'Interview',
    notes: 'Technical assessment completed',
    interviewDate: '2026-08-26',
  },
];

router.get('/', protect, (req, res) => {
  res.json({ applications, stats: { applications: 24, interviews: 6, offers: 2, successRate: 8.3 } });
});

router.post('/', protect, (req, res) => {
  res.status(201).json({ message: 'Application saved successfully.', app: req.body });
});

router.put('/:id', protect, (req, res) => {
  res.json({ message: 'Application updated successfully.', app: req.body });
});

export default router;
