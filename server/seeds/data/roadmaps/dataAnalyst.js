import { resource } from './resource.js';

export default {
  role: 'data-analyst',
  stages: [
    {
      title: 'Foundation',
      description: 'Build spreadsheet and statistics fundamentals that every analysis relies on.',
      steps: [
        {
          title: 'Excel & Spreadsheets',
          description: 'Clean, summarise, and chart data in Excel or Google Sheets.',
          topics: ['Formulas & lookups (XLOOKUP)', 'Pivot tables', 'Conditional formatting', 'Charts', 'Basic data cleaning'],
          skills: ['Excel'],
          resources: [
            resource('Microsoft Excel help & learning', 'https://support.microsoft.com/en-us/excel', 'Docs'),
            resource('Google Sheets training', 'https://support.google.com/a/users/answer/9282959', 'Docs'),
          ],
          projects: ['Monthly sales dashboard with pivot tables'],
          estimatedHours: 30,
          certifications: [],
        },
        {
          title: 'Statistics Fundamentals',
          description: 'Describe data and draw reliable conclusions from samples.',
          topics: ['Descriptive statistics', 'Probability & distributions', 'Sampling', 'Hypothesis testing', 'Correlation & regression'],
          skills: ['Statistics'],
          resources: [
            resource('Khan Academy – Statistics & Probability', 'https://www.khanacademy.org/math/statistics-probability'),
            resource('OpenIntro Statistics (free textbook)', 'https://www.openintro.org/book/os/', 'Book'),
          ],
          projects: ['Statistical summary report on a public dataset'],
          estimatedHours: 40,
          certifications: [],
        },
      ],
    },
    {
      title: 'Intermediate',
      description: 'Query databases and work with data programmatically.',
      steps: [
        {
          title: 'SQL for Analysis',
          description: 'Answer business questions directly from relational databases.',
          topics: ['SELECT, WHERE, ORDER BY', 'Joins', 'GROUP BY & aggregates', 'Subqueries & CTEs', 'Window functions'],
          skills: ['SQL'],
          resources: [
            resource('SQLBolt', 'https://sqlbolt.com/', 'Practice'),
            resource('Kaggle Learn – Intro to SQL', 'https://www.kaggle.com/learn/intro-to-sql'),
            resource('Mode – SQL Tutorial', 'https://mode.com/sql-tutorial/', 'Docs'),
          ],
          projects: ['Analyse an e-commerce orders dataset with SQL'],
          estimatedHours: 45,
          certifications: [],
        },
        {
          title: 'Python, Pandas & Data Cleaning',
          description: 'Load, clean, transform, and explore data with Python and Pandas.',
          topics: ['Python basics', 'Jupyter notebooks', 'Pandas DataFrames', 'Handling missing values & duplicates', 'Merging & reshaping', 'Exploratory data analysis'],
          skills: ['Python', 'Pandas', 'Data Cleaning'],
          resources: [
            resource('Kaggle Learn – Python', 'https://www.kaggle.com/learn/python'),
            resource('Kaggle Learn – Pandas', 'https://www.kaggle.com/learn/pandas'),
            resource('Kaggle Learn – Data Cleaning', 'https://www.kaggle.com/learn/data-cleaning'),
          ],
          projects: ['Clean and explore a messy real-world dataset in a notebook'],
          estimatedHours: 50,
          certifications: ['nptel-python-ds', 'ibm-data-analyst'],
        },
      ],
    },
    {
      title: 'Advanced',
      description: 'Visualise insights and evaluate experiments.',
      steps: [
        {
          title: 'Data Visualization with Power BI',
          description: 'Model data and build interactive dashboards in Power BI.',
          topics: ['Power Query', 'Data modelling & relationships', 'DAX measures', 'Visual best practices', 'Publishing & sharing'],
          skills: ['Power BI', 'Data Visualization'],
          resources: [
            resource('Microsoft Learn – Power BI', 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi'),
          ],
          projects: ['HR attrition or sales performance dashboard in Power BI'],
          estimatedHours: 40,
          certifications: ['pl-300'],
        },
        {
          title: 'Tableau',
          description: 'Build dashboards and visual stories with Tableau.',
          topics: ['Connecting data', 'Calculated fields', 'LOD expressions', 'Dashboards & actions'],
          skills: ['Tableau'],
          resources: [
            resource('Tableau free training videos', 'https://www.tableau.com/learn/training', 'Video'),
            resource('Tableau Public gallery', 'https://public.tableau.com/app/discover', 'Practice'),
          ],
          projects: ['Publish an interactive dashboard on Tableau Public'],
          estimatedHours: 25,
          certifications: ['tableau-analyst'],
        },
        {
          title: 'Experimentation & A/B Testing',
          description: 'Design experiments and judge whether results are statistically meaningful.',
          topics: ['Experiment design', 'Metrics & guardrails', 'Statistical significance & power', 'Common pitfalls'],
          skills: ['A/B Testing'],
          resources: [
            resource('Udacity – A/B Testing (free)', 'https://www.udacity.com/course/ab-testing--ud257'),
          ],
          projects: ['Analyse a public A/B test dataset and write a recommendation'],
          estimatedHours: 20,
          certifications: [],
        },
      ],
    },
    {
      title: 'Job-Ready',
      description: 'Communicate insights, build a portfolio, and prepare for interviews.',
      steps: [
        {
          title: 'Data Storytelling',
          description: 'Turn analysis into clear narratives and recommendations for stakeholders.',
          topics: ['Choosing the right chart', 'Decluttering visuals', 'Structuring a narrative', 'Presenting to non-technical audiences'],
          skills: ['Data Storytelling'],
          resources: [
            resource('Storytelling with Data – blog & resources', 'https://www.storytellingwithdata.com/', 'Article'),
          ],
          projects: ['10-minute insight presentation from one of your projects'],
          estimatedHours: 15,
          certifications: [],
        },
        {
          title: 'Capstone Portfolio',
          description: 'Complete an end-to-end analysis from raw data to a published dashboard and write-up.',
          topics: ['Problem framing', 'Data sourcing', 'Analysis & dashboard', 'Written case study'],
          skills: [],
          resources: [
            resource('Kaggle Datasets', 'https://www.kaggle.com/datasets', 'Practice'),
          ],
          projects: ['End-to-end case study (SQL + Python + dashboard) published on GitHub'],
          estimatedHours: 50,
          certifications: ['google-data-analytics'],
        },
        {
          title: 'Interview Prep: SQL & Case Studies',
          description: 'Practise timed SQL problems and business case questions.',
          topics: ['SQL interview patterns', 'Product metrics questions', 'Guesstimates', 'Behavioural questions'],
          skills: [],
          resources: [
            resource('LeetCode – Top SQL 50', 'https://leetcode.com/studyplan/top-sql-50/', 'Practice'),
            resource('StrataScratch', 'https://www.stratascratch.com/', 'Practice', false),
          ],
          projects: [],
          estimatedHours: 25,
          certifications: [],
        },
      ],
    },
  ],
};
