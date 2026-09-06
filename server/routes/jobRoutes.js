import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const jobs = [
  {
    id: 1,
    title: 'Junior Data Analyst',
    company: 'Northstar Analytics',
    location: 'Remote',
    workType: 'Full-time',
    experience: '0-2 years',
    salary: '$80k - $100k',
    match: 91,
    reasons: ['Python', 'SQL', 'Excel', 'Statistics'],
    missingSkills: ['Power BI'],
  },
  {
    id: 2,
    title: 'AI Intern',
    company: 'Vision Labs',
    location: 'New York, NY',
    workType: 'Hybrid',
    experience: 'Internship',
    salary: '$70k - $90k',
    match: 88,
    reasons: ['Machine Learning', 'Python', 'Data Analysis'],
    missingSkills: ['Deep Learning'],
  },
  {
    id: 3,
    title: 'Product Analyst',
    company: 'Orbit Growth',
    location: 'Austin, TX',
    workType: 'Hybrid',
    experience: '1-3 years',
    salary: '$90k - $120k',
    match: 85,
    reasons: ['SQL', 'Communication', 'Problem Solving'],
    missingSkills: ['A/B testing'],
  },
];

router.get('/', protect, (req, res) => {
  res.json({ jobs });
});

router.post('/save', protect, (req, res) => {
  res.status(201).json({ message: 'Job saved successfully.', job: req.body });
});

export default router;
