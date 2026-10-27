import { allRoles } from '../data/roleCareerData';

// Instant keyword match of resume text against every role, before (and alongside) the AI review.
// Role skills count for 70% and tools for 30%. A skill like "Flutter / React Native" counts
// when any of its alternatives appears in the resume.
const SKILL_WEIGHT = 70;
const TOOL_WEIGHT = 30;

const alternatives = (phrase) =>
  phrase.split(/\s*(?:\/|&|,|\band\b)\s*/i).map((part) => part.trim()).filter(Boolean);

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Whole-word, case-insensitive match that also accepts a plural ("API" matches "APIs").
const mentions = (text, term) => new RegExp(`(?<![a-z0-9])${escapeRegExp(term)}(?:e?s)?(?![a-z0-9])`, 'i').test(text);

const splitFound = (text, phrases) => {
  const found = [];
  const missing = [];
  for (const phrase of phrases) (alternatives(phrase).some((term) => mentions(text, term)) ? found : missing).push(phrase);
  return { found, missing };
};

export const matchResumeToRoles = (text) =>
  allRoles
    .map((role) => {
      const skills = splitFound(text, role.skills);
      const tools = splitFound(text, role.tools);
      const match = Math.round(
        (skills.found.length / role.skills.length) * SKILL_WEIGHT + (tools.found.length / role.tools.length) * TOOL_WEIGHT,
      );
      return { role, match, skills, tools };
    })
    .sort((a, b) => b.match - a.match);
