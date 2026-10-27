// Role assessment results, kept per browser in localStorage and keyed by role slug.

const SCORES_KEY = 'assessmentScores';

export const readScores = () => {
  try {
    return JSON.parse(localStorage.getItem(SCORES_KEY)) || {};
  } catch {
    return {};
  }
};

// Per-topic results for an attempt: topics answered fully correctly are strong, the rest are weak.
export const summarizeTopics = (questions, answers) => {
  const topics = Object.values(
    questions.reduce((acc, question, index) => {
      const entry = acc[question.topic] || { topic: question.topic, correct: 0, total: 0 };
      entry.total += 1;
      if (answers[index] === question.answer) entry.correct += 1;
      acc[question.topic] = entry;
      return acc;
    }, {}),
  );
  return {
    topics,
    strongTopics: topics.filter((topic) => topic.correct === topic.total).map((topic) => topic.topic),
    weakTopics: topics.filter((topic) => topic.correct < topic.total).map((topic) => topic.topic),
  };
};

export const saveScore = (slug, { percent, topics, strongTopics, weakTopics }) => {
  try {
    const scores = readScores();
    scores[slug] = {
      best: Math.max(percent, scores[slug]?.best || 0),
      last: percent,
      topics,
      strongTopics,
      weakTopics,
      takenAt: new Date().toISOString(),
    };
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
  } catch {
    // Scores are a convenience; the assessment still works without storage.
  }
};

export const scoreLevel = (percent) => {
  if (percent >= 80) return { label: 'Job ready', className: 'bg-emerald-100 text-emerald-700' };
  if (percent >= 60) return { label: 'Intermediate', className: 'bg-indigo-100 text-indigo-700' };
  if (percent >= 40) return { label: 'Developing', className: 'bg-amber-100 text-amber-700' };
  return { label: 'Beginner', className: 'bg-rose-100 text-rose-700' };
};
