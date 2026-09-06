export const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Career Assessment', path: '/assessment', icon: 'BrainCircuit' },
  { label: 'Career Recommendations', path: '/recommendations', icon: 'Sparkles' },
  { label: 'Career Explorer', path: '/explorer', icon: 'Compass' },
  { label: 'Skill Gap', path: '/skill-gap', icon: 'Goal' },
  { label: 'Learning Roadmap', path: '/roadmap', icon: 'Route' },
  { label: 'Courses', path: '/courses', icon: 'BookOpen' },
  { label: 'Projects', path: '/projects', icon: 'FolderKanban' },
  { label: 'Jobs', path: '/jobs', icon: 'BriefcaseBusiness' },
  { label: 'Resume', path: '/resume', icon: 'FileText' },
  { label: 'Applications', path: '/applications', icon: 'ClipboardList' },
  { label: 'AI Career Mentor', path: '/chat', icon: 'MessageSquareText' },
  { label: 'Profile', path: '/profile', icon: 'UserRound' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
];

export const metrics = [
  { label: 'Career match', value: '92%', change: '+6%' },
  { label: 'Career readiness', value: '78/100', change: '+4%' },
  { label: 'Skill progress', value: '73%', change: '+9%' },
  { label: 'Learning progress', value: '64%', change: '+12%' },
];

export const careerRecommendations = [
  { name: 'Data Scientist', match: 92, salary: '$105k - $140k', education: 'B.Sc/BS in Data Science or Statistics', difficulty: 'High', growth: 'Very high', reason: 'Strong fit for your analytical thinking, Python, and SQL profile.' },
  { name: 'Machine Learning Engineer', match: 89, salary: '$120k - $160k', education: 'CS / AI / Data Science', difficulty: 'High', growth: 'Very high', reason: 'Great alignment with your ML interests and technical skill foundation.' },
  { name: 'Data Analyst', match: 86, salary: '$90k - $120k', education: 'CS / Analytics / Business', difficulty: 'Moderate', growth: 'High', reason: 'You match the core business analytics and reporting workflow.' },
];

export const careerExplorer = [
  { id: 1, name: 'Data Scientist', category: 'Data', overview: 'Turns complex data into actionable insights and predictive models.', salary: '$105k - $140k', skills: ['Python', 'SQL', 'Statistics', 'Visualization'], tools: ['Python', 'Power BI', 'Tableau', 'SQL'], education: 'Bachelor\'s in Data Science, Statistics, or CS' },
  { id: 2, name: 'AI Engineer', category: 'AI', overview: 'Builds AI-powered systems that improve user experiences and workflows.', salary: '$110k - $150k', skills: ['LLMs', 'Python', 'APIs', 'Model evaluation'], tools: ['OpenAI', 'Python', 'FastAPI', 'AWS'], education: 'CS, AI or related technical field' },
  { id: 3, name: 'Software Engineer', category: 'Technology', overview: 'Designs and develops software products that scale in production.', salary: '$90k - $135k', skills: ['JavaScript', 'React', 'Node.js', 'System design'], tools: ['React', 'Node', 'Git', 'AWS'], education: 'Bachelor\'s in CS or related field' },
  { id: 4, name: 'Product Analyst', category: 'Business', overview: 'Connects business goals with product and analytics insights.', salary: '$95k - $130k', skills: ['SQL', 'Excel', 'Problem solving', 'Communication'], tools: ['SQL', 'Excel', 'Looker', 'Jira'], education: 'Business, Analytics, or STEM background' },
  { id: 5, name: 'Cybersecurity Analyst', category: 'Cybersecurity', overview: 'Protects enterprise systems and investigates threats.', salary: '$85k - $115k', skills: ['Security principles', 'Networking', 'Risk analysis'], tools: ['Wireshark', 'Splunk', 'SIEM'], education: 'IT, CS or cyber-focused degree' },
  { id: 6, name: 'UX Designer', category: 'Design', overview: 'Designs seamless user experiences with research-informed decision making.', salary: '$80k - $110k', skills: ['Research', 'Figma', 'Interaction design'], tools: ['Figma', 'Notion', 'Maze'], education: 'Design or human-computer interaction' },
];

export const assessmentQuestions = [
  { question: 'Which areas interest you most?', options: ['Programming', 'Design', 'Business', 'Data', 'Research', 'Management'] },
  { question: 'How strong are your analytical skills?', options: ['Beginner', 'Developing', 'Strong', 'Advanced'] },
  { question: 'Do you enjoy working with data and patterns?', options: ['Not much', 'Sometimes', 'Often', 'Very often'] },
  { question: 'What is your preferred work style?', options: ['Team-based', 'Independent', 'Hybrid', 'Flexible'] },
  { question: 'How comfortable are you with storytelling and communication?', options: ['Low', 'Moderate', 'High', 'Very high'] },
];

export const skillGapData = [
  { skill: 'Python', current: 82, required: 90, gap: 8, priority: 'MEDIUM', resource: 'Python for Data Science' },
  { skill: 'SQL', current: 58, required: 80, gap: 22, priority: 'HIGH', resource: 'SQL Bootcamp' },
  { skill: 'Statistics', current: 66, required: 80, gap: 14, priority: 'MEDIUM', resource: 'Statistics Essentials' },
  { skill: 'Machine Learning', current: 42, required: 75, gap: 33, priority: 'HIGH', resource: 'Machine Learning Crash Course' },
  { skill: 'Power BI', current: 35, required: 70, gap: 35, priority: 'HIGH', resource: 'Power BI Fundamentals' },
];

export const roadmapPhases = [
  { name: 'Python Fundamentals', duration: '3 weeks', topics: ['Functions', 'Data structures', 'Libraries'], progress: 90 },
  { name: 'Data Structures', duration: '2 weeks', topics: ['Lists', 'Queues', 'Maps'], progress: 80 },
  { name: 'Statistics', duration: '3 weeks', topics: ['Probability', 'Hypothesis testing', 'Regression'], progress: 62 },
  { name: 'Machine Learning', duration: '4 weeks', topics: ['Linear models', 'Classification', 'Validation'], progress: 42 },
  { name: 'Deep Learning', duration: '3 weeks', topics: ['Neural networks', 'TensorFlow', 'Model tuning'], progress: 28 },
  { name: 'Projects', duration: '4 weeks', topics: ['Portfolio project', 'Case study', 'Presentation'], progress: 18 },
];

export const courses = [
  { name: 'SQL for Data Analytics', platform: 'Coursera', level: 'Beginner', duration: '4 weeks', cost: 'Free', rating: 4.8, certificate: true, reason: 'Your biggest skill gap is SQL, and this course directly addresses it.' },
  { name: 'Machine Learning Crash Course', platform: 'Google', level: 'Intermediate', duration: '6 weeks', cost: 'Free', rating: 4.7, certificate: true, reason: 'Helps you close the ML gap with a strong practical foundation.' },
  { name: 'Python for Data Science', platform: 'Udemy', level: 'Beginner', duration: '5 weeks', cost: 'Paid', rating: 4.9, certificate: true, reason: 'Strengthens both your Python fluency and analytics workflows.' },
];

export const projects = [
  { name: 'Customer Churn Prediction', difficulty: 'Intermediate', technologies: ['Python', 'Scikit-learn', 'SQL'], duration: '3 weeks', description: 'Predict churn using customer behavior and engagement metrics.', dataset: 'Telco customer churn dataset', outcome: 'Build a model and business summary report.' },
  { name: 'Sales Forecasting Dashboard', difficulty: 'Intermediate', technologies: ['Python', 'Power BI', 'SQL'], duration: '2 weeks', description: 'Forecast sales trends with dashboarding and business insights.', dataset: 'Retail sales dataset', outcome: 'Present actionable monthly forecasts.' },
  { name: 'Recommendation System', difficulty: 'Advanced', technologies: ['Python', 'Pandas', 'PyTorch'], duration: '4 weeks', description: 'Build personalized recommendations using collaborative filtering.', dataset: 'MovieLens or product dataset', outcome: 'Create an end-to-end recommender prototype.' },
];

export const jobs = [
  { title: 'Junior Data Analyst', company: 'Northstar Analytics', location: 'Remote', workType: 'Full-time', experience: '0-2 years', salary: '$80k - $100k', match: 91, reasons: ['Python', 'SQL', 'Excel', 'Statistics'], missingSkills: ['Power BI'] },
  { title: 'AI Intern', company: 'Vision Labs', location: 'New York, NY', workType: 'Hybrid', experience: 'Internship', salary: '$70k - $90k', match: 88, reasons: ['Python', 'Machine Learning'], missingSkills: ['Deep Learning'] },
  { title: 'Product Analyst', company: 'Orbit Growth', location: 'Austin, TX', workType: 'Hybrid', experience: '1-3 years', salary: '$90k - $120k', match: 85, reasons: ['SQL', 'Communication', 'Problem Solving'], missingSkills: ['A/B testing'] },
];

export const applicationsSeed = [
  { company: 'Northstar Analytics', position: 'Junior Data Analyst', date: '2026-08-10', salary: '$90k', status: 'Applied', notes: 'Resume submitted', interviewDate: '2026-08-20' },
  { company: 'BrightLabs', position: 'Data Science Intern', date: '2026-08-14', salary: '$75k', status: 'Interview', notes: 'Technical assessment complete', interviewDate: '2026-08-26' },
  { company: 'Orbit Growth', position: 'Product Analyst', date: '2026-08-15', salary: '$95k', status: 'Saved', notes: 'Researching company fit', interviewDate: null },
  { company: 'Crestline AI', position: 'ML Engineer', date: '2026-08-12', salary: '$110k', status: 'Assessment', notes: 'Pending coding test', interviewDate: null },
];

export const chatSuggestions = ['What career suits me?', 'What should I learn next?', 'How can I improve my resume?', 'What skills am I missing?', 'Which projects should I build?', 'How do I prepare for interviews?'];

export const dashboardInsight = 'You are close to being job-ready for entry-level Data Analyst roles. Focus on Power BI and complete one portfolio project next.';

export const profileData = {
  personal: { name: 'Aisha Patel', email: 'aisha@example.com', phone: '+1 555 123 4567', location: 'San Francisco, CA' },
  education: { degree: 'B.Sc. Computer Science', department: 'AI & Data Science', college: 'University of California', graduationYear: 2025, cgpa: 3.8 },
  skills: { technical: ['Python', 'SQL', 'Machine Learning', 'Data Visualization'], soft: ['Communication', 'Leadership', 'Problem Solving'] },
  experience: { internships: ['Data Science Intern at BrightLabs'], workExperience: ['Research Assistant'] },
  achievements: { certifications: ['AWS Cloud Practitioner'], hackathons: ['HackMIT 2024'], awards: ['Dean\'s List'] },
  interests: { careerInterests: ['Data Science', 'AI Engineer'], hobbies: ['Reading', 'Hiking'], preferredWorkEnvironment: 'Hybrid' },
};
