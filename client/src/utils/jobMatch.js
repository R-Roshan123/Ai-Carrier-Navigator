import { allRoles } from '../data/roleCareerData';
import { summarizeLearning } from './learningProgress';

// How much each kind of evidence counts towards a job match (adds up to 100).
export const MATCH_WEIGHTS = { assessment: 50, course: 30, roadmap: 20 };

// Jobs for the roles the user has worked on, scored from their assessment and learning.
// Roles with no assessment and no course progress are left out: there is nothing to match on.
// `scores` comes from readScores(), `learningData` from courseApi.getProgress().
export const matchJobs = (scores, learningData) =>
  allRoles
    .map((role) => {
      const score = scores[role.slug];
      const learning = summarizeLearning(learningData, role);
      const parts = {
        assessment: score?.best ?? 0,
        course: learning.certificate ? 100 : learning.lessonsTotal ? Math.round((learning.lessonsDone / learning.lessonsTotal) * 100) : 0,
        roadmap: learning.roadmapPercent,
      };
      const match = Math.round(Object.entries(MATCH_WEIGHTS).reduce((sum, [key, weight]) => sum + (parts[key] * weight) / 100, 0));
      return { role, job: role.job, score, learning, parts, match, hasEvidence: Boolean(score || learning.lessonsDone || learning.certificate) };
    })
    .filter((item) => item.hasEvidence)
    .sort((a, b) => b.match - a.match);
