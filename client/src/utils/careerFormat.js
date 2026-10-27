export const HOURS_PER_WEEK = 10;

export const formatHours = (hours) => `${hours} hr${hours === 1 ? '' : 's'}`;

export const formatWeeks = (hours) => {
  const weeks = Math.ceil(hours / HOURS_PER_WEEK);
  return `~${weeks} week${weeks === 1 ? '' : 's'} at ${HOURS_PER_WEEK} hrs/week`;
};

// Accepts 'YYYY-MM-DD' (parsed as a local date) or a full ISO timestamp.
export const formatDate = (value) => {
  if (!value) return '—';
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const todayISO = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export const readCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  } catch {
    return null;
  }
};

export const isAdminUser = () => readCurrentUser()?.role === 'admin';

export const isValidHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const CERTIFICATE_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
export const MAX_CERTIFICATE_SIZE = 5 * 1024 * 1024;
