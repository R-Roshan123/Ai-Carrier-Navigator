// Per-role learning and job data, layered on top of the role assessments so every page
// works from the same 15 roles. Course durations are approximate; check the provider for current details.

import { roleAssessments } from './roleAssessments';

const course = (name, platform, level, duration, cost, certificate, reason) => ({ name, platform, level, duration, cost, certificate, reason });
const project = (name, difficulty, technologies, duration, description, outcome) => ({ name, difficulty, technologies, duration, description, outcome });
const phase = (name, duration, topics) => ({ name, duration, topics });

const roleCareerData = {
  'software-engineer': {
    tools: ['Git & GitHub', 'VS Code / IntelliJ', 'Docker', 'AWS / GCP', 'Jira'],
    resumeSummary: 'Computer science graduate who designs and builds reliable, well-tested software with a strong foundation in data structures, algorithms, and system design.',
    roadmap: [
      phase('Programming Foundations', '4 weeks', ['One language in depth (Java, C++ or Python)', 'Control flow & functions', 'OOP basics', 'Git workflow']),
      phase('Data Structures & Algorithms', '8 weeks', ['Arrays, lists, hash maps', 'Trees & graphs', 'Sorting & searching', 'Big-O analysis']),
      phase('Software Engineering Practices', '4 weeks', ['SOLID & design patterns', 'Unit & integration testing', 'Code review', 'CI basics']),
      phase('System Design', '5 weeks', ['Load balancing & caching', 'Databases & sharding', 'CAP theorem', 'Designing a URL shortener']),
      phase('Portfolio & Interviews', '4 weeks', ['Capstone project', 'LeetCode practice', 'Mock system design interviews', 'Behavioural prep']),
    ],
    courses: [
      course('CS50x: Introduction to Computer Science', 'Harvard / edX', 'Beginner', '~11 weeks', 'Free', true, 'The best-known foundation in algorithms, memory, and problem solving.'),
      course('Algorithms Specialization', 'Stanford / Coursera', 'Intermediate', '~4 months', 'Free to audit', true, 'Deepens the algorithm design and analysis that software interviews test.'),
    ],
    projects: [
      project('URL Shortener Service', 'Intermediate', ['Java', 'Spring Boot', 'Redis', 'PostgreSQL'], '2 weeks', 'Build a short-link service with caching, analytics, and rate limiting.', 'A deployed service with a written design doc covering scaling decisions.'),
      project('Collaborative Task Board', 'Advanced', ['TypeScript', 'Node.js', 'WebSockets', 'Docker'], '4 weeks', 'Real-time task board where multiple users edit the same board at once.', 'Containerized app with tests and a CI pipeline.'),
    ],
    job: { title: 'Graduate Software Engineer', company: 'Lumen Grid Systems', location: 'San Francisco, CA', workType: 'Hybrid', experience: '0-2 years' },
  },
  'software-developer': {
    tools: ['Git & GitHub', 'IntelliJ / Visual Studio', 'Postman', 'Jira', 'JUnit / pytest'],
    resumeSummary: 'Detail-oriented developer who turns requirements into clean, maintainable application code using object-oriented design and agile practices.',
    roadmap: [
      phase('Language Fundamentals', '4 weeks', ['Java or C# syntax', 'Collections', 'Exceptions', 'File I/O']),
      phase('Object-Oriented Design', '4 weeks', ['Classes & interfaces', 'Inheritance & polymorphism', 'Design patterns', 'UML basics']),
      phase('Databases & APIs', '4 weeks', ['SQL basics', 'JDBC / ORM', 'Consuming REST APIs', 'JSON']),
      phase('Testing & Debugging', '3 weeks', ['Unit testing', 'Debugger tools', 'Logging', 'Refactoring']),
      phase('Agile Delivery', '3 weeks', ['Scrum & sprints', 'Pull requests & code review', 'Capstone app', 'Interview prep']),
    ],
    courses: [
      course('Java Programming and Software Engineering Fundamentals', 'Duke University / Coursera', 'Beginner', '~4 months', 'Free to audit', true, 'Builds Java and OOP skills through practical programming exercises.'),
      course('Introduction to Software Engineering', 'IBM / Coursera', 'Beginner', '~15 hours', 'Free to audit', true, 'Covers the SDLC, agile methods, and how software teams work.'),
    ],
    projects: [
      project('Library Management System', 'Beginner', ['Java', 'SQL', 'JUnit'], '2 weeks', 'Desktop or console app to manage books, members, and loans.', 'Well-structured OOP codebase with unit tests.'),
      project('Expense Tracker API', 'Intermediate', ['C#', '.NET', 'SQL Server'], '3 weeks', 'REST API with categories, budgets, and monthly reports.', 'Documented API with Postman collection and tests.'),
    ],
    job: { title: 'Associate Software Developer', company: 'Brightpath Softworks', location: 'Austin, TX', workType: 'On-site', experience: '0-1 years' },
  },
  'web-developer': {
    tools: ['VS Code', 'Chrome DevTools', 'Git & GitHub', 'Figma', 'Netlify / Vercel'],
    resumeSummary: 'Web developer who builds fast, responsive, and accessible websites with semantic HTML, modern CSS, and JavaScript.',
    roadmap: [
      phase('HTML & Semantics', '2 weeks', ['Document structure', 'Forms', 'Semantic elements', 'Accessibility basics']),
      phase('CSS & Responsive Design', '4 weeks', ['Box model', 'Flexbox & Grid', 'Media queries', 'CSS variables']),
      phase('JavaScript', '5 weeks', ['DOM manipulation', 'Events', 'fetch & async/await', 'ES modules']),
      phase('How the Web Works', '2 weeks', ['HTTP & status codes', 'DNS & hosting', 'HTTPS', 'Browser caching']),
      phase('Performance & Deployment', '3 weeks', ['Lighthouse audits', 'Image optimization', 'SEO basics', 'Deploy a portfolio']),
    ],
    courses: [
      course('Responsive Web Design Certification', 'freeCodeCamp', 'Beginner', '~300 hours', 'Free', true, 'Hands-on HTML and CSS projects that build a responsive portfolio.'),
      course('The Odin Project: Foundations', 'The Odin Project', 'Beginner', 'Self-paced', 'Free', false, 'Project-based path through HTML, CSS, JavaScript, and Git.'),
    ],
    projects: [
      project('Personal Portfolio Website', 'Beginner', ['HTML', 'CSS', 'JavaScript'], '1 week', 'Responsive portfolio with projects, contact form, and dark mode.', 'A deployed site scoring 90+ on Lighthouse.'),
      project('Restaurant Landing Page', 'Beginner', ['HTML', 'CSS Grid', 'JavaScript'], '1 week', 'Multi-section landing page with a menu filter and booking form.', 'Pixel-accurate build from a Figma design.'),
    ],
    job: { title: 'Junior Web Developer', company: 'Pixelcraft Studio', location: 'Remote', workType: 'Remote', experience: '0-2 years' },
  },
  'frontend-developer': {
    tools: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Chrome DevTools'],
    resumeSummary: 'Frontend developer who builds polished, accessible user interfaces with React, TypeScript, and modern CSS.',
    roadmap: [
      phase('Modern JavaScript', '3 weeks', ['ES6+ syntax', 'Promises & async', 'Modules', 'Array methods']),
      phase('React Fundamentals', '5 weeks', ['Components & props', 'State & hooks', 'Lists & keys', 'React Router']),
      phase('Styling & Layout', '3 weeks', ['Flexbox & Grid', 'Tailwind CSS', 'Responsive design', 'Design systems']),
      phase('Quality & Accessibility', '3 weeks', ['TypeScript', 'Testing Library', 'ARIA & keyboard access', 'Performance profiling']),
      phase('Production Apps', '4 weeks', ['Data fetching & caching', 'Code splitting', 'Deploying to Vercel', 'Capstone dashboard']),
    ],
    courses: [
      course('Meta Front-End Developer Professional Certificate', 'Meta / Coursera', 'Beginner', '~7 months', 'Subscription', true, 'Industry-designed path from HTML and CSS to React and UX.'),
      course('Front End Development Libraries', 'freeCodeCamp', 'Intermediate', '~300 hours', 'Free', true, 'Practice React, Redux, and Bootstrap through certification projects.'),
    ],
    projects: [
      project('Movie Discovery App', 'Intermediate', ['React', 'TypeScript', 'REST API'], '2 weeks', 'Search and browse films from a public API with filters and favourites.', 'Responsive SPA with loading, error, and empty states.'),
      project('Accessible Component Library', 'Advanced', ['React', 'Storybook', 'Testing Library'], '3 weeks', 'Build buttons, modals, tabs, and forms that meet WCAG guidelines.', 'Published Storybook with keyboard and screen reader tests.'),
    ],
    job: { title: 'Frontend Developer (React)', company: 'Kitebird Labs', location: 'Seattle, WA', workType: 'Hybrid', experience: '1-3 years' },
  },
  'backend-developer': {
    tools: ['Node.js / Java', 'PostgreSQL', 'Redis', 'Docker', 'Postman'],
    resumeSummary: 'Backend developer who designs secure, scalable APIs and data models, with experience in SQL and NoSQL databases, caching, and authentication.',
    roadmap: [
      phase('Server-side Language', '4 weeks', ['Node.js, Java or Python', 'HTTP servers', 'Error handling', 'Package management']),
      phase('APIs', '4 weeks', ['REST design', 'Validation', 'Pagination', 'API documentation']),
      phase('Databases', '5 weeks', ['SQL & joins', 'Indexing', 'Transactions & ACID', 'MongoDB basics']),
      phase('Security & Auth', '3 weeks', ['Password hashing', 'JWT & sessions', 'OWASP Top 10', 'Rate limiting']),
      phase('Scaling', '4 weeks', ['Caching with Redis', 'Message queues', 'Docker', 'Monitoring & logging']),
    ],
    courses: [
      course('Meta Back-End Developer Professional Certificate', 'Meta / Coursera', 'Beginner', '~8 months', 'Subscription', true, 'Covers Python, Django, APIs, databases, and deployment.'),
      course('Back End Development and APIs', 'freeCodeCamp', 'Intermediate', '~300 hours', 'Free', true, 'Build Node.js, Express, and MongoDB microservices.'),
    ],
    projects: [
      project('E-commerce REST API', 'Intermediate', ['Node.js', 'Express', 'PostgreSQL', 'JWT'], '3 weeks', 'Products, carts, orders, and payments with role-based access.', 'Documented API with tests and seed data.'),
      project('Job Queue Notification Service', 'Advanced', ['Node.js', 'Redis', 'RabbitMQ', 'Docker'], '3 weeks', 'Send email and SMS notifications asynchronously with retries.', 'Containerized service with metrics and a dead-letter queue.'),
    ],
    job: { title: 'Backend Engineer (Node.js)', company: 'Ironleaf Payments', location: 'Chicago, IL', workType: 'Hybrid', experience: '1-3 years' },
  },
  'full-stack-developer': {
    tools: ['React', 'Node.js & Express', 'PostgreSQL / MongoDB', 'Docker', 'GitHub Actions'],
    resumeSummary: 'Full stack developer who ships features end to end, from React interfaces through Node.js APIs to databases and cloud deployment.',
    roadmap: [
      phase('Web Fundamentals', '4 weeks', ['HTML & CSS', 'JavaScript', 'Git', 'HTTP basics']),
      phase('Frontend with React', '5 weeks', ['Components & hooks', 'Routing', 'Forms', 'State management']),
      phase('Backend with Node.js', '5 weeks', ['Express & middleware', 'REST APIs', 'Authentication', 'Validation']),
      phase('Data & Integration', '4 weeks', ['SQL & ORMs', 'MongoDB', 'CORS', 'File uploads']),
      phase('Shipping to Production', '4 weeks', ['Docker', 'CI/CD', 'Environment config', 'Full stack capstone']),
    ],
    courses: [
      course('Full Stack Open', 'University of Helsinki', 'Intermediate', 'Self-paced', 'Free', true, 'Deep, modern coverage of React, Node.js, GraphQL, TypeScript, and testing.'),
      course('IBM Full Stack Software Developer Professional Certificate', 'IBM / Coursera', 'Beginner', '~5 months', 'Subscription', true, 'Broad path covering frontend, backend, cloud, and containers.'),
    ],
    projects: [
      project('Job Application Tracker', 'Intermediate', ['React', 'Node.js', 'PostgreSQL', 'JWT'], '3 weeks', 'Track applications with statuses, reminders, and notes.', 'Deployed full stack app with authentication.'),
      project('Real-time Chat App', 'Advanced', ['React', 'Socket.IO', 'MongoDB', 'Docker'], '3 weeks', 'Rooms, typing indicators, and message history.', 'Containerized app deployed with CI/CD.'),
    ],
    job: { title: 'Full Stack Developer (MERN)', company: 'Sproutline Tech', location: 'Remote', workType: 'Remote', experience: '1-3 years' },
  },
  'app-developer': {
    tools: ['Flutter / React Native', 'Android Studio', 'Xcode', 'Firebase', 'Figma'],
    resumeSummary: 'App developer who builds cross-platform mobile apps with Flutter and React Native, focusing on smooth UX, offline support, and store-ready releases.',
    roadmap: [
      phase('Mobile Foundations', '3 weeks', ['Dart or JavaScript', 'Mobile UI principles', 'Emulators & devices', 'Git']),
      phase('Cross-platform Framework', '6 weeks', ['Flutter widgets or RN components', 'Navigation', 'State management', 'Forms']),
      phase('Data & Networking', '4 weeks', ['REST APIs', 'Local storage (SQLite)', 'Offline sync', 'Firebase']),
      phase('Device Features', '3 weeks', ['Camera & location', 'Push notifications', 'Permissions', 'Secure storage']),
      phase('Publishing', '3 weeks', ['App signing', 'Play Store & App Store', 'Crash reporting', 'Capstone app']),
    ],
    courses: [
      course('Flutter & Dart: The Complete Guide', 'Udemy', 'Beginner', 'Self-paced video', 'Paid', true, 'Popular hands-on course building real Flutter apps for Android and iOS.'),
      course('React Native Specialization', 'Meta / Coursera', 'Intermediate', '~5 months', 'Subscription', true, 'Build cross-platform apps with React Native from a JavaScript background.'),
    ],
    projects: [
      project('Habit Tracker App', 'Beginner', ['Flutter', 'Dart', 'SQLite'], '2 weeks', 'Daily habits with streaks, reminders, and charts.', 'Works fully offline with local notifications.'),
      project('Campus Events App', 'Intermediate', ['React Native', 'Firebase', 'Push Notifications'], '3 weeks', 'Browse, RSVP, and get reminders for college events.', 'Published test build on Android and iOS.'),
    ],
    job: { title: 'Mobile App Developer (Flutter)', company: 'Nimbus Apps Co.', location: 'Denver, CO', workType: 'Hybrid', experience: '0-2 years' },
  },
  'android-developer': {
    tools: ['Android Studio', 'Kotlin', 'Jetpack Compose', 'Firebase', 'Gradle'],
    resumeSummary: 'Android developer who builds native apps in Kotlin with Jetpack Compose, MVVM architecture, Room, and coroutines.',
    roadmap: [
      phase('Kotlin', '3 weeks', ['Syntax & null safety', 'Collections', 'Lambdas', 'Classes & data classes']),
      phase('Android Basics', '4 weeks', ['Activities & lifecycle', 'Manifest & permissions', 'Intents', 'Resources']),
      phase('Jetpack Compose UI', '4 weeks', ['Composables', 'State', 'Navigation', 'Material 3']),
      phase('Architecture & Data', '5 weeks', ['MVVM & ViewModel', 'Room', 'Retrofit', 'Coroutines & Flow']),
      phase('Release', '3 weeks', ['Testing with Espresso', 'App bundles & signing', 'Play Console', 'Capstone app']),
    ],
    courses: [
      course('Android Basics with Compose', 'Google for Developers', 'Beginner', 'Self-paced', 'Free', false, 'Google\'s official course for building Android apps with Kotlin and Compose.'),
      course('Meta Android Developer Professional Certificate', 'Meta / Coursera', 'Beginner', '~8 months', 'Subscription', true, 'Structured path from programming basics to a portfolio-ready Android app.'),
    ],
    projects: [
      project('Notes App with Room', 'Beginner', ['Kotlin', 'Jetpack Compose', 'Room'], '2 weeks', 'Create, search, and tag notes stored locally.', 'MVVM app with unit tests.'),
      project('Weather Forecast App', 'Intermediate', ['Kotlin', 'Retrofit', 'Coroutines', 'Hilt'], '2 weeks', 'Location-based forecasts from a public weather API.', 'Clean architecture app with offline caching.'),
    ],
    job: { title: 'Android Developer (Kotlin)', company: 'Greenfern Mobile', location: 'Boston, MA', workType: 'On-site', experience: '1-3 years' },
  },
  'ios-developer': {
    tools: ['Xcode', 'Swift', 'SwiftUI', 'TestFlight', 'Instruments'],
    resumeSummary: 'iOS developer who builds native iPhone and iPad apps with Swift and SwiftUI, with attention to performance, memory, and Apple design guidelines.',
    roadmap: [
      phase('Swift', '3 weeks', ['Types & optionals', 'Structs vs classes', 'Protocols', 'Closures']),
      phase('SwiftUI', '5 weeks', ['Views & modifiers', 'State & bindings', 'Navigation', 'Lists']),
      phase('UIKit Essentials', '3 weeks', ['View controllers', 'Auto Layout', 'Table views', 'UIKit interop']),
      phase('Data & Concurrency', '4 weeks', ['URLSession & Codable', 'async/await', 'SwiftData / Core Data', 'ARC & retain cycles']),
      phase('Shipping', '3 weeks', ['XCTest', 'Instruments profiling', 'TestFlight', 'App Store submission']),
    ],
    courses: [
      course('100 Days of SwiftUI', 'Hacking with Swift', 'Beginner', '100 days', 'Free', false, 'Daily lessons and projects covering Swift and SwiftUI from scratch.'),
      course('Meta iOS Developer Professional Certificate', 'Meta / Coursera', 'Beginner', '~8 months', 'Subscription', true, 'Structured path to building and publishing iOS apps.'),
    ],
    projects: [
      project('Expense Splitter App', 'Beginner', ['Swift', 'SwiftUI', 'SwiftData'], '2 weeks', 'Split bills among friends and track who owes what.', 'Polished SwiftUI app following Apple HIG.'),
      project('Photo Journal App', 'Intermediate', ['Swift', 'UIKit', 'Core Data', 'MapKit'], '3 weeks', 'Geotagged photo journal with map view and search.', 'TestFlight build with memory profiling notes.'),
    ],
    job: { title: 'iOS Developer (Swift)', company: 'Orchard Lane Digital', location: 'San Francisco, CA', workType: 'Hybrid', experience: '1-3 years' },
  },
  'game-developer': {
    tools: ['Unity', 'Unreal Engine', 'Blender', 'Visual Studio', 'Git LFS'],
    resumeSummary: 'Game developer who builds gameplay systems in Unity and C#, with a solid grasp of game math, physics, and performance optimization.',
    roadmap: [
      phase('Programming for Games', '4 weeks', ['C# basics', 'OOP for gameplay', 'Unity editor', 'Version control with LFS']),
      phase('Game Math & Physics', '4 weeks', ['Vectors & dot products', 'Transforms', 'Rigidbodies & colliders', 'Raycasting']),
      phase('Gameplay Systems', '5 weeks', ['Player controllers', 'AI & state machines', 'UI & HUD', 'Save systems']),
      phase('Graphics & Audio', '3 weeks', ['Materials & shaders', 'Lighting', 'Particles', 'Audio mixing']),
      phase('Polish & Publish', '4 weeks', ['Profiling & LOD', 'Object pooling', 'Build pipelines', 'Publish on itch.io']),
    ],
    courses: [
      course('Unity Junior Programmer Pathway', 'Unity Learn', 'Beginner', 'Self-paced', 'Free', false, 'Unity\'s own path to C# scripting and core gameplay programming.'),
      course('Game Design and Development with Unity Specialization', 'Michigan State University / Coursera', 'Beginner', '~4 months', 'Free to audit', true, 'Build several complete games while learning design and development.'),
    ],
    projects: [
      project('2D Platformer', 'Beginner', ['Unity', 'C#', 'Tilemaps'], '3 weeks', 'Three levels with enemies, collectibles, and checkpoints.', 'Playable WebGL build on itch.io.'),
      project('Top-down Shooter with AI', 'Intermediate', ['Unity', 'C#', 'NavMesh', 'Object Pooling'], '4 weeks', 'Wave-based shooter with pathfinding enemies and upgrades.', 'Stable 60 FPS build with a profiling write-up.'),
    ],
    job: { title: 'Junior Gameplay Programmer (Unity)', company: 'Starforge Games', location: 'Austin, TX', workType: 'On-site', experience: '0-2 years' },
  },
  'ai-engineer': {
    tools: ['Python', 'LLM APIs', 'LangChain / LlamaIndex', 'Vector databases', 'FastAPI'],
    resumeSummary: 'AI engineer who builds LLM-powered applications with retrieval-augmented generation, embeddings, and careful evaluation and safety practices.',
    roadmap: [
      phase('Python & APIs', '3 weeks', ['Python for production', 'REST APIs with FastAPI', 'Async programming', 'Environment & secrets']),
      phase('LLM Fundamentals', '3 weeks', ['Transformers & tokens', 'Prompt engineering', 'Temperature & sampling', 'Function / tool calling']),
      phase('Retrieval-Augmented Generation', '4 weeks', ['Embeddings', 'Chunking strategies', 'Vector databases', 'Re-ranking']),
      phase('Evaluation & Safety', '3 weeks', ['LLM evals', 'Hallucination checks', 'Prompt injection defence', 'Guardrails']),
      phase('Deploying AI Apps', '4 weeks', ['Streaming responses', 'Cost & latency tuning', 'Monitoring', 'Capstone AI assistant']),
    ],
    courses: [
      course('Generative AI with Large Language Models', 'DeepLearning.AI & AWS / Coursera', 'Intermediate', '~3 weeks', 'Free to audit', true, 'Explains how LLMs work, fine-tuning, and deployment trade-offs.'),
      course('ChatGPT Prompt Engineering for Developers', 'DeepLearning.AI', 'Beginner', '~1.5 hours', 'Free', false, 'Short, practical course on prompting LLMs from code.'),
    ],
    projects: [
      project('Document Q&A Assistant (RAG)', 'Intermediate', ['Python', 'Embeddings', 'pgvector', 'FastAPI'], '3 weeks', 'Upload PDFs and ask questions answered with cited sources.', 'Deployed assistant with an evaluation set and accuracy report.'),
      project('AI Support Agent with Tools', 'Advanced', ['Python', 'LLM tool calling', 'Redis', 'Docker'], '4 weeks', 'Agent that looks up orders and drafts replies with guardrails.', 'Agent with logged traces and prompt-injection tests.'),
    ],
    job: { title: 'AI Engineer (LLM Applications)', company: 'Quillmind AI', location: 'San Francisco, CA', workType: 'Hybrid', experience: '1-3 years' },
  },
  'ml-engineer': {
    tools: ['Python', 'scikit-learn', 'PyTorch / TensorFlow', 'MLflow', 'Docker'],
    resumeSummary: 'Machine learning engineer who trains, evaluates, and deploys models, with experience in feature engineering, experiment tracking, and MLOps.',
    roadmap: [
      phase('Math & Python', '4 weeks', ['Linear algebra', 'Probability', 'NumPy & pandas', 'Data visualization']),
      phase('Classical ML', '5 weeks', ['Regression & classification', 'Trees & ensembles', 'Cross-validation', 'Metrics']),
      phase('Deep Learning', '5 weeks', ['Neural networks', 'PyTorch', 'CNNs & transformers', 'Regularization']),
      phase('Feature & Data Engineering', '3 weeks', ['Feature scaling', 'Handling leakage', 'Pipelines', 'Imbalanced data']),
      phase('MLOps', '4 weeks', ['Experiment tracking', 'Model serving', 'Monitoring drift', 'Capstone deployment']),
    ],
    courses: [
      course('Machine Learning Specialization', 'Stanford & DeepLearning.AI / Coursera', 'Beginner', '~3 months', 'Free to audit', true, 'Andrew Ng\'s updated foundation in supervised and unsupervised learning.'),
      course('Deep Learning Specialization', 'DeepLearning.AI / Coursera', 'Intermediate', '~4 months', 'Free to audit', true, 'Neural networks, CNNs, sequence models, and practical tuning.'),
    ],
    projects: [
      project('Customer Churn Prediction', 'Intermediate', ['Python', 'scikit-learn', 'XGBoost', 'SQL'], '3 weeks', 'Predict churn from customer behaviour and explain key drivers.', 'Model with SHAP explanations and a business summary.'),
      project('Image Classifier with Model Serving', 'Advanced', ['PyTorch', 'FastAPI', 'MLflow', 'Docker'], '4 weeks', 'Train an image classifier and serve it behind an API.', 'Tracked experiments and a containerized inference service.'),
    ],
    job: { title: 'Machine Learning Engineer', company: 'Vectorpeak Analytics', location: 'Seattle, WA', workType: 'Hybrid', experience: '1-3 years' },
  },
  'data-scientist': {
    tools: ['Python & pandas', 'Jupyter', 'scikit-learn', 'SQL', 'Tableau'],
    resumeSummary: 'Data scientist who turns complex data into insights and predictive models using statistics, Python, SQL, and clear storytelling.',
    roadmap: [
      phase('Python & SQL for Data', '4 weeks', ['pandas & NumPy', 'SQL queries', 'Data cleaning', 'Jupyter workflows']),
      phase('Statistics', '4 weeks', ['Descriptive statistics', 'Probability distributions', 'Hypothesis testing', 'Confidence intervals']),
      phase('Machine Learning', '5 weeks', ['Regression', 'Classification', 'Clustering & PCA', 'Model evaluation']),
      phase('Experimentation', '3 weeks', ['A/B test design', 'Sample size', 'Causal thinking', 'Interpreting results']),
      phase('Communication', '3 weeks', ['Data visualization', 'Storytelling', 'Stakeholder reports', 'Capstone case study']),
    ],
    courses: [
      course('IBM Data Science Professional Certificate', 'IBM / Coursera', 'Beginner', '~5 months', 'Subscription', true, 'Covers Python, SQL, data analysis, visualization, and machine learning.'),
      course('Statistics with Python Specialization', 'University of Michigan / Coursera', 'Intermediate', '~3 months', 'Free to audit', true, 'Builds the statistical inference skills data science relies on.'),
    ],
    projects: [
      project('A/B Test Analysis', 'Intermediate', ['Python', 'SciPy', 'pandas'], '2 weeks', 'Analyze a website experiment and recommend a launch decision.', 'Notebook with statistical tests and an executive summary.'),
      project('Sales Forecasting', 'Intermediate', ['Python', 'Prophet', 'SQL', 'Tableau'], '3 weeks', 'Forecast monthly sales and highlight seasonal trends.', 'Forecast dashboard with accuracy metrics.'),
    ],
    job: { title: 'Junior Data Scientist', company: 'Clearwave Insights', location: 'Remote', workType: 'Remote', experience: '0-2 years' },
  },
  'data-analyst': {
    tools: ['SQL', 'Excel', 'Power BI', 'Tableau', 'Python'],
    resumeSummary: 'Data analyst who answers business questions with SQL, Excel, and Power BI, and communicates findings through clear dashboards and reports.',
    roadmap: [
      phase('Excel', '3 weeks', ['Formulas & XLOOKUP', 'Pivot tables', 'Charts', 'Data cleaning']),
      phase('SQL', '4 weeks', ['SELECT & filtering', 'JOINs', 'GROUP BY & HAVING', 'Window functions']),
      phase('Visualization & BI', '4 weeks', ['Chart selection', 'Power BI data models', 'DAX basics', 'Dashboard design']),
      phase('Statistics for Analysis', '3 weeks', ['Descriptive statistics', 'Percent change & growth', 'Correlation', 'A/B test basics']),
      phase('Business Analysis', '3 weeks', ['Defining KPIs', 'Stakeholder questions', 'Presenting insights', 'Capstone dashboard']),
    ],
    courses: [
      course('Google Data Analytics Professional Certificate', 'Google / Coursera', 'Beginner', '~6 months', 'Subscription', true, 'Covers spreadsheets, SQL, Tableau, and R with a capstone case study.'),
      course('Microsoft Power BI Data Analyst Professional Certificate', 'Microsoft / Coursera', 'Beginner', '~5 months', 'Subscription', true, 'Prepares you for Power BI dashboards and the PL-300 exam.'),
    ],
    projects: [
      project('Sales Performance Dashboard', 'Beginner', ['Power BI', 'SQL', 'Excel'], '2 weeks', 'Track revenue, margin, and regional performance against targets.', 'Interactive dashboard with KPI definitions.'),
      project('Customer Segmentation Analysis', 'Intermediate', ['SQL', 'Python', 'Tableau'], '2 weeks', 'Segment customers by recency, frequency, and spend (RFM).', 'Report with segment profiles and marketing recommendations.'),
    ],
    job: { title: 'Junior Data Analyst', company: 'Northstar Analytics', location: 'Remote', workType: 'Remote', experience: '0-2 years' },
  },
  'data-engineer': {
    tools: ['SQL', 'Python', 'Apache Spark', 'Apache Airflow', 'Snowflake / BigQuery'],
    resumeSummary: 'Data engineer who builds reliable batch and streaming pipelines, data warehouses, and orchestration with SQL, Python, Spark, and Airflow.',
    roadmap: [
      phase('SQL & Python', '4 weeks', ['Advanced SQL', 'Python scripting', 'Working with APIs', 'Linux & shell']),
      phase('Data Modelling & Warehousing', '4 weeks', ['Star schemas', 'Slowly changing dimensions', 'Snowflake / BigQuery', 'dbt']),
      phase('Pipelines & Orchestration', '4 weeks', ['ETL vs ELT', 'Airflow DAGs', 'Idempotent tasks', 'Data quality checks']),
      phase('Big Data & Streaming', '5 weeks', ['Spark DataFrames', 'Parquet & partitioning', 'Kafka basics', 'Stream processing']),
      phase('Cloud & Production', '3 weeks', ['Cloud storage', 'Docker', 'Infrastructure as code', 'Capstone pipeline']),
    ],
    courses: [
      course('Data Engineering Zoomcamp', 'DataTalks.Club', 'Intermediate', 'Self-paced or cohort', 'Free', true, 'Hands-on course covering Docker, Terraform, warehousing, Spark, and Kafka.'),
      course('IBM Data Engineering Professional Certificate', 'IBM / Coursera', 'Beginner', '~6 months', 'Subscription', true, 'Broad foundation in databases, ETL, big data, and pipelines.'),
    ],
    projects: [
      project('End-to-end ELT Pipeline', 'Intermediate', ['Python', 'Airflow', 'dbt', 'BigQuery'], '3 weeks', 'Ingest public data daily, model it with dbt, and serve a dashboard.', 'Scheduled pipeline with tests and documentation.'),
      project('Real-time Clickstream Processing', 'Advanced', ['Kafka', 'Spark Streaming', 'Parquet', 'Docker'], '4 weeks', 'Process simulated website events into live aggregates.', 'Streaming pipeline with a latency and throughput report.'),
    ],
    job: { title: 'Data Engineer', company: 'Riverstone Data', location: 'New York, NY', workType: 'Hybrid', experience: '1-3 years' },
  },
};

export const allRoles = roleAssessments.map((role) => {
  const details = roleCareerData[role.slug];
  return { ...role, ...details, job: { ...details.job, salary: role.salary, skills: role.skills } };
});

export const getRole = (slug) => allRoles.find((role) => role.slug === slug);

export const findRoleByTitle = (title) => allRoles.find((role) => role.title === title);
