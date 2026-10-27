import { useCallback, useEffect, useState } from 'react';
import { roleAssessments } from '../data/roleAssessments';
import { assistantApi } from '../services/assistantApi';
import { getErrorMessage } from '../services/careerApi';
import { readScores } from '../utils/assessmentScores';
import { readCurrentUser } from '../utils/careerFormat';
import { readTargetCareer } from '../utils/targetCareer';

// The conversation is kept per user for this browser tab, so the floating assistant
// and the AI Career Mentor page continue the same chat.
const storageKey = () => `assistantChat:${readCurrentUser()?.id || 'guest'}`;

const loadMessages = () => {
  try {
    return JSON.parse(sessionStorage.getItem(storageKey())) || [];
  } catch {
    return [];
  }
};

// Assessment scores are only stored in the browser, so send them along with each question.
const buildContext = () => {
  const scores = readScores();
  return {
    targetCareer: readTargetCareer(),
    assessments: roleAssessments
      .filter((role) => scores[role.slug])
      .map((role) => ({ role: role.title, best: scores[role.slug].best, weakTopics: scores[role.slug].weakTopics || [] })),
  };
};

export default function useAssistantChat() {
  const [messages, setMessages] = useState(loadMessages);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey(), JSON.stringify(messages));
    } catch {
      // The chat still works for this page without storage.
    }
  }, [messages]);

  const request = useCallback(async (history) => {
    setSending(true);
    setError('');
    try {
      const { reply } = await assistantApi.chat(history, buildContext());
      setMessages([...history, { role: 'assistant', content: reply }]);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'The assistant could not answer. Please try again.'));
    } finally {
      setSending(false);
    }
  }, []);

  const send = useCallback(
    (text) => {
      const content = text.trim();
      if (!content || sending) return;
      const history = [...messages, { role: 'user', content }];
      setMessages(history);
      request(history);
    },
    [messages, request, sending],
  );

  // Re-asks the last question after a failed request.
  const retry = useCallback(() => {
    if (messages.at(-1)?.role === 'user') request(messages);
  }, [messages, request]);

  const reset = useCallback(() => {
    setMessages([]);
    setError('');
  }, []);

  return { messages, sending, error, send, retry, reset };
}
