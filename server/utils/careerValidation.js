// Input validation for the Career Roadmap module. Each validator returns
// { errors: string[], value: object } where `value` holds trimmed/normalised input.

export const ROLE_EXPERIENCE_LEVELS = ['Entry', 'Mid', 'Senior'];
export const DEMAND_LEVELS = ['Low', 'Medium', 'High', 'Very High'];
export const COMPANY_TYPES = ['MNC', 'Product', 'Service', 'Startup'];
export const CERT_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
export const CERT_IMPORTANCE = ['Recommended', 'Optional', 'Highly Valued'];
export const STEP_STATUSES = ['Not Started', 'In Progress', 'Completed'];
export const CERTIFICATE_STATUSES = ['Pending', 'Verified', 'Rejected'];
export const RESOURCE_TYPES = ['Course', 'Docs', 'Video', 'Article', 'Practice', 'Book'];

export const MAX_TARGET_ROLES = 3;

export const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 && id < 2147483648 ? id : null;
};

export const escapeLike = (value) => value.replace(/[\\%_]/g, (match) => `\\${match}`);

export const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isValidDate = (value) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(value)) &&
  new Date(value).toISOString().startsWith(value);

export const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 160);

export const parsePagination = (query, { defaultLimit = 12, maxLimit = 100 } = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  return { page, limit, offset: (page - 1) * limit };
};

export const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

export const sendValidationError = (res, errors) =>
  res.status(400).json({ message: errors[0], errors });

const toText = (value) => {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  return '';
};

const toList = (value, separator = /\r?\n/) => {
  const items = Array.isArray(value) ? value : typeof value === 'string' ? value.split(separator) : [];
  return [...new Set(items.map(toText).filter(Boolean))];
};

const toIdList = (value) => {
  const items = Array.isArray(value) ? value : typeof value === 'string' && value ? value.split(',') : [];
  return [...new Set(items.map(parseId).filter(Boolean))];
};

const toBool = (value) => value === true || value === 'true' || value === 1 || value === '1' || value === 'on';

// rule.type: string | text | enum | url | date | list | ids | bool | int
export const validateFields = (body, fields) => {
  const source = body || {};
  const errors = [];
  const value = {};

  for (const [key, rule] of Object.entries(fields)) {
    const label = rule.label || key;
    const raw = source[key];

    if (rule.type === 'list') {
      value[key] = toList(raw, rule.separator);
      if (rule.required && !value[key].length) errors.push(`${label} needs at least one item.`);
      if (value[key].length > (rule.maxItems || 50)) errors.push(`${label} can have at most ${rule.maxItems || 50} items.`);
      if (value[key].some((item) => item.length > (rule.max || 300))) {
        errors.push(`Each ${label.toLowerCase()} item must be at most ${rule.max || 300} characters.`);
      }
      continue;
    }

    if (rule.type === 'ids') {
      value[key] = toIdList(raw);
      continue;
    }

    if (rule.type === 'bool') {
      value[key] = toBool(raw);
      continue;
    }

    if (rule.type === 'int') {
      const empty = raw === undefined || raw === null || raw === '';
      if (empty) {
        value[key] = rule.default ?? null;
        if (rule.required && rule.default === undefined) errors.push(`${label} is required.`);
        continue;
      }
      const number = Number(raw);
      if (!Number.isInteger(number) || number < (rule.min ?? 0) || number > (rule.max ?? 100000)) {
        errors.push(`${label} must be a whole number between ${rule.min ?? 0} and ${rule.max ?? 100000}.`);
      }
      value[key] = number;
      continue;
    }

    const text = toText(raw);
    value[key] = text || null;
    if (!text) {
      if (rule.required) errors.push(`${label} is required.`);
      continue;
    }
    const max = rule.max ?? (rule.type === 'text' ? 5000 : 255);
    if (text.length > max) errors.push(`${label} must be at most ${max} characters.`);
    if (rule.type === 'enum' && !rule.values.includes(text)) {
      errors.push(`${label} must be one of: ${rule.values.join(', ')}.`);
    }
    if (rule.type === 'url' && !isValidUrl(text)) errors.push(`${label} must be a valid http(s) URL.`);
    if (rule.type === 'date' && !isValidDate(text)) errors.push(`${label} must be a valid date (YYYY-MM-DD).`);
  }

  return { errors, value };
};

const SKILL_SEPARATOR = /[\n,]/;

export const roleFields = {
  title: { type: 'string', required: true, max: 150, label: 'Title' },
  slug: { type: 'string', max: 160, label: 'Slug' },
  category: { type: 'string', required: true, max: 100, label: 'Category' },
  description: { type: 'text', required: true, label: 'Description' },
  responsibilities: { type: 'list', label: 'Responsibilities' },
  skills: { type: 'list', separator: SKILL_SEPARATOR, max: 100, label: 'Skills' },
  tools: { type: 'list', separator: SKILL_SEPARATOR, max: 100, label: 'Tools' },
  experienceLevel: { type: 'enum', required: true, values: ROLE_EXPERIENCE_LEVELS, label: 'Experience level' },
  salaryIndia: { type: 'string', max: 100, label: 'Salary range (India)' },
  salaryGlobal: { type: 'string', max: 100, label: 'Salary range (global)' },
  demandLevel: { type: 'enum', required: true, values: DEMAND_LEVELS, label: 'Demand level' },
  growthOutlook: { type: 'text', max: 2000, label: 'Growth outlook' },
  relatedRoleIds: { type: 'ids', label: 'Related roles' },
};

export const companyFields = {
  name: { type: 'string', required: true, max: 150, label: 'Name' },
  description: { type: 'text', max: 2000, label: 'Description' },
  logoUrl: { type: 'url', max: 1000, label: 'Logo URL' },
  locations: { type: 'list', separator: SKILL_SEPARATOR, max: 100, label: 'Locations' },
  companyType: { type: 'enum', required: true, values: COMPANY_TYPES, label: 'Company type' },
  website: { type: 'url', max: 1000, label: 'Website' },
  careersUrl: { type: 'url', max: 1000, label: 'Careers page URL' },
  hiringProcess: { type: 'text', max: 3000, label: 'Hiring process' },
  packageRange: { type: 'string', max: 100, label: 'Package range' },
  roleIds: { type: 'ids', label: 'Roles' },
};

export const certificationFields = {
  name: { type: 'string', required: true, max: 200, label: 'Name' },
  provider: { type: 'string', required: true, max: 100, label: 'Provider' },
  level: { type: 'enum', required: true, values: CERT_LEVELS, label: 'Level' },
  cost: { type: 'string', max: 150, label: 'Cost' },
  isFree: { type: 'bool', label: 'Free' },
  validity: { type: 'string', max: 100, label: 'Validity' },
  examDetails: { type: 'text', max: 3000, label: 'Exam details' },
  officialUrl: { type: 'url', required: true, max: 1000, label: 'Official URL' },
  importance: { type: 'enum', required: true, values: CERT_IMPORTANCE, label: 'Importance' },
  roleIds: { type: 'ids', label: 'Roles' },
};

export const userCertificateFields = {
  certificationId: { type: 'ids', label: 'Certification' },
  customName: { type: 'string', max: 200, label: 'Certificate name' },
  issuer: { type: 'string', max: 200, label: 'Issuing organization' },
  issueDate: { type: 'date', required: true, label: 'Issue date' },
  expiryDate: { type: 'date', label: 'Expiry date' },
  credentialId: { type: 'string', max: 200, label: 'Credential ID' },
  credentialUrl: { type: 'url', max: 1000, label: 'Credential verification URL' },
};

const stageFields = {
  title: { type: 'string', required: true, max: 150, label: 'Stage title' },
  description: { type: 'text', max: 2000, label: 'Stage description' },
};

const stepFields = {
  title: { type: 'string', required: true, max: 200, label: 'Step title' },
  description: { type: 'text', max: 5000, label: 'Step description' },
  topics: { type: 'list', max: 200, label: 'Topics' },
  skills: { type: 'list', separator: SKILL_SEPARATOR, max: 100, label: 'Skills' },
  projects: { type: 'list', max: 300, label: 'Projects' },
  estimatedHours: { type: 'int', required: true, min: 1, max: 1000, label: 'Estimated hours' },
  certificationIds: { type: 'ids', label: 'Certifications' },
};

const resourceFields = {
  title: { type: 'string', required: true, max: 200, label: 'Resource title' },
  url: { type: 'url', required: true, max: 1000, label: 'Resource URL' },
  type: { type: 'enum', required: true, values: RESOURCE_TYPES, label: 'Resource type' },
  isFree: { type: 'bool', label: 'Free' },
};

// Validates the full roadmap payload for PUT /admin/roadmaps/:roleId.
// Array position defines stage and step order.
export const validateRoadmap = (body) => {
  const errors = [];
  const stagesInput = body?.stages;
  if (!Array.isArray(stagesInput)) return { errors: ['Stages must be an array.'], value: null };
  if (stagesInput.length > 12) errors.push('A roadmap can have at most 12 stages.');

  const stages = stagesInput.map((stage, stageIndex) => {
    const stageResult = validateFields(stage, stageFields);
    stageResult.errors.forEach((error) => errors.push(`Stage ${stageIndex + 1}: ${error}`));
    const stepsInput = Array.isArray(stage?.steps) ? stage.steps : [];
    if (stepsInput.length > 30) errors.push(`Stage ${stageIndex + 1}: at most 30 steps allowed.`);

    const steps = stepsInput.map((step, stepIndex) => {
      const where = `Stage ${stageIndex + 1}, step ${stepIndex + 1}`;
      const stepResult = validateFields(step, stepFields);
      stepResult.errors.forEach((error) => errors.push(`${where}: ${error}`));
      const resourcesInput = Array.isArray(step?.resources) ? step.resources : [];
      if (resourcesInput.length > 20) errors.push(`${where}: at most 20 resources allowed.`);
      const resources = resourcesInput.map((resource) => {
        const resourceResult = validateFields(resource, resourceFields);
        resourceResult.errors.forEach((error) => errors.push(`${where}: ${error}`));
        return resourceResult.value;
      });
      return { id: parseId(step?.id), ...stepResult.value, resources };
    });

    return { id: parseId(stage?.id), ...stageResult.value, steps };
  });

  return { errors, value: { stages } };
};
