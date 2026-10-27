import api from './api';

const data = (request) => request.then((response) => response.data);

export const courseApi = {
  getProgress: () => data(api.get('/courses/progress')),
  completeLesson: (slug, lessonId) => data(api.put(`/courses/${slug}/lessons/${lessonId}`)),
  uncompleteLesson: (slug, lessonId) => data(api.delete(`/courses/${slug}/lessons/${lessonId}`)),
  submitExam: (slug, answers) => data(api.post(`/courses/${slug}/exam`, { answers })),
  verifyCertificate: (code) => data(api.get(`/courses/certificates/${encodeURIComponent(code)}`)),
};
