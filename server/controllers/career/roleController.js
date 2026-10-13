import pool from '../../config/db.js';
import { loadRoadmap } from '../../services/careerRoadmapService.js';
import { mapCertification, mapCompany, mapRole, mapRoleSummary } from '../../utils/careerMappers.js';
import {
  buildPagination,
  escapeLike,
  parseId,
  parsePagination,
  roleFields,
  sendValidationError,
  slugify,
  validateFields,
} from '../../utils/careerValidation.js';

const ROLE_STATS_SQL = `
  (SELECT COUNT(*) FROM career_company_roles cr WHERE cr.role_id = r.id)::int AS company_count,
  (SELECT COUNT(*) FROM career_certification_roles c WHERE c.role_id = r.id)::int AS certification_count,
  (SELECT COUNT(*) FROM career_roadmap_steps s JOIN career_roadmap_stages st ON st.id = s.stage_id WHERE st.role_id = r.id)::int AS step_count,
  (SELECT COALESCE(SUM(s.estimated_hours), 0) FROM career_roadmap_steps s JOIN career_roadmap_stages st ON st.id = s.stage_id WHERE st.role_id = r.id)::int AS total_hours`;

const roleExists = async (id) => {
  const { rows } = await pool.query('SELECT id FROM career_job_roles WHERE id = $1', [id]);
  return Boolean(rows[0]);
};

const fetchRoleDetail = async (whereSql, param) => {
  const { rows } = await pool.query(
    `SELECT r.*, ${ROLE_STATS_SQL} FROM career_job_roles r WHERE ${whereSql}`,
    [param],
  );
  if (!rows[0]) return null;
  const { rows: related } = await pool.query(
    `SELECT r.id, r.title, r.slug, r.category, r.demand_level
     FROM career_related_roles rr
     JOIN career_job_roles r ON r.id = rr.related_role_id
     WHERE rr.role_id = $1
     ORDER BY r.title`,
    [rows[0].id],
  );
  return {
    ...mapRole(rows[0]),
    relatedRoles: related.map((row) => ({ id: row.id, title: row.title, slug: row.slug, category: row.category, demandLevel: row.demand_level })),
  };
};

// GET /api/career/roles?search=&category=&experienceLevel=&demandLevel=&page=&limit=
export const listRoles = async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const conditions = [];
  const params = [];

  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  if (search) {
    params.push(`%${escapeLike(search)}%`);
    conditions.push(`(r.title ILIKE $${params.length} OR r.category ILIKE $${params.length}
      OR r.description ILIKE $${params.length}
      OR EXISTS (SELECT 1 FROM unnest(r.skills) skill WHERE skill ILIKE $${params.length}))`);
  }
  for (const [queryKey, column] of [['category', 'category'], ['experienceLevel', 'experience_level'], ['demandLevel', 'demand_level']]) {
    if (typeof req.query[queryKey] === 'string' && req.query[queryKey]) {
      params.push(req.query[queryKey]);
      conditions.push(`r.${column} = $${params.length}`);
    }
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  params.push(limit, offset);
  const [{ rows }, { rows: categoryRows }] = await Promise.all([
    pool.query(
      `SELECT r.*, ${ROLE_STATS_SQL}, COUNT(*) OVER()::int AS total_count
       FROM career_job_roles r ${where}
       ORDER BY r.title
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    ),
    pool.query('SELECT DISTINCT category FROM career_job_roles ORDER BY category'),
  ]);

  res.json({
    roles: rows.map(mapRoleSummary),
    pagination: buildPagination(page, limit, rows[0]?.total_count || 0),
    filters: { categories: categoryRows.map((row) => row.category) },
  });
};

// GET /api/career/roles/:slug
export const getRoleBySlug = async (req, res) => {
  const role = await fetchRoleDetail('r.slug = $1', String(req.params.slug));
  if (!role) {
    return res.status(404).json({ message: 'Role not found.' });
  }
  res.json({ role });
};

// GET /api/career/roles/:id/companies
export const getRoleCompanies = async (req, res) => {
  const roleId = parseId(req.params.id);
  if (!roleId || !(await roleExists(roleId))) {
    return res.status(404).json({ message: 'Role not found.' });
  }
  const { rows } = await pool.query(
    `SELECT c.*
     FROM career_company_roles cr
     JOIN career_companies c ON c.id = cr.company_id
     WHERE cr.role_id = $1
     ORDER BY c.name`,
    [roleId],
  );
  res.json({ companies: rows.map(mapCompany) });
};

// GET /api/career/roles/:id/roadmap
export const getRoleRoadmap = async (req, res) => {
  const roleId = parseId(req.params.id);
  if (!roleId || !(await roleExists(roleId))) {
    return res.status(404).json({ message: 'Role not found.' });
  }
  res.json({ roadmap: await loadRoadmap(roleId) });
};

// GET /api/career/roles/:id/certifications?provider=&level=&isFree=
export const getRoleCertifications = async (req, res) => {
  const roleId = parseId(req.params.id);
  if (!roleId || !(await roleExists(roleId))) {
    return res.status(404).json({ message: 'Role not found.' });
  }
  const params = [roleId];
  const conditions = ['cr.role_id = $1'];
  if (typeof req.query.provider === 'string' && req.query.provider) {
    params.push(req.query.provider);
    conditions.push(`c.provider = $${params.length}`);
  }
  if (typeof req.query.level === 'string' && req.query.level) {
    params.push(req.query.level);
    conditions.push(`c.level = $${params.length}`);
  }
  if (req.query.isFree === 'true' || req.query.isFree === 'false') {
    params.push(req.query.isFree === 'true');
    conditions.push(`c.is_free = $${params.length}`);
  }
  const { rows } = await pool.query(
    `SELECT c.*
     FROM career_certification_roles cr
     JOIN career_certifications c ON c.id = cr.certification_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY CASE c.importance WHEN 'Highly Valued' THEN 0 WHEN 'Recommended' THEN 1 ELSE 2 END, c.name`,
    params,
  );
  res.json({ certifications: rows.map(mapCertification) });
};

// ---------------------------- Admin ----------------------------

const replaceRelatedRoles = async (client, roleId, relatedRoleIds) => {
  await client.query('DELETE FROM career_related_roles WHERE role_id = $1', [roleId]);
  const ids = relatedRoleIds.filter((id) => id !== roleId);
  if (ids.length) {
    await client.query(
      `INSERT INTO career_related_roles (role_id, related_role_id)
       SELECT $1, id FROM career_job_roles WHERE id = ANY($2::int[])`,
      [roleId, ids],
    );
  }
};

const saveRole = async (req, res, roleId) => {
  const { errors, value } = validateFields(req.body, roleFields);
  const slug = slugify(value.slug || value.title || '');
  if (!slug && !errors.length) errors.push('Slug must contain letters or numbers.');
  if (errors.length) return sendValidationError(res, errors);

  const fields = [
    value.title, slug, value.category, value.description, value.responsibilities, value.skills,
    value.tools, value.experienceLevel, value.salaryIndia, value.salaryGlobal, value.demandLevel, value.growthOutlook,
  ];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let id = roleId;
    if (roleId) {
      const { rowCount } = await client.query(
        `UPDATE career_job_roles
         SET title = $1, slug = $2, category = $3, description = $4, responsibilities = $5, skills = $6,
             tools = $7, experience_level = $8, salary_india = $9, salary_global = $10, demand_level = $11,
             growth_outlook = $12
         WHERE id = $13`,
        [...fields, roleId],
      );
      if (!rowCount) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Role not found.' });
      }
    } else {
      const { rows } = await client.query(
        `INSERT INTO career_job_roles
           (title, slug, category, description, responsibilities, skills, tools,
            experience_level, salary_india, salary_global, demand_level, growth_outlook)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id`,
        fields,
      );
      id = rows[0].id;
    }
    await replaceRelatedRoles(client, id, value.relatedRoleIds);
    await client.query('COMMIT');

    const role = await fetchRoleDetail('r.id = $1', id);
    res.status(roleId ? 200 : 201).json({
      message: roleId ? 'Role updated successfully.' : 'Role created successfully.',
      role,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') {
      return res.status(400).json({ message: `A role with the slug "${slug}" already exists.` });
    }
    throw error;
  } finally {
    client.release();
  }
};

// GET /api/career/admin/roles – every role (no pagination) with related role ids
export const adminListRoles = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT r.*, ${ROLE_STATS_SQL},
       COALESCE((SELECT array_agg(rr.related_role_id) FROM career_related_roles rr WHERE rr.role_id = r.id), '{}') AS related_role_ids
     FROM career_job_roles r
     ORDER BY r.title`,
  );
  res.json({ roles: rows.map((row) => ({ ...mapRole(row), relatedRoleIds: row.related_role_ids })) });
};

export const createRole = (req, res) => saveRole(req, res, null);

export const updateRole = (req, res) => {
  const roleId = parseId(req.params.id);
  if (!roleId) return res.status(404).json({ message: 'Role not found.' });
  return saveRole(req, res, roleId);
};

export const deleteRole = async (req, res) => {
  const roleId = parseId(req.params.id);
  const { rowCount } = roleId
    ? await pool.query('DELETE FROM career_job_roles WHERE id = $1', [roleId])
    : { rowCount: 0 };
  if (!rowCount) {
    return res.status(404).json({ message: 'Role not found.' });
  }
  res.json({ message: 'Role deleted successfully.' });
};
