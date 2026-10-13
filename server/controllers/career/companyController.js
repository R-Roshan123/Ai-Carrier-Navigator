import pool from '../../config/db.js';
import { mapCompany } from '../../utils/careerMappers.js';
import {
  buildPagination,
  companyFields,
  escapeLike,
  parseId,
  parsePagination,
  sendValidationError,
  validateFields,
} from '../../utils/careerValidation.js';

const COMPANY_ROLES_SQL = `
  COALESCE((
    SELECT json_agg(json_build_object('id', r.id, 'title', r.title, 'slug', r.slug, 'category', r.category) ORDER BY r.title)
    FROM career_company_roles cr JOIN career_job_roles r ON r.id = cr.role_id
    WHERE cr.company_id = c.id
  ), '[]'::json) AS roles`;

const fetchCompany = async (id) => {
  const { rows } = await pool.query(`SELECT c.*, ${COMPANY_ROLES_SQL} FROM career_companies c WHERE c.id = $1`, [id]);
  return rows[0] ? mapCompany(rows[0]) : null;
};

// GET /api/career/companies?search=&type=&location=&roleId=&page=&limit=
export const listCompanies = async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const conditions = [];
  const params = [];

  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  if (search) {
    params.push(`%${escapeLike(search)}%`);
    conditions.push(`(c.name ILIKE $${params.length} OR c.description ILIKE $${params.length})`);
  }
  if (typeof req.query.type === 'string' && req.query.type) {
    params.push(req.query.type);
    conditions.push(`c.company_type = $${params.length}`);
  }
  if (typeof req.query.location === 'string' && req.query.location.trim()) {
    params.push(`%${escapeLike(req.query.location.trim())}%`);
    conditions.push(`EXISTS (SELECT 1 FROM unnest(c.locations) loc WHERE loc ILIKE $${params.length})`);
  }
  const roleId = parseId(req.query.roleId);
  if (roleId) {
    params.push(roleId);
    conditions.push(`EXISTS (SELECT 1 FROM career_company_roles cr WHERE cr.company_id = c.id AND cr.role_id = $${params.length})`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  params.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT c.*, ${COMPANY_ROLES_SQL}, COUNT(*) OVER()::int AS total_count
     FROM career_companies c ${where}
     ORDER BY c.name
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );

  res.json({
    companies: rows.map(mapCompany),
    pagination: buildPagination(page, limit, rows[0]?.total_count || 0),
  });
};

// GET /api/career/companies/:id
export const getCompany = async (req, res) => {
  const id = parseId(req.params.id);
  const company = id ? await fetchCompany(id) : null;
  if (!company) {
    return res.status(404).json({ message: 'Company not found.' });
  }
  res.json({ company });
};

// ---------------------------- Admin ----------------------------

const saveCompany = async (req, res, companyId) => {
  const { errors, value } = validateFields(req.body, companyFields);
  if (errors.length) return sendValidationError(res, errors);

  const fields = [
    value.name, value.description, value.logoUrl, value.locations, value.companyType,
    value.website, value.careersUrl, value.hiringProcess, value.packageRange,
  ];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let id = companyId;
    if (companyId) {
      const { rowCount } = await client.query(
        `UPDATE career_companies
         SET name = $1, description = $2, logo_url = $3, locations = $4, company_type = $5,
             website = $6, careers_url = $7, hiring_process = $8, package_range = $9
         WHERE id = $10`,
        [...fields, companyId],
      );
      if (!rowCount) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Company not found.' });
      }
    } else {
      const { rows } = await client.query(
        `INSERT INTO career_companies
           (name, description, logo_url, locations, company_type, website, careers_url, hiring_process, package_range)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        fields,
      );
      id = rows[0].id;
    }

    await client.query('DELETE FROM career_company_roles WHERE company_id = $1', [id]);
    if (value.roleIds.length) {
      await client.query(
        `INSERT INTO career_company_roles (company_id, role_id)
         SELECT $1, id FROM career_job_roles WHERE id = ANY($2::int[])`,
        [id, value.roleIds],
      );
    }
    await client.query('COMMIT');

    res.status(companyId ? 200 : 201).json({
      message: companyId ? 'Company updated successfully.' : 'Company created successfully.',
      company: await fetchCompany(id),
    });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') {
      return res.status(400).json({ message: `A company named "${value.name}" already exists.` });
    }
    throw error;
  } finally {
    client.release();
  }
};

// GET /api/career/admin/companies – every company (no pagination)
export const adminListCompanies = async (req, res) => {
  const { rows } = await pool.query(`SELECT c.*, ${COMPANY_ROLES_SQL} FROM career_companies c ORDER BY c.name`);
  res.json({ companies: rows.map(mapCompany) });
};

export const createCompany = (req, res) => saveCompany(req, res, null);

export const updateCompany = (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(404).json({ message: 'Company not found.' });
  return saveCompany(req, res, id);
};

export const deleteCompany = async (req, res) => {
  const id = parseId(req.params.id);
  const { rowCount } = id ? await pool.query('DELETE FROM career_companies WHERE id = $1', [id]) : { rowCount: 0 };
  if (!rowCount) {
    return res.status(404).json({ message: 'Company not found.' });
  }
  res.json({ message: 'Company deleted successfully.' });
};
