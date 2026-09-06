import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const careers = [
  {
    id: 1,
    name: 'Data Scientist',
    category: 'Data',
    overview: 'Builds models and insights from data to support business and product decisions.',
    responsibilities: ['Model development', 'Analytics', 'Visualization'],
    skills: ['Python', 'SQL', 'Statistics', 'Machine Learning'],
    education: 'Bachelor\'s in Statistics, Data Science, CS, or related field',
    salary: '$105k - $140k',
    demand: 'High',
    growth: 'Very high',
  },
  {
    id: 2,
    name: 'Machine Learning Engineer',
    category: 'AI',
    overview: 'Designs and deploys ML systems that scale in production environments.',
    responsibilities: ['ML pipeline design', 'Model deployment', 'Monitoring'],
    skills: ['Python', 'MLOps', 'Deep Learning', 'Cloud'],
    education: 'Bachelor\'s or master\'s in CS or Data Science',
    salary: '$120k - $160k',
    demand: 'High',
    growth: 'Very high',
  },
  {
    id: 3,
    name: 'Software Engineer',
    category: 'Technology',
    overview: 'Builds robust software systems and product features for real users.',
    responsibilities: ['Frontend', 'Backend', 'Testing'],
    skills: ['JavaScript', 'React', 'Node.js', 'System Design'],
    education: 'Computer Science or related field',
    salary: '$90k - $135k',
    demand: 'High',
    growth: 'High',
  },
  {
    id: 4,
    name: 'AI Engineer',
    category: 'AI',
    overview: 'Integrates AI models into products and business workflows with quality and reliability.',
    responsibilities: ['Prompt design', 'Model evaluation', 'Automation'],
    skills: ['Python', 'LLMs', 'APIs', 'Product thinking'],
    education: 'CS, AI, or related field',
    salary: '$110k - $150k',
    demand: 'Very high',
    growth: 'Very high',
  },
];

router.get('/', protect, (req, res) => {
  res.json({ careers });
});

router.get('/:id', protect, (req, res) => {
  const career = careers.find((item) => item.id === Number(req.params.id));
  if (!career) {
    return res.status(404).json({ message: 'Career not found' });
  }
  res.json({ career });
});

export default router;
