// In-app courses, one per role. Shared by the client (to display lessons) and the
// server (to validate progress and grade the final exam before issuing a certificate).

import { roleAssessments } from './roleAssessments.js';
import softwareWeb from './courses/softwareWeb.js';
import mobileGames from './courses/mobileGames.js';
import aiData from './courses/aiData.js';

export const PASS_MARK = 70;

const content = { ...softwareWeb, ...mobileGames, ...aiData };

export const courses = roleAssessments.map((role) => ({
  slug: role.slug,
  title: role.title,
  category: role.category,
  ...content[role.slug],
  // The role assessment doubles as the course's final exam.
  exam: role.questions,
}));

export const getCourse = (slug) => courses.find((course) => course.slug === slug);

// `answers[i]` is the option text chosen for question i (options are shuffled on screen,
// so text is compared rather than index).
export const gradeExam = (course, answers) => {
  const results = course.exam.map((question, index) => {
    const correctAnswer = question.options[question.answer];
    return { correct: answers?.[index] === correctAnswer, correctAnswer };
  });
  const correctCount = results.filter((result) => result.correct).length;
  const score = Math.round((correctCount / course.exam.length) * 100);
  return { score, correctCount, total: course.exam.length, passed: score >= PASS_MARK, results };
};
