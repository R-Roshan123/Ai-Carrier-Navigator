import pool from '../../config/db.js';
import { loadRoadmap, saveRoadmap } from '../../services/careerRoadmapService.js';
import { mapUserCertificate } from '../../utils/careerMappers.js';
import {
  CERTIFICATE_STATUSES,
  buildPagination,
  parseId,
  parsePagination,
  sendValidationError,
  validateRoadmap,
} from '../../utils/careerValidation.js';
import { USER_CERTIFICATE_SELECT } from './userCertificateController.js';

const ADMIN_CERTIFICATE_SELECT = USER_CERTIFICATE_SELECT.replace(
  'FROM career_user_certificates uc',
  `, u.name AS user_name, u.email AS user_email, v.name AS verifier_name
   FROM career_user_certificates uc
   JOIN users u ON u.id = uc.user_id
   LEFT JOIN users v ON v.id = uc.verified_by`,
);

// PUT /api/career/admin/roadmaps/:roleId  { stages: [{ id?, title, description, steps: [...] }] }
export const updateRoadmap = async (req, res) => {
  const roleId = parseId(req.params.roleId);
  const { rows } = roleId ? await pool.query('SELECT id FROM career_job_roles WHERE id = $1', [roleId]) : { rows: [] };
  if (!rows[0]) {
    return res.status(404).json({ message: 'Role not found.' });
  }

  const { errors, value } = validateRoadmap(req.body);
  if (errors.length) return sendValidationError(res, errors);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await saveRoadmap(client, roleId, value.stages);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  res.json({ message: 'Roadmap saved successfully.', roadmap: await loadRoadmap(roleId) });
};

// GET /api/career/admin/certificates?status=Pending&search=&page=&limit=
export const listCertificatesForReview = async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query, { defaultLimit: 20 });
  const params = [];
  const conditions = [];
  if (CERTIFICATE_STATUSES.includes(req.query.status)) {
    params.push(req.query.status);
    conditions.push(`uc.status = $${params.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  params.push(limit, offset);

  // Pending queue is first-in-first-out; other lists show the latest decisions first
  const order = req.query.status === 'Pending' ? 'uc.created_at ASC' : 'uc.updated_at DESC';
  const [{ rows }, { rows: countRows }] = await Promise.all([
    pool.query(
      `${ADMIN_CERTIFICATE_SELECT} ${where} ORDER BY ${order}, uc.id LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    ),
    pool.query(`SELECT COUNT(*)::int AS total FROM career_user_certificates uc ${where}`, params.slice(0, -2)),
  ]);

  res.json({
    certificates: rows.map(mapUserCertificate),
    pagination: buildPagination(page, limit, countRows[0].total),
  });
};

// PATCH /api/career/admin/certificates/:id/verify  { status, remark }
export const verifyCertificate = async (req, res) => {
  const id = parseId(req.params.id);
  const status = req.body?.status;
  const remark = typeof req.body?.remark === 'string' ? req.body.remark.trim() : '';

  if (!CERTIFICATE_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${CERTIFICATE_STATUSES.join(', ')}.` });
  }
  if (status === 'Rejected' && !remark) {
    return res.status(400).json({ message: 'Please add a remark explaining why the certificate was rejected.' });
  }
  if (remark.length > 1000) {
    return res.status(400).json({ message: 'Remark must be at most 1000 characters.' });
  }

  const { rowCount } = id
    ? await pool.query(
      `UPDATE career_user_certificates
       SET status = $1::varchar,
           admin_remark = $2,
           verified_by = CASE WHEN $1::varchar = 'Pending' THEN NULL ELSE $3::int END,
           verified_at = CASE WHEN $1::varchar = 'Pending' THEN NULL ELSE NOW() END
       WHERE id = $4`,
      [status, remark || null, req.user.id, id],
    )
    : { rowCount: 0 };
  if (!rowCount) {
    return res.status(404).json({ message: 'Certificate not found.' });
  }

  const { rows } = await pool.query(`${ADMIN_CERTIFICATE_SELECT} WHERE uc.id = $1`, [id]);
  res.json({
    message: status === 'Verified' ? 'Certificate verified.' : status === 'Rejected' ? 'Certificate rejected.' : 'Certificate moved back to pending.',
    certificate: mapUserCertificate(rows[0]),
  });
};

// GET /api/career/admin/career-stats
export const getCareerStats = async (req, res) => {
  const [counts, certStatus, mostTargeted, recentUploads] = await Promise.all([
    pool.query(`
      SELECT
        (SELECT COUNT(*) FROM career_job_roles)::int AS roles,
        (SELECT COUNT(*) FROM career_companies)::int AS companies,
        (SELECT COUNT(*) FROM career_certifications)::int AS certifications,
        (SELECT COUNT(*) FROM career_roadmap_steps)::int AS roadmap_steps,
        (SELECT COUNT(DISTINCT user_id) FROM career_user_target_roles)::int AS users_tracking,
        (SELECT COUNT(*) FROM career_user_step_progress WHERE status = 'Completed')::int AS steps_completed`),
    pool.query('SELECT status, COUNT(*)::int AS count FROM career_user_certificates GROUP BY status'),
    pool.query(`
      SELECT r.id, r.title, r.slug, COUNT(t.user_id)::int AS count
      FROM career_job_roles r
      LEFT JOIN career_user_target_roles t ON t.role_id = r.id
      GROUP BY r.id
      ORDER BY count DESC, r.title
      LIMIT 10`),
    pool.query(`
      SELECT COUNT(*)::int AS count FROM career_user_certificates
      WHERE created_at >= NOW() - INTERVAL '7 days'`),
  ]);

  const byStatus = Object.fromEntries(CERTIFICATE_STATUSES.map((status) => [status, 0]));
  certStatus.rows.forEach((row) => {
    byStatus[row.status] = row.count;
  });
  const c = counts.rows[0];

  res.json({
    stats: {
      totalRoles: c.roles,
      totalCompanies: c.companies,
      totalCertifications: c.certifications,
      totalRoadmapSteps: c.roadmap_steps,
      usersTracking: c.users_tracking,
      stepsCompleted: c.steps_completed,
      totalUploads: Object.values(byStatus).reduce((sum, count) => sum + count, 0),
      uploadsLast7Days: recentUploads.rows[0].count,
      pendingVerifications: byStatus.Pending,
      uploadsByStatus: byStatus,
      mostTargetedRoles: mostTargeted.rows.map((row) => ({ id: row.id, title: row.title, slug: row.slug, count: row.count })),
    },
  });
};
