import api from './api';

// Replies can take several seconds, so allow longer than the default timeout.
const CHAT_TIMEOUT = 45000;

export const assistantApi = {
  chat: (messages, context) => api.post('/ai/chat', { messages, context }, { timeout: CHAT_TIMEOUT }).then((response) => response.data),
};
