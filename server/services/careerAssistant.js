// AI career mentor backed by Groq's OpenAI-compatible chat API.
// The model gets the app's features and the signed-in user's real progress so its advice is specific.
import pool, { dbState } from '../config/db.js';
import { courses } from '../../shared/courseContent.js';
import { roadmaps, roadmapTopicIds } from '../../shared/roadmaps.js';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-oss-120b';
const MAX_HISTORY = 12;
const MAX_MESSAGE_LENGTH = 2000;

export class AssistantError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const isAssistantConfigured = () => Boolean(process.env.GROQ_API_KEY);

const clip = (value, length) => String(value ?? '').slice(0, length);

const APP_GUIDE = `Pages in this app you can point the user to (use the path in brackets):
- Career Assessment [/assessment]: a 10-question quiz for one role; scores show strong and weak topics.
- Career Recommendations [/recommendations]: all roles ranked by the user's assessment scores.
- Learning Roadmap [/roadmap]: 5 phases per role; users mark topics complete.
- Courses [/courses]: a free in-app course per role (5 lessons + final exam, 70% to pass) that awards a certificate.
- Skill Gap [/skill-gap]: read-only; compares the latest assessment's topic scores with an 80% target. Retake the assessment to update it.
- Projects [/projects]: suggested portfolio projects per role. Jobs [/jobs]: sample openings matched from assessments and courses.
- Resume [/resume]: scores a resume for a chosen role and generates a role-focused resume to print.
- My Career Progress [/career/progress] and My Certificates [/career/certificates].
Roles covered: ${courses.map((course) => course.title).join(', ')}.
Roadmap phases are never locked, and the resume page does not import certificates or projects automatically. Only describe features listed here.`;

// The real roadmap and course outline for the user's target career, so advice matches what the app teaches.
const describeTargetRole = (targetCareer) => {
  const course = courses.find((item) => item.title.toLowerCase() === String(targetCareer || '').toLowerCase());
  if (!course) return '';
  const phases = roadmaps[course.slug].map((phase, index) => `${index + 1}. ${phase.name} (${phase.duration}): ${phase.topics.map((topic) => topic.title).join(', ')}`);
  return `\n${course.title} learning roadmap (each phase matches the course lesson with the same number):\n${phases.join('\n')}`;
};

// Course, roadmap, and certificate progress for the user, read from the database.
const loadLearningSummary = async (userId) => {
  const [user, lessons, topics, certificates] = await Promise.all([
    pool.query('SELECT name, role, education, department, college, year_of_study, designation FROM users WHERE id = $1', [userId]),
    pool.query('SELECT course_slug, COUNT(*)::int AS done FROM course_lesson_progress WHERE user_id = $1 GROUP BY course_slug', [userId]),
    pool.query('SELECT role_slug, topic_id FROM roadmap_topic_progress WHERE user_id = $1', [userId]),
    pool.query('SELECT course_title, score FROM course_certificates WHERE user_id = $1', [userId]),
  ]);

  const lessonsBySlug = Object.fromEntries(lessons.rows.map((row) => [row.course_slug, row.done]));
  const topicsBySlug = {};
  for (const row of topics.rows) (topicsBySlug[row.role_slug] ||= new Set()).add(row.topic_id);

  const learning = courses
    .map((course) => {
      const ids = roadmapTopicIds(course.slug);
      const topicsDone = ids.filter((id) => topicsBySlug[course.slug]?.has(id)).length;
      const lessonsDone = lessonsBySlug[course.slug] || 0;
      return { title: course.title, lessonsDone, lessonsTotal: course.lessons.length, topicsDone, topicsTotal: ids.length };
    })
    .filter((item) => item.lessonsDone || item.topicsDone)
    .map((item) => `${item.title}: course ${item.lessonsDone}/${item.lessonsTotal} lessons, roadmap ${item.topicsDone}/${item.topicsTotal} topics`);

  return { profile: user.rows[0], learning, certificates: certificates.rows.map((row) => `${row.course_title} (${row.score}%)`) };
};

// Assessment scores live in the browser, so the client sends them; keep only well-formed, bounded values.
const describeClientContext = (context = {}) => {
  const lines = [];
  if (context.targetCareer) lines.push(`Target career: ${clip(context.targetCareer, 100)}`);
  const assessments = Array.isArray(context.assessments) ? context.assessments.slice(0, 20) : [];
  for (const item of assessments) {
    const best = Number(item?.best);
    if (!item?.role || !Number.isFinite(best)) continue;
    const weak = Array.isArray(item.weakTopics) ? item.weakTopics.slice(0, 10).map((topic) => clip(topic, 60)).join(', ') : '';
    lines.push(`Assessment – ${clip(item.role, 100)}: best ${Math.round(best)}%${weak ? `; weak topics: ${weak}` : ''}`);
  }
  return lines;
};

const buildSystemPrompt = async (userId, context) => {
  const facts = describeClientContext(context);
  if (dbState.connected) {
    try {
      const { profile, learning, certificates } = await loadLearningSummary(userId);
      if (profile) {
        const details = [profile.education, profile.department, profile.college, profile.year_of_study].filter(Boolean).join(', ');
        facts.unshift(`Name: ${profile.name}${profile.role === 'admin' ? ` (admin${profile.designation ? `, ${profile.designation}` : ''})` : ''}${details ? ` — ${details}` : ''}`);
      }
      facts.push(...learning.map((line) => `Learning – ${line}`));
      if (certificates.length) facts.push(`Certificates earned: ${certificates.join(', ')}`);
    } catch {
      // Progress is helpful context but not essential; answer without it.
    }
  }

  return `You are the AI Career Mentor inside "AI Career Navigator", a career guidance app for students.
Help the user choose a career, plan what to learn, close skill gaps, build projects, prepare resumes and interviews, and use this app well.

Guidelines:
- Be encouraging, practical, and specific. Base advice on the user's progress below when it is relevant, and say what to do next.
- Keep answers short: at most about 150 words and 5 bullet points unless the user asks for more detail. Use **bold** sparingly. Do not use tables.
- When an app page would help, mention it by name with its path, e.g. "Learning Roadmap (/roadmap)".
- Do not invent specific job openings, salaries for named companies, or statistics. Give ranges and say they vary.
- Stay focused on careers, learning, and this app. Politely decline unrelated requests.

${APP_GUIDE}${describeTargetRole(context?.targetCareer)}

What we know about this user:
${facts.length ? facts.map((line) => `- ${line}`).join('\n') : '- No progress recorded yet.'}`;
};

const cleanHistory = (messages) =>
  (Array.isArray(messages) ? messages : [])
    .filter((message) => (message?.role === 'user' || message?.role === 'assistant') && typeof message.content === 'string' && message.content.trim())
    .slice(-MAX_HISTORY)
    .map((message) => ({ role: message.role, content: clip(message.content, MAX_MESSAGE_LENGTH) }));

export const askCareerAssistant = async ({ userId, messages, context }) => {
  if (!isAssistantConfigured()) {
    throw new AssistantError(503, 'The AI assistant is not configured. Add GROQ_API_KEY to the server .env file.');
  }
  const history = cleanHistory(messages);
  if (history.at(-1)?.role !== 'user') {
    throw new AssistantError(400, 'Send a message for the assistant to answer.');
  }

  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;
  let response;
  try {
    response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: await buildSystemPrompt(userId, context) }, ...history],
        temperature: 0.6,
        max_completion_tokens: 1024,
        // gpt-oss models think before answering; keep that short so replies stay fast.
        ...(model.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low' } : {}),
      }),
      signal: AbortSignal.timeout(30000),
    });
  } catch {
    throw new AssistantError(504, 'The AI assistant took too long to respond. Please try again.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 429) throw new AssistantError(429, 'The AI assistant is busy right now. Please wait a moment and try again.');
    if (response.status === 401) throw new AssistantError(503, 'The AI assistant key was rejected. Check GROQ_API_KEY in the server .env file.');
    console.error('Groq API error:', response.status, data?.error?.message);
    throw new AssistantError(502, 'The AI assistant could not answer right now. Please try again.');
  }

  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new AssistantError(502, 'The AI assistant returned an empty answer. Please try again.');
  return { reply, model };
};
