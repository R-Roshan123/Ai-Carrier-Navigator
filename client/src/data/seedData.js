export const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Career Assessment', path: '/assessment', icon: 'BrainCircuit' },
  { label: 'Career Recommendations', path: '/recommendations', icon: 'Sparkles' },
  { label: 'Career Explorer', path: '/explorer', icon: 'Compass' },
  { label: 'Skill Gap', path: '/skill-gap', icon: 'Goal' },
  { label: 'Learning Roadmap', path: '/roadmap', icon: 'Route' },
  { label: 'Career Roadmaps', path: '/career/roles', icon: 'Map' },
  { label: 'Companies Hiring', path: '/career/companies', icon: 'Building2' },
  { label: 'My Career Progress', path: '/career/progress', icon: 'TrendingUp' },
  { label: 'My Certificates', path: '/career/certificates', icon: 'Award' },
  { label: 'Courses', path: '/courses', icon: 'BookOpen' },
  { label: 'Projects', path: '/projects', icon: 'FolderKanban' },
  { label: 'Jobs', path: '/jobs', icon: 'BriefcaseBusiness' },
  { label: 'Resume', path: '/resume', icon: 'FileText' },
  { label: 'AI Career Mentor', path: '/chat', icon: 'MessageSquareText' },
  { label: 'Profile', path: '/profile', icon: 'UserRound' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
  { label: 'Career Admin', path: '/admin/career', icon: 'ShieldCheck', adminOnly: true },
];

export const metrics = [
  { label: 'Career match', value: '92%', change: '+6%' },
  { label: 'Career readiness', value: '78/100', change: '+4%' },
  { label: 'Skill progress', value: '73%', change: '+9%' },
  { label: 'Learning progress', value: '64%', change: '+12%' },
];

export const careerExplorer = [
  { id: 1, name: 'Data Scientist', category: 'Data', overview: 'Turns complex data into actionable insights and predictive models.', salary: '$105k - $140k', skills: ['Python', 'SQL', 'Statistics', 'Visualization'], tools: ['Python', 'Power BI', 'Tableau', 'SQL'], education: 'Bachelor\'s in Data Science, Statistics, or CS' },
  { id: 2, name: 'AI Engineer', category: 'AI', overview: 'Builds AI-powered systems that improve user experiences and workflows.', salary: '$110k - $150k', skills: ['LLMs', 'Python', 'APIs', 'Model evaluation'], tools: ['OpenAI', 'Python', 'FastAPI', 'AWS'], education: 'CS, AI or related technical field' },
  { id: 3, name: 'Software Engineer', category: 'Technology', overview: 'Designs and develops software products that scale in production.', salary: '$90k - $135k', skills: ['JavaScript', 'React', 'Node.js', 'System design'], tools: ['React', 'Node', 'Git', 'AWS'], education: 'Bachelor\'s in CS or related field' },
  { id: 4, name: 'Product Analyst', category: 'Business', overview: 'Connects business goals with product and analytics insights.', salary: '$95k - $130k', skills: ['SQL', 'Excel', 'Problem solving', 'Communication'], tools: ['SQL', 'Excel', 'Looker', 'Jira'], education: 'Business, Analytics, or STEM background' },
  { id: 5, name: 'Cybersecurity Analyst', category: 'Cybersecurity', overview: 'Protects enterprise systems and investigates threats.', salary: '$85k - $115k', skills: ['Security principles', 'Networking', 'Risk analysis'], tools: ['Wireshark', 'Splunk', 'SIEM'], education: 'IT, CS or cyber-focused degree' },
  { id: 6, name: 'UX Designer', category: 'Design', overview: 'Designs seamless user experiences with research-informed decision making.', salary: '$80k - $110k', skills: ['Research', 'Figma', 'Interaction design'], tools: ['Figma', 'Notion', 'Maze'], education: 'Design or human-computer interaction' },
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
