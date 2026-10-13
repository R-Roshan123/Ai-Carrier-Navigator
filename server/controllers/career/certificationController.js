import pool from '../../config/db.js';
import { mapCertification } from '../../utils/careerMappers.js';
import {
  certificationFields,
  escapeLike,
  parseId,
  sendValidationError,
  validateFields,
} from '../../utils/careerValidation.js';

const CERT_ROLES_SQL = `
  COALESCE((
    SELECT json_agg(json_build_object('id', r.id, 'title', r.title, 'slug', r.slug) ORDER BY r.title)
    FROM career_certification_roles cr JOIN career_job_roles r ON r.id = cr.role_id
    WHERE cr.certification_id = c.id
  ), '[]'::json) AS roles`;

const IMPORTANCE_ORDER = `CASE c.importance WHEN 'Highly Valued' THEN 0 WHEN 'Recommended' THEN 1 ELSE 2 END`;

const fetchCertification = async (id) => {
  const { rows } = await pool.query(`SELECT c.*, ${CERT_ROLES_SQL} FROM career_certifications c WHERE c.id = $1`, [id]);
  return rows[0] ? mapCertification(rows[0]) : null;
};

// GET /api/career/certifications?search=&provider=&level=&isFree=&importance=&roleId=
// The master list is small (tens of rows), so it is returned unpaginated.
export const listCertifications = async (req, res) => {
  const conditions = [];
  const params = [];

  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  if (search) {
    params.push(`%${escapeLike(search)}%`);
    conditions.push(`(c.name ILIKE $${params.length} OR c.provider ILIKE $${params.length})`);
  }
  for (const [queryKey, column] of [['provider', 'provider'], ['level', 'level'], ['importance', 'importance']]) {
    if (typeof req.query[queryKey] === 'string' && req.query[queryKey]) {
      params.push(req.query[queryKey]);
      conditions.push(`c.${column} = $${params.length}`);
    }
  }
  if (req.query.isFree === 'true' || req.query.isFree === 'false') {
    params.push(req.query.isFree === 'true');
    conditions.push(`c.is_free = $${params.length}`);
  }
  const roleId = parseId(req.query.roleId);
  if (roleId) {
    params.push(roleId);
    conditions.push(`EXISTS (SELECT 1 FROM career_certification_roles cr WHERE cr.certification_id = c.id AND cr.role_id = $${params.length})`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [{ rows }, { rows: providerRows }] = await Promise.all([
    pool.query(`SELECT c.*, ${CERT_ROLES_SQL} FROM career_certifications c ${where} ORDER BY ${IMPORTANCE_ORDER}, c.name`, params),
    pool.query('SELECT DISTINCT provider FROM career_certifications ORDER BY provider'),
  ]);

  res.json({
    certifications: rows.map(mapCertification),
    filters: { providers: providerRows.map((row) => row.provider) },
  });
};

// ---------------------------- Admin ----------------------------

const saveCertification = async (req, res, certificationId) => {
  const { errors, value } = validateFields(req.body, certificationFields);
  if (errors.length) return sendValidationError(res, errors);

  const fields = [
    value.name, value.provider, value.level, value.cost, value.isFree,
    value.validity, value.examDetails, value.officialUrl, value.importance,
  ];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let id = certificationId;
    if (certificationId) {
      const { rowCount } = await client.query(
        `UPDATE career_certifications
         SET name = $1, provider = $2, level = $3, cost = $4, is_free = $5,
             validity = $6, exam_details = $7, official_url = $8, importance = $9
         WHERE id = $10`,
        [...fields, certificationId],
      );
      if (!rowCount) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Certification not found.' });
      }
    } else {
      const { rows } = await client.query(
        `INSERT INTO career_certifications
           (name, provider, level, cost, is_free, validity, exam_details, official_url, importance)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        fields,
      );
      id = rows[0].id;
    }

    await client.query('DELETE FROM career_certification_roles WHERE certification_id = $1', [id]);
    if (value.roleIds.length) {
      await client.query(
        `INSERT INTO career_certification_roles (certification_id, role_id)
         SELECT $1, id FROM career_job_roles WHERE id = ANY($2::int[])`,
        [id, value.roleIds],
      );
    }
    await client.query('COMMIT');

    res.status(certificationId ? 200 : 201).json({
      message: certificationId ? 'Certification updated successfully.' : 'Certification created successfully.',
      certification: await fetchCertification(id),
    });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') {
      return res.status(400).json({ message: `"${value.name}" by ${value.provider} already exists.` });
    }
    throw error;
  } finally {
    client.release();
  }
};

export const createCertification = (req, res) => saveCertification(req, res, null);

export const updateCertification = (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(404).json({ message: 'Certification not found.' });
  return saveCertification(req, res, id);
};

// Uploaded user certificates keep working after a delete: their link is set to
// NULL by the foreign key, so we copy the name into custom_name first.
export const deleteCertification = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(404).json({ message: 'Certification not found.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `UPDATE career_user_certificates uc
       SET custom_name = COALESCE(uc.custom_name, c.name)
       FROM career_certifications c
       WHERE c.id = uc.certification_id AND c.id = $1`,
      [id],
    );
    const { rowCount } = await client.query('DELETE FROM career_certifications WHERE id = $1', [id]);
    if (!rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Certification not found.' });
    }
    await client.query('COMMIT');
    res.json({ message: 'Certification deleted successfully.' });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
