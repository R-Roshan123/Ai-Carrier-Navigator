import api from './api';

// AI reviews can take several seconds.
const REVIEW_TIMEOUT = 60000;

export const resumeApi = {
  extract: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/resume/extract', formData, { timeout: REVIEW_TIMEOUT }).then((response) => response.data);
  },
  review: (text, roleSlug) => api.post('/resume/review', { text, role: roleSlug }, { timeout: REVIEW_TIMEOUT }).then((response) => response.data),
};
