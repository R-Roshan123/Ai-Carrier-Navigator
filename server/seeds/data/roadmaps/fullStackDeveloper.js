import { resource } from './resource.js';

export default {
  role: 'full-stack-developer',
  stages: [
    {
      title: 'Foundation',
      description: 'Learn how the web works and get fluent with the core languages and tools.',
      steps: [
        {
          title: 'Web Fundamentals: HTML & CSS',
          description: 'Structure pages with semantic HTML and style them with modern, responsive CSS.',
          topics: ['How the web works (HTTP, DNS, browsers)', 'Semantic HTML & forms', 'CSS box model & selectors', 'Flexbox & Grid', 'Responsive design & media queries', 'Accessibility basics'],
          skills: ['HTML', 'CSS'],
          resources: [
            resource('MDN – Learn web development', 'https://developer.mozilla.org/en-US/docs/Learn_web_development', 'Docs'),
            resource('freeCodeCamp – Responsive Web Design', 'https://www.freecodecamp.org/learn/2022/responsive-web-design/'),
            resource('CSS Tricks – A Complete Guide to Flexbox', 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', 'Article'),
          ],
          projects: ['Personal portfolio page', 'Responsive clone of a product landing page'],
          estimatedHours: 40,
          certifications: ['fcc-rwd'],
        },
        {
          title: 'JavaScript Essentials',
          description: 'Master the language of the web: syntax, the DOM, asynchronous code, and modern ES features.',
          topics: ['Variables, types & functions', 'Arrays, objects & iteration', 'DOM manipulation & events', 'Promises & async/await', 'Fetch API & JSON', 'ES modules'],
          skills: ['JavaScript'],
          resources: [
            resource('The Modern JavaScript Tutorial', 'https://javascript.info/', 'Docs'),
            resource('MDN – JavaScript Guide', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', 'Docs'),
            resource('freeCodeCamp – JavaScript Algorithms and Data Structures', 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/'),
          ],
          projects: ['To-do app with localStorage', 'Quiz app consuming a public API'],
          estimatedHours: 60,
          certifications: ['fcc-js'],
        },
        {
          title: 'Git & GitHub',
          description: 'Track changes, collaborate through pull requests, and publish your work.',
          topics: ['Commits, branches & merges', 'Resolving conflicts', 'Pull requests & code review', 'GitHub Pages'],
          skills: ['Git'],
          resources: [
            resource('Pro Git (free book)', 'https://git-scm.com/book/en/v2', 'Book'),
            resource('GitHub Skills', 'https://skills.github.com/', 'Practice'),
          ],
          projects: ['Host your portfolio on GitHub Pages'],
          estimatedHours: 10,
          certifications: [],
        },
      ],
    },
    {
      title: 'Intermediate',
      description: 'Build interactive front ends and your first back-end APIs.',
      steps: [
        {
          title: 'React',
          description: 'Build component-based user interfaces with React and hooks.',
          topics: ['Components & JSX', 'Props & state', 'Hooks (useState, useEffect, custom hooks)', 'Routing', 'Forms & validation', 'Fetching data'],
          skills: ['React'],
          resources: [
            resource('react.dev – Learn React', 'https://react.dev/learn', 'Docs'),
            resource('Full Stack Open (University of Helsinki)', 'https://fullstackopen.com/en/'),
          ],
          projects: ['Movie search app using a public API', 'Expense tracker with charts'],
          estimatedHours: 60,
          certifications: ['meta-frontend'],
        },
        {
          title: 'TypeScript',
          description: 'Add static types to catch bugs earlier and make large codebases easier to maintain.',
          topics: ['Basic & union types', 'Interfaces & type aliases', 'Generics', 'Typing React components'],
          skills: ['TypeScript'],
          resources: [
            resource('TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html', 'Docs'),
          ],
          projects: ['Convert your React app to TypeScript'],
          estimatedHours: 25,
          certifications: [],
        },
        {
          title: 'Node.js, Express & REST APIs',
          description: 'Build server-side applications and RESTful APIs with Node.js and Express.',
          topics: ['Node.js runtime & npm', 'Express routing & middleware', 'REST conventions & status codes', 'Validation & error handling', 'Environment configuration'],
          skills: ['Node.js', 'Express', 'REST APIs'],
          resources: [
            resource('Node.js – Learn', 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs', 'Docs'),
            resource('Express – Routing guide', 'https://expressjs.com/en/guide/routing.html', 'Docs'),
            resource('The Odin Project – NodeJS', 'https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs'),
          ],
          projects: ['REST API for a blog with CRUD endpoints'],
          estimatedHours: 50,
          certifications: ['meta-backend', 'jsnad'],
        },
      ],
    },
    {
      title: 'Advanced',
      description: 'Persist data, secure your apps, and test them properly.',
      steps: [
        {
          title: 'Databases: SQL & MongoDB',
          description: 'Model data in relational and document databases and query it efficiently.',
          topics: ['Relational modelling & normalisation', 'SQL joins & aggregation', 'Indexes', 'MongoDB documents & aggregation', 'ORMs / ODMs'],
          skills: ['SQL', 'MongoDB'],
          resources: [
            resource('SQLBolt – interactive SQL lessons', 'https://sqlbolt.com/', 'Practice'),
            resource('PostgreSQL Tutorial (official docs)', 'https://www.postgresql.org/docs/current/tutorial.html', 'Docs'),
            resource('MongoDB University', 'https://learn.mongodb.com/'),
          ],
          projects: ['Add PostgreSQL or MongoDB persistence to your blog API'],
          estimatedHours: 45,
          certifications: ['mongodb-dev'],
        },
        {
          title: 'Authentication & Web Security',
          description: 'Implement login securely and defend against the most common web vulnerabilities.',
          topics: ['Password hashing', 'Sessions vs JWT', 'Role-based access control', 'OWASP Top 10', 'CORS & HTTPS'],
          skills: ['Authentication'],
          resources: [
            resource('OWASP Top 10', 'https://owasp.org/www-project-top-ten/', 'Article'),
            resource('JWT.io – Introduction', 'https://jwt.io/introduction', 'Article'),
          ],
          projects: ['Add signup, login, and role-based routes to your API'],
          estimatedHours: 20,
          certifications: [],
        },
        {
          title: 'Testing',
          description: 'Write unit, integration, and component tests so you can change code with confidence.',
          topics: ['Unit tests with Jest/Vitest', 'API integration tests', 'React Testing Library', 'Mocking'],
          skills: ['Testing'],
          resources: [
            resource('Jest – Getting Started', 'https://jestjs.io/docs/getting-started', 'Docs'),
            resource('Testing Library docs', 'https://testing-library.com/docs/', 'Docs'),
          ],
          projects: ['Reach 70%+ test coverage on your API'],
          estimatedHours: 20,
          certifications: [],
        },
      ],
    },
    {
      title: 'Job-Ready',
      description: 'Ship to production, think at system level, and prepare for interviews.',
      steps: [
        {
          title: 'Docker, CI & Deployment',
          description: 'Containerise your app, automate checks, and deploy it to the cloud.',
          topics: ['Dockerfiles & images', 'Docker Compose', 'CI with GitHub Actions', 'Deploying to Render/Vercel/AWS', 'Environment secrets'],
          skills: ['Docker', 'Deployment'],
          resources: [
            resource('Docker – Get started', 'https://docs.docker.com/get-started/', 'Docs'),
            resource('GitHub Actions documentation', 'https://docs.github.com/en/actions', 'Docs'),
          ],
          projects: ['Deploy your full-stack app with a CI pipeline'],
          estimatedHours: 25,
          certifications: ['aws-dev', 'github-actions'],
        },
        {
          title: 'System Design Basics',
          description: 'Understand how real systems scale: caching, load balancing, and data partitioning.',
          topics: ['Client-server & load balancing', 'Caching', 'Database scaling', 'Message queues', 'API design trade-offs'],
          skills: ['System Design'],
          resources: [
            resource('The System Design Primer', 'https://github.com/donnemartin/system-design-primer', 'Article'),
          ],
          projects: ['Write a design doc for a URL shortener'],
          estimatedHours: 25,
          certifications: [],
        },
        {
          title: 'Capstone Project & Interview Prep',
          description: 'Build a portfolio-grade app and practise DSA and behavioural interviews.',
          topics: ['Portfolio polish', 'Data structures & algorithms', 'Behavioural interviews (STAR)', 'Resume & GitHub profile'],
          skills: [],
          resources: [
            resource('roadmap.sh – Full Stack', 'https://roadmap.sh/full-stack', 'Article'),
            resource('NeetCode roadmap', 'https://neetcode.io/roadmap', 'Practice'),
          ],
          projects: ['Full-stack app with auth, payments or real-time features, deployed with a live demo'],
          estimatedHours: 60,
          certifications: [],
        },
      ],
    },
  ],
};
