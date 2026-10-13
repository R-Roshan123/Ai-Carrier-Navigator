// Job roles for the Career Roadmap module. `skills` strings must match the
// `skills` used in each role's roadmap steps exactly - gap analysis compares them.
// Salary figures are approximate market ranges and should be reviewed periodically.

export const careerRoles = [
  {
    slug: 'full-stack-developer',
    title: 'Full Stack Developer',
    category: 'Software Development',
    description:
      'Builds complete web applications end to end - from responsive user interfaces to APIs, databases, and deployment.',
    responsibilities: [
      'Build responsive, accessible user interfaces',
      'Design and implement REST APIs and server-side logic',
      'Model data and write efficient database queries',
      'Implement authentication and protect applications against common vulnerabilities',
      'Write automated tests and review code',
      'Deploy, monitor, and maintain applications in production',
    ],
    skills: ['HTML', 'CSS', 'JavaScript', 'Git', 'React', 'TypeScript', 'Node.js', 'Express', 'REST APIs', 'SQL', 'MongoDB', 'Authentication', 'Testing', 'Docker', 'Deployment', 'System Design'],
    tools: ['VS Code', 'Git & GitHub', 'Chrome DevTools', 'Postman', 'npm', 'PostgreSQL', 'MongoDB', 'Docker', 'Vercel / Render'],
    experienceLevel: 'Entry',
    salaryIndia: '₹4 – 18 LPA',
    salaryGlobal: 'USD 70k – 140k',
    demandLevel: 'Very High',
    growthOutlook:
      'Consistently one of the most hired software roles; demand is strongest for developers comfortable with TypeScript, cloud deployment, and AI-assisted tooling.',
    related: ['devops-engineer', 'ui-ux-designer', 'cloud-engineer'],
  },
  {
    slug: 'data-analyst',
    title: 'Data Analyst',
    category: 'Data & Analytics',
    description:
      'Turns raw business data into clear insights, dashboards, and recommendations that help teams make better decisions.',
    responsibilities: [
      'Collect, clean, and validate data from multiple sources',
      'Write SQL queries to answer business questions',
      'Build dashboards and reports in Power BI or Tableau',
      'Run statistical analyses and A/B test evaluations',
      'Present findings and recommendations to stakeholders',
    ],
    skills: ['Excel', 'Statistics', 'SQL', 'Python', 'Pandas', 'Data Cleaning', 'Data Visualization', 'Power BI', 'Tableau', 'A/B Testing', 'Data Storytelling'],
    tools: ['Excel', 'Google Sheets', 'PostgreSQL / MySQL', 'Python', 'Jupyter', 'Power BI', 'Tableau', 'Looker Studio'],
    experienceLevel: 'Entry',
    salaryIndia: '₹3.5 – 12 LPA',
    salaryGlobal: 'USD 55k – 100k',
    demandLevel: 'Very High',
    growthOutlook:
      'Strong growth across every industry as companies become data-driven; a common entry point into data science and analytics engineering.',
    related: ['full-stack-developer'],
  },
  {
    slug: 'cloud-engineer',
    title: 'Cloud Engineer',
    category: 'Cloud & Infrastructure',
    description:
      'Designs, builds, and operates secure, scalable infrastructure on public cloud platforms such as AWS, Azure, and Google Cloud.',
    responsibilities: [
      'Provision and manage cloud infrastructure',
      'Automate infrastructure with Infrastructure as Code',
      'Configure networking, identity, and access management',
      'Monitor cost, performance, and availability',
      'Design highly available and fault-tolerant architectures',
    ],
    skills: ['Linux', 'Networking', 'Scripting', 'Cloud Fundamentals', 'AWS', 'Azure', 'Google Cloud', 'IAM & Security', 'Infrastructure as Code', 'Containers', 'Monitoring', 'Cost Optimization', 'High Availability Design'],
    tools: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Terraform', 'Docker', 'Kubernetes', 'CloudWatch', 'Bash', 'Python'],
    experienceLevel: 'Mid',
    salaryIndia: '₹6 – 25 LPA',
    salaryGlobal: 'USD 90k – 160k',
    demandLevel: 'Very High',
    growthOutlook:
      'Cloud adoption continues to accelerate; multi-cloud and cost-optimisation skills are especially valued.',
    related: ['devops-engineer', 'cybersecurity-analyst', 'full-stack-developer'],
  },
  {
    slug: 'devops-engineer',
    title: 'DevOps Engineer',
    category: 'DevOps & SRE',
    description:
      'Bridges development and operations by automating builds, tests, deployments, and infrastructure so teams can ship reliably and quickly.',
    responsibilities: [
      'Build and maintain CI/CD pipelines',
      'Containerise applications and run them on Kubernetes',
      'Manage infrastructure and configuration as code',
      'Set up monitoring, logging, and alerting',
      'Embed security checks into the delivery pipeline',
    ],
    skills: ['Linux', 'Networking', 'Git', 'Scripting', 'CI/CD', 'Docker', 'Cloud Platforms', 'Kubernetes', 'Infrastructure as Code', 'Configuration Management', 'Monitoring & Logging', 'DevSecOps'],
    tools: ['Git', 'GitHub Actions', 'Jenkins', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Prometheus', 'Grafana', 'AWS'],
    experienceLevel: 'Mid',
    salaryIndia: '₹6 – 28 LPA',
    salaryGlobal: 'USD 95k – 170k',
    demandLevel: 'Very High',
    growthOutlook:
      'High demand as organisations modernise delivery; platform engineering and SRE are natural growth paths.',
    related: ['cloud-engineer', 'full-stack-developer', 'cybersecurity-analyst'],
  },
  {
    slug: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Cybersecurity',
    description:
      'Protects an organisation\'s systems and data by monitoring for threats, investigating incidents, and reducing vulnerabilities.',
    responsibilities: [
      'Monitor security alerts in a SIEM and triage incidents',
      'Investigate suspicious activity using logs and threat intelligence',
      'Run vulnerability assessments and track remediation',
      'Support incident response and write post-incident reports',
      'Help maintain compliance with security frameworks and policies',
    ],
    skills: ['Networking', 'Linux', 'Windows Administration', 'Security Fundamentals', 'Python Scripting', 'SIEM', 'Log Analysis', 'Threat Intelligence', 'Incident Response', 'Vulnerability Assessment', 'Cloud Security', 'Risk & Compliance'],
    tools: ['Wireshark', 'Splunk', 'Microsoft Sentinel', 'Wazuh', 'Nmap', 'Nessus', 'Burp Suite', 'Kali Linux'],
    experienceLevel: 'Entry',
    salaryIndia: '₹4 – 16 LPA',
    salaryGlobal: 'USD 70k – 120k',
    demandLevel: 'High',
    growthOutlook:
      'A persistent global skills shortage keeps demand high; SOC analyst roles are the most common entry point.',
    related: ['cloud-engineer', 'devops-engineer'],
  },
  {
    slug: 'ui-ux-designer',
    title: 'UI/UX Designer',
    category: 'Design',
    description:
      'Designs digital products that are useful, usable, and delightful - grounded in user research and validated through testing.',
    responsibilities: [
      'Conduct user research and synthesise insights',
      'Create information architecture, user flows, and wireframes',
      'Design high-fidelity interfaces and interactive prototypes',
      'Run usability tests and iterate on designs',
      'Contribute to and maintain design systems',
    ],
    skills: ['Design Principles', 'Typography', 'Color Theory', 'Design Thinking', 'Figma', 'User Research', 'Information Architecture', 'Wireframing', 'Prototyping', 'Interaction Design', 'Usability Testing', 'Accessibility', 'Design Systems'],
    tools: ['Figma', 'FigJam', 'Miro', 'Maze', 'Notion', 'Adobe Illustrator'],
    experienceLevel: 'Entry',
    salaryIndia: '₹3.5 – 15 LPA',
    salaryGlobal: 'USD 60k – 120k',
    demandLevel: 'High',
    growthOutlook:
      'Steady demand from product companies and startups; designers with research, accessibility, and design-system experience stand out.',
    related: ['full-stack-developer'],
  },
];
