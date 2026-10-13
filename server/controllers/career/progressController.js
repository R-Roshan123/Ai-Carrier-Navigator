import pool from '../../config/db.js';
import { buildRoleProgress } from '../../services/careerProgressService.js';
import { MAX_TARGET_ROLES, STEP_STATUSES, parseId } from '../../utils/careerValidation.js';

const listTargetRoleIds = async (userId) => {
  const { rows } = await pool.query(
    'SELECT role_id FROM career_user_target_roles WHERE user_id = $1 ORDER BY created_at, role_id',
    [userId],
  );
  return rows.map((row) => row.role_id);
};

const listTargetRoles = async (userId) => {
  const { rows } = await pool.query(
    `SELECT r.id, r.title, r.slug, r.category, t.created_at AS started_at
     FROM career_user_target_roles t
     JOIN career_job_roles r ON r.id = t.role_id
     WHERE t.user_id = $1
     ORDER BY t.created_at, r.id`,
    [userId],
  );
  return rows.map((row) => ({ id: row.id, title: row.title, slug: row.slug, category: row.category, startedAt: row.started_at }));
};

// POST /api/career/target-roles/:roleId
export const addTargetRole = async (req, res) => {
  const roleId = parseId(req.params.roleId);
  const userId = req.user.id;
  const { rows: roleRows } = roleId
    ? await pool.query('SELECT id, title FROM career_job_roles WHERE id = $1', [roleId])
    : { rows: [] };
  if (!roleRows[0]) {
    return res.status(404).json({ message: 'Role not found.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Serialises concurrent requests from the same user so the 3-role limit holds.
    await client.query("SELECT pg_advisory_xact_lock(hashtext('career_target_roles'), $1)", [userId]);
    const { rows } = await client.query('SELECT role_id FROM career_user_target_roles WHERE user_id = $1', [userId]);

    if (rows.some((row) => row.role_id === roleId)) {
      await client.query('ROLLBACK');
      return res.json({ message: `${roleRows[0].title} is already one of your target roles.`, targetRoles: await listTargetRoles(userId) });
    }
    if (rows.length >= MAX_TARGET_ROLES) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        message: `You can track up to ${MAX_TARGET_ROLES} target roles. Remove one before adding another.`,
      });
    }

    await client.query('INSERT INTO career_user_target_roles (user_id, role_id) VALUES ($1, $2)', [userId, roleId]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  res.status(201).json({
    message: `${roleRows[0].title} added to your target roles.`,
    targetRoles: await listTargetRoles(userId),
  });
};

// DELETE /api/career/target-roles/:roleId
// Step progress is kept, so re-adding the role later restores it.
export const removeTargetRole = async (req, res) => {
  const roleId = parseId(req.params.roleId);
  const { rowCount } = roleId
    ? await pool.query('DELETE FROM career_user_target_roles WHERE user_id = $1 AND role_id = $2', [req.user.id, roleId])
    : { rowCount: 0 };
  if (!rowCount) {
    return res.status(404).json({ message: 'This role is not one of your target roles.' });
  }
  res.json({ message: 'Role removed from your target roles.', targetRoles: await listTargetRoles(req.user.id) });
};

// GET /api/career/progress – readiness summary for every target role
export const getProgressSummary = async (req, res) => {
  const roleIds = await listTargetRoleIds(req.user.id);
  const progress = await Promise.all(
    roleIds.map((roleId) => buildRoleProgress(req.user.id, roleId, { includeDetails: false })),
  );
  res.json({ maxTargetRoles: MAX_TARGET_ROLES, targetRoles: progress.filter(Boolean) });
};

// GET /api/career/progress/:roleId – completed / remaining / next steps
// Works for any role so users can preview their gap before targeting it.
export const getRoleProgress = async (req, res) => {
  const roleId = parseId(req.params.roleId);
  const progress = roleId ? await buildRoleProgress(req.user.id, roleId) : null;
  if (!progress) {
    return res.status(404).json({ message: 'Role not found.' });
  }
  res.json({ progress });
};

// PATCH /api/career/progress/:roleId/steps/:stepId  { status }
export const updateStepStatus = async (req, res) => {
  const roleId = parseId(req.params.roleId);
  const stepId = parseId(req.params.stepId);
  const status = req.body?.status;

  if (!STEP_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${STEP_STATUSES.join(', ')}.` });
  }

  const { rows: stepRows } = roleId && stepId
    ? await pool.query(
      `SELECT s.id FROM career_roadmap_steps s
       JOIN career_roadmap_stages st ON st.id = s.stage_id
       WHERE s.id = $1 AND st.role_id = $2`,
      [stepId, roleId],
    )
    : { rows: [] };
  if (!stepRows[0]) {
    return res.status(404).json({ message: 'Step not found in this role\'s roadmap.' });
  }

  const { rows: targetRows } = await pool.query(
    'SELECT 1 FROM career_user_target_roles WHERE user_id = $1 AND role_id = $2',
    [req.user.id, roleId],
  );
  if (!targetRows[0]) {
    return res.status(400).json({ message: 'Set this role as a target role to start tracking your progress.' });
  }

  const { rows } = await pool.query(
    `INSERT INTO career_user_step_progress (user_id, step_id, status, completed_at)
     VALUES ($1, $2, $3::varchar, CASE WHEN $3::varchar = 'Completed' THEN NOW() END)
     ON CONFLICT (user_id, step_id) DO UPDATE
       SET status = EXCLUDED.status,
           completed_at = CASE
             WHEN EXCLUDED.status <> 'Completed' THEN NULL
             WHEN career_user_step_progress.status = 'Completed' THEN career_user_step_progress.completed_at
             ELSE NOW()
           END
     RETURNING step_id, status, completed_at`,
    [req.user.id, stepId, status],
  );

  const progress = await buildRoleProgress(req.user.id, roleId, { includeDetails: false });
  res.json({
    message: 'Step progress updated.',
    step: { stepId: rows[0].step_id, status: rows[0].status, completedAt: rows[0].completed_at },
    progress,
  });
};
