import { getCourse } from '../data/courses';

// Summarises one role's progress from the /courses/progress response: roadmap topics,
// course lessons, and the course certificate. `role` is an entry from allRoles.
export const summarizeLearning = (data, role) => {
  const doneTopics = new Set(data?.roadmap?.[role.slug] || []);
  const topics = role.roadmap.flatMap((phase) => phase.topics);
  // Ignore saved ids for topics that no longer exist in the roadmap.
  const topicsDone = topics.filter((topic) => doneTopics.has(topic.id)).length;
  const lessons = getCourse(role.slug)?.lessons || [];
  const doneLessons = new Set(data?.progress?.[role.slug] || []);
  const lessonsDone = lessons.filter((lesson) => doneLessons.has(lesson.id)).length;
  const certificate = data?.certificates?.find((item) => item.courseSlug === role.slug) || null;

  return {
    topicsDone,
    topicsTotal: topics.length,
    roadmapPercent: topics.length ? Math.round((topicsDone / topics.length) * 100) : 0,
    lessonsDone,
    lessonsTotal: lessons.length,
    certificate,
    started: Boolean(topicsDone || lessonsDone || certificate),
  };
};
