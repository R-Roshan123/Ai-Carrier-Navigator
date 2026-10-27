// Learning roadmap for each role: five phases, each matching the lesson of the same
// position in the role's course. Topic ids are derived from the text, so renaming a
// topic resets its saved progress. Shared by the client and the server (to validate progress).

const slugify = (text) => text.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const phase = (name, duration, topics) => ({ name, duration, topics });

const phases = {
  'software-engineer': [
      phase('Programming Foundations', '4 weeks', ['One language in depth (Java, C++ or Python)', 'Control flow & functions', 'OOP basics', 'Git workflow']),
      phase('Data Structures & Algorithms', '8 weeks', ['Arrays, lists, hash maps', 'Trees & graphs', 'Sorting & searching', 'Big-O analysis']),
      phase('Software Engineering Practices', '4 weeks', ['SOLID & design patterns', 'Unit & integration testing', 'Code review', 'CI basics']),
      phase('System Design', '5 weeks', ['Load balancing & caching', 'Databases & sharding', 'CAP theorem', 'Designing a URL shortener']),
      phase('Portfolio & Interviews', '4 weeks', ['Capstone project', 'LeetCode practice', 'Mock system design interviews', 'Behavioural prep']),
  ],
  'software-developer': [
      phase('Language Fundamentals', '4 weeks', ['Java or C# syntax', 'Collections', 'Exceptions', 'File I/O']),
      phase('Object-Oriented Design', '4 weeks', ['Classes & interfaces', 'Inheritance & polymorphism', 'Design patterns', 'UML basics']),
      phase('Databases & APIs', '4 weeks', ['SQL basics', 'JDBC / ORM', 'Consuming REST APIs', 'JSON']),
      phase('Testing & Debugging', '3 weeks', ['Unit testing', 'Debugger tools', 'Logging', 'Refactoring']),
      phase('Agile Delivery', '3 weeks', ['Scrum & sprints', 'Pull requests & code review', 'Capstone app', 'Interview prep']),
  ],
  'web-developer': [
      phase('HTML & Semantics', '2 weeks', ['Document structure', 'Forms', 'Semantic elements', 'Accessibility basics']),
      phase('CSS & Responsive Design', '4 weeks', ['Box model', 'Flexbox & Grid', 'Media queries', 'CSS variables']),
      phase('JavaScript', '5 weeks', ['DOM manipulation', 'Events', 'fetch & async/await', 'ES modules']),
      phase('How the Web Works', '2 weeks', ['HTTP & status codes', 'DNS & hosting', 'HTTPS', 'Browser caching']),
      phase('Performance & Deployment', '3 weeks', ['Lighthouse audits', 'Image optimization', 'SEO basics', 'Deploy a portfolio']),
  ],
  'frontend-developer': [
      phase('Modern JavaScript', '3 weeks', ['ES6+ syntax', 'Promises & async', 'Modules', 'Array methods']),
      phase('React Fundamentals', '5 weeks', ['Components & props', 'State & hooks', 'Lists & keys', 'React Router']),
      phase('Styling & Layout', '3 weeks', ['Flexbox & Grid', 'Tailwind CSS', 'Responsive design', 'Design systems']),
      phase('Quality & Accessibility', '3 weeks', ['TypeScript', 'Testing Library', 'ARIA & keyboard access', 'Performance profiling']),
      phase('Production Apps', '4 weeks', ['Data fetching & caching', 'Code splitting', 'Deploying to Vercel', 'Capstone dashboard']),
  ],
  'backend-developer': [
      phase('Server-side Language', '4 weeks', ['Node.js, Java or Python', 'HTTP servers', 'Error handling', 'Package management']),
      phase('APIs', '4 weeks', ['REST design', 'Validation', 'Pagination', 'API documentation']),
      phase('Databases', '5 weeks', ['SQL & joins', 'Indexing', 'Transactions & ACID', 'MongoDB basics']),
      phase('Security & Auth', '3 weeks', ['Password hashing', 'JWT & sessions', 'OWASP Top 10', 'Rate limiting']),
      phase('Scaling', '4 weeks', ['Caching with Redis', 'Message queues', 'Docker', 'Monitoring & logging']),
  ],
  'full-stack-developer': [
      phase('Web Fundamentals', '4 weeks', ['HTML & CSS', 'JavaScript', 'Git', 'HTTP basics']),
      phase('Frontend with React', '5 weeks', ['Components & hooks', 'Routing', 'Forms', 'State management']),
      phase('Backend with Node.js', '5 weeks', ['Express & middleware', 'REST APIs', 'Authentication', 'Validation']),
      phase('Data & Integration', '4 weeks', ['SQL & ORMs', 'MongoDB', 'CORS', 'File uploads']),
      phase('Shipping to Production', '4 weeks', ['Docker', 'CI/CD', 'Environment config', 'Full stack capstone']),
  ],
  'app-developer': [
      phase('Mobile Foundations', '3 weeks', ['Dart or JavaScript', 'Mobile UI principles', 'Emulators & devices', 'Git']),
      phase('Cross-platform Framework', '6 weeks', ['Flutter widgets or RN components', 'Navigation', 'State management', 'Forms']),
      phase('Data & Networking', '4 weeks', ['REST APIs', 'Local storage (SQLite)', 'Offline sync', 'Firebase']),
      phase('Device Features', '3 weeks', ['Camera & location', 'Push notifications', 'Permissions', 'Secure storage']),
      phase('Publishing', '3 weeks', ['App signing', 'Play Store & App Store', 'Crash reporting', 'Capstone app']),
  ],
  'android-developer': [
      phase('Kotlin', '3 weeks', ['Syntax & null safety', 'Collections', 'Lambdas', 'Classes & data classes']),
      phase('Android Basics', '4 weeks', ['Activities & lifecycle', 'Manifest & permissions', 'Intents', 'Resources']),
      phase('Jetpack Compose UI', '4 weeks', ['Composables', 'State', 'Navigation', 'Material 3']),
      phase('Architecture & Data', '5 weeks', ['MVVM & ViewModel', 'Room', 'Retrofit', 'Coroutines & Flow']),
      phase('Release', '3 weeks', ['Testing with Espresso', 'App bundles & signing', 'Play Console', 'Capstone app']),
  ],
  'ios-developer': [
      phase('Swift', '3 weeks', ['Types & optionals', 'Structs vs classes', 'Protocols', 'Closures']),
      phase('SwiftUI', '5 weeks', ['Views & modifiers', 'State & bindings', 'Navigation', 'Lists']),
      phase('UIKit Essentials', '3 weeks', ['View controllers', 'Auto Layout', 'Table views', 'UIKit interop']),
      phase('Data & Concurrency', '4 weeks', ['URLSession & Codable', 'async/await', 'SwiftData / Core Data', 'ARC & retain cycles']),
      phase('Shipping', '3 weeks', ['XCTest', 'Instruments profiling', 'TestFlight', 'App Store submission']),
  ],
  'game-developer': [
      phase('Programming for Games', '4 weeks', ['C# basics', 'OOP for gameplay', 'Unity editor', 'Version control with LFS']),
      phase('Game Math & Physics', '4 weeks', ['Vectors & dot products', 'Transforms', 'Rigidbodies & colliders', 'Raycasting']),
      phase('Gameplay Systems', '5 weeks', ['Player controllers', 'AI & state machines', 'UI & HUD', 'Save systems']),
      phase('Graphics & Audio', '3 weeks', ['Materials & shaders', 'Lighting', 'Particles', 'Audio mixing']),
      phase('Polish & Publish', '4 weeks', ['Profiling & LOD', 'Object pooling', 'Build pipelines', 'Publish on itch.io']),
  ],
  'ai-engineer': [
      phase('Python & APIs', '3 weeks', ['Python for production', 'REST APIs with FastAPI', 'Async programming', 'Environment & secrets']),
      phase('LLM Fundamentals', '3 weeks', ['Transformers & tokens', 'Prompt engineering', 'Temperature & sampling', 'Function / tool calling']),
      phase('Retrieval-Augmented Generation', '4 weeks', ['Embeddings', 'Chunking strategies', 'Vector databases', 'Re-ranking']),
      phase('Evaluation & Safety', '3 weeks', ['LLM evals', 'Hallucination checks', 'Prompt injection defence', 'Guardrails']),
      phase('Deploying AI Apps', '4 weeks', ['Streaming responses', 'Cost & latency tuning', 'Monitoring', 'Capstone AI assistant']),
  ],
  'ml-engineer': [
      phase('Math & Python', '4 weeks', ['Linear algebra', 'Probability', 'NumPy & pandas', 'Data visualization']),
      phase('Classical ML', '5 weeks', ['Regression & classification', 'Trees & ensembles', 'Cross-validation', 'Metrics']),
      phase('Deep Learning', '5 weeks', ['Neural networks', 'PyTorch', 'CNNs & transformers', 'Regularization']),
      phase('Feature & Data Engineering', '3 weeks', ['Feature scaling', 'Handling leakage', 'Pipelines', 'Imbalanced data']),
      phase('MLOps', '4 weeks', ['Experiment tracking', 'Model serving', 'Monitoring drift', 'Capstone deployment']),
  ],
  'data-scientist': [
      phase('Python & SQL for Data', '4 weeks', ['pandas & NumPy', 'SQL queries', 'Data cleaning', 'Jupyter workflows']),
      phase('Statistics', '4 weeks', ['Descriptive statistics', 'Probability distributions', 'Hypothesis testing', 'Confidence intervals']),
      phase('Machine Learning', '5 weeks', ['Regression', 'Classification', 'Clustering & PCA', 'Model evaluation']),
      phase('Experimentation', '3 weeks', ['A/B test design', 'Sample size', 'Causal thinking', 'Interpreting results']),
      phase('Communication', '3 weeks', ['Data visualization', 'Storytelling', 'Stakeholder reports', 'Capstone case study']),
  ],
  'data-analyst': [
      phase('Excel', '3 weeks', ['Formulas & XLOOKUP', 'Pivot tables', 'Charts', 'Data cleaning']),
      phase('SQL', '4 weeks', ['SELECT & filtering', 'JOINs', 'GROUP BY & HAVING', 'Window functions']),
      phase('Visualization & BI', '4 weeks', ['Chart selection', 'Power BI data models', 'DAX basics', 'Dashboard design']),
      phase('Statistics for Analysis', '3 weeks', ['Descriptive statistics', 'Percent change & growth', 'Correlation', 'A/B test basics']),
      phase('Business Analysis', '3 weeks', ['Defining KPIs', 'Stakeholder questions', 'Presenting insights', 'Capstone dashboard']),
  ],
  'data-engineer': [
      phase('SQL & Python', '4 weeks', ['Advanced SQL', 'Python scripting', 'Working with APIs', 'Linux & shell']),
      phase('Data Modelling & Warehousing', '4 weeks', ['Star schemas', 'Slowly changing dimensions', 'Snowflake / BigQuery', 'dbt']),
      phase('Pipelines & Orchestration', '4 weeks', ['ETL vs ELT', 'Airflow DAGs', 'Idempotent tasks', 'Data quality checks']),
      phase('Big Data & Streaming', '5 weeks', ['Spark DataFrames', 'Parquet & partitioning', 'Kafka basics', 'Stream processing']),
      phase('Cloud & Production', '3 weeks', ['Cloud storage', 'Docker', 'Infrastructure as code', 'Capstone pipeline']),
  ],
};

// Adds a stable id to every topic, e.g. "2-big-o-analysis" for phase 2.
export const roadmaps = Object.fromEntries(
  Object.entries(phases).map(([slug, list]) => [
    slug,
    list.map((item, index) => ({
      ...item,
      topics: item.topics.map((title) => ({ id: `${index + 1}-${slugify(title)}`, title })),
    })),
  ]),
);

export const roadmapTopicIds = (slug) => (roadmaps[slug] || []).flatMap((item) => item.topics.map((topic) => topic.id));
