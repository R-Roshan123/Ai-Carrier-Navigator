// The user's chosen target career (stored by role title), shared across pages.

const TARGET_KEY = 'targetCareer';

export const readTargetCareer = () => {
  try {
    return localStorage.getItem(TARGET_KEY) || '';
  } catch {
    return '';
  }
};

export const saveTargetCareer = (title) => {
  try {
    localStorage.setItem(TARGET_KEY, title);
  } catch {
    // Target career is a convenience; ignore storage failures.
  }
};
