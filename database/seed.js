import bcrypt from 'bcryptjs';
import pool from '../server/config/db.js';

const demoUsers = [
  ['Aisha Patel', 'aisha.demo@example.com', 'Computer Science', 'AI & Data Science'],
  ['Marcus Chen', 'marcus.demo@example.com', 'Information Systems', 'Business Analytics'],
  ['Sofia Rodriguez', 'sofia.demo@example.com', 'Design', 'Human-Computer Interaction'],
  ['Liam Johnson', 'liam.demo@example.com', 'Cybersecurity', 'Information Technology'],
  ['Maya Thompson', 'maya.demo@example.com', 'Software Engineering', 'Computer Engineering'],
];

const demoCareers = [
  ['Data Scientist', 'Data', 'Uses statistical analysis and machine learning to turn data into decisions.', ['Build predictive models', 'Analyze datasets', 'Communicate insights'], ['Python', 'SQL', 'Statistics'], 'Bachelor degree in Data Science, Statistics, or Computer Science', '$105k - $140k', 'High', 'Very high'],
  ['AI Engineer', 'Artificial Intelligence', 'Builds intelligent applications and production-ready machine learning systems.', ['Design AI services', 'Evaluate models', 'Deploy solutions'], ['Python', 'Machine Learning', 'APIs'], 'Computer Science, AI, or a related technical field', '$110k - $150k', 'High', 'Very high'],
  ['Product Analyst', 'Business', 'Connects product decisions to customer behavior and business outcomes.', ['Define metrics', 'Run experiments', 'Present recommendations'], ['SQL', 'Analytics', 'Communication'], 'Business, Analytics, or STEM degree', '$95k - $130k', 'High', 'High'],
  ['Cybersecurity Analyst', 'Cybersecurity', 'Protects systems and investigates security events and vulnerabilities.', ['Monitor alerts', 'Investigate incidents', 'Improve controls'], ['Networking', 'Risk analysis', 'Security tools'], 'Information Technology, Cybersecurity, or Computer Science', '$85k - $115k', 'High', 'High'],
  ['UX Designer', 'Design', 'Creates useful, accessible experiences from research and user feedback.', ['Conduct research', 'Create prototypes', 'Test interfaces'], ['Figma', 'User research', 'Interaction design'], 'Design, HCI, or a related degree', '$80k - $110k', 'Medium', 'High'],
];

const demoJobs = [
  ['Junior Data Analyst', 'Northstar Analytics', 'Remote', 'Full-time', '0-2 years', '$80k - $100k', 'Analyze customer and operational data for weekly business reporting.', 91],
  ['AI Intern', 'Vision Labs', 'New York, NY', 'Hybrid', 'Internship', '$70k - $90k', 'Support model experiments and prepare training datasets for the AI team.', 88],
  ['Product Analyst', 'Orbit Growth', 'Austin, TX', 'Hybrid', '1-3 years', '$90k - $120k', 'Use product analytics to identify opportunities that improve customer activation.', 85],
  ['Security Operations Analyst', 'Crestline Security', 'Boston, MA', 'On-site', '1-3 years', '$85k - $115k', 'Review security alerts and help maintain incident response playbooks.', 82],
  ['UX Research Assistant', 'BrightLabs', 'Remote', 'Part-time', '0-2 years', '$60k - $80k', 'Plan user interviews and synthesize findings for product designers.', 79],
];

const profileData = [
  ['+1 555 010 1001', 'San Francisco, CA', 'B.Sc. Computer Science', 'University of California', 2025, 3.8, ['Python', 'SQL', 'Machine Learning'], ['Data Science', 'AI'], ['Data Science Intern at BrightLabs'], ['AWS Cloud Practitioner']],
  ['+1 555 010 1002', 'Seattle, WA', 'B.S. Information Systems', 'University of Washington', 2024, 3.6, ['SQL', 'Excel', 'Tableau'], ['Analytics', 'Product'], ['Business Analyst at Northwind'], ["Dean's List"]],
  ['+1 555 010 1003', 'New York, NY', 'B.A. Human-Computer Interaction', 'Parsons School of Design', 2026, 3.9, ['Figma', 'Prototyping', 'User Research'], ['UX', 'Accessibility'], ['UX Design Intern at PixelWorks'], ['Designathon finalist']],
  ['+1 555 010 1004', 'Austin, TX', 'B.S. Information Technology', 'Texas State University', 2025, 3.5, ['Networking', 'Linux', 'SIEM'], ['Cybersecurity', 'Cloud'], ['SOC Analyst Intern at SecureGrid'], ['CompTIA Security+']],
  ['+1 555 010 1005', 'Chicago, IL', 'B.S. Computer Engineering', 'Illinois Tech', 2024, 3.7, ['JavaScript', 'React', 'Node.js'], ['Software Engineering', 'AI'], ['Software Engineer at MakerHub'], ['Hackathon winner']],
];

const applicationData = [
  ['Northstar Analytics', 'Junior Data Analyst', '2026-08-10', '$90k', 'Applied', 'Resume submitted', '2026-08-20'],
  ['BrightLabs', 'Data Science Intern', '2026-08-14', '$75k', 'Interview', 'Technical assessment complete', '2026-08-26'],
  ['Orbit Growth', 'Product Analyst', '2026-08-15', '$95k', 'Saved', 'Researching company fit', null],
  ['Crestline Security', 'Security Operations Analyst', '2026-08-12', '$105k', 'Assessment', 'Pending coding test', null],
  ['PixelWorks', 'UX Research Assistant', '2026-08-18', '$72k', 'Applied', 'Portfolio shared with recruiter', null],
];

const notificationData = [
  ['Your assessment is ready', 'Review your career matches and recommended next steps.', false],
  ['New job match', 'A Junior Data Analyst role matches 91% of your profile.', false],
  ['Roadmap milestone', 'You completed the Python Fundamentals milestone.', true],
  ['Interview reminder', 'Your BrightLabs technical interview is scheduled for August 26.', false],
  ['Profile improvement', 'Add one more project to improve your job match quality.', true],
];

async function insertIfMissing(client, table, condition, conditionValues, values, columns) {
  const existing = await client.query(`SELECT 1 FROM ${table} WHERE ${condition} LIMIT 1`, conditionValues);
  if (existing.rowCount > 0) {
    return 0;
  }

  const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
  const result = await client.query(`INSERT INTO ${table} ${columns} VALUES (${placeholders})`, values);
  return result.rowCount;
}

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const passwordHash = await bcrypt.hash('DemoPass123!', 10);

    for (const [name, email, education, department] of demoUsers) {
      await client.query(
        `INSERT INTO users (name, email, password_hash, education, department)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO NOTHING`,
        [name, email, passwordHash, education, department],
      );
    }

    const userResult = await client.query(
      'SELECT id, email FROM users WHERE email = ANY($1::text[]) ORDER BY email',
      [demoUsers.map(([, email]) => email)],
    );
    const userIds = new Map(userResult.rows.map((user) => [user.email, user.id]));
    const orderedUserIds = demoUsers.map(([, email]) => userIds.get(email));

    for (let index = 0; index < profileData.length; index += 1) {
      const [phone, location, degree, college, graduationYear, cgpa, skills, interests, experience, achievements] = profileData[index];
      const values = [orderedUserIds[index], phone, location, degree, college, graduationYear, cgpa, JSON.stringify(skills), JSON.stringify(interests), JSON.stringify(experience), JSON.stringify(achievements)];
      await insertIfMissing(client, 'profiles', 'user_id = $1', [orderedUserIds[index]], values, '(user_id, phone, location, degree, college, graduation_year, cgpa, skills, interests, experience, achievements)');
    }

    for (const career of demoCareers) {
      await insertIfMissing(client, 'careers', 'name = $1', [career[0]], career, '(name, category, overview, responsibilities, skills, education, salary, demand, growth)');
    }

    for (const job of demoJobs) {
      await insertIfMissing(client, 'jobs', 'title = $1 AND company = $2', job.slice(0, 2), job, '(title, company, location, work_type, experience, salary, description, match_score)');
    }

    for (let index = 0; index < orderedUserIds.length; index += 1) {
      const userId = orderedUserIds[index];
      const assessment = [userId, JSON.stringify({ seed: 'demo', interests: ['technology', 'problem solving'], completed: true }), JSON.stringify({ seed: 'demo', primaryCareer: demoCareers[index][0], matchScore: 80 + index * 3 })];
      await insertIfMissing(client, 'assessment_results', "user_id = $1 AND answers->>'seed' = 'demo'", [userId], assessment, '(user_id, answers, recommendations)');

      const application = applicationData[index];
      await insertIfMissing(client, 'applications', 'user_id = $1 AND company = $2 AND position = $3', [userId, application[0], application[1]], [userId, ...application], '(user_id, company, position, date, salary, status, notes, interview_date)');

      const notification = notificationData[index];
      await insertIfMissing(client, 'notifications', 'user_id = $1 AND title = $2', [userId, notification[0]], [userId, ...notification], '(user_id, title, message, read_status)');
    }

    await client.query('COMMIT');
    console.log('Seed complete: five demo rows are available for every database table.');
    console.log('Demo password for all seeded users: DemoPass123!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();