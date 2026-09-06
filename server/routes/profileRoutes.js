import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: 'Aisha Patel',
      email: 'aisha@example.com',
      phone: '+1 555 123 4567',
      location: 'San Francisco, CA',
      education: {
        degree: 'B.Sc. Computer Science',
        department: 'AI & Data Science',
        college: 'University of California',
        graduationYear: 2025,
        cgpa: 3.8,
      },
      skills: {
        technical: ['Python', 'SQL', 'Machine Learning', 'Data Visualization'],
        soft: ['Communication', 'Leadership', 'Problem Solving'],
      },
      experience: {
        internships: ['Data Science Intern at BrightLabs'],
        workExperience: ['Research Assistant'],
      },
      achievements: {
        certifications: ['AWS Cloud Practitioner'],
        hackathons: ['HackMIT 2024'],
        awards: ['Dean’s List'],
      },
      interests: {
        careerInterests: ['Data Science', 'AI Engineer'],
        hobbies: ['Reading', 'Hiking'],
        preferredWorkEnvironment: 'Hybrid',
      },
    },
  });
});

router.put('/', protect, (req, res) => {
  res.json({ message: 'Profile updated successfully.', profile: req.body });
});

export default router;
