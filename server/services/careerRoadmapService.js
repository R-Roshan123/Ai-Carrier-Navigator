import pool from '../config/db.js';

const mapStep = (row, certifications) => ({
  id: row.id,
  stageId: row.stage_id,
  title: row.title,
  description: row.description,
  topics: row.topics,
  skills: row.skills,
  resources: row.resources,
  projects: row.projects,
  estimatedHours: row.estimated_hours,
  order: row.step_order,
  certifications,
});

// Returns the full ordered roadmap for a role: stages -> steps -> linked certifications.
export const loadRoadmap = async (roleId, db = pool) => {
  const [stagesResult, stepsResult, certsResult] = await Promise.all([
    db.query(
      `SELECT id, title, description, stage_order
       FROM career_roadmap_stages
       WHERE role_id = $1
       ORDER BY stage_order, id`,
      [roleId],
    ),
    db.query(
      `SELECT s.*
       FROM career_roadmap_steps s
       JOIN career_roadmap_stages st ON st.id = s.stage_id
       WHERE st.role_id = $1
       ORDER BY st.stage_order, st.id, s.step_order, s.id`,
      [roleId],
    ),
    db.query(
      `SELECT sc.step_id, c.id, c.name, c.provider, c.level, c.importance, c.official_url
       FROM career_step_certifications sc
       JOIN career_certifications c ON c.id = sc.certification_id
       JOIN career_roadmap_steps s ON s.id = sc.step_id
       JOIN career_roadmap_stages st ON st.id = s.stage_id
       WHERE st.role_id = $1
       ORDER BY c.name`,
      [roleId],
    ),
  ]);

  const certsByStep = new Map();
  certsResult.rows.forEach((row) => {
    const list = certsByStep.get(row.step_id) || [];
    list.push({ id: row.id, name: row.name, provider: row.provider, level: row.level, importance: row.importance, officialUrl: row.official_url });
    certsByStep.set(row.step_id, list);
  });

  const stages = stagesResult.rows.map((stage) => ({
    id: stage.id,
    title: stage.title,
    description: stage.description,
    order: stage.stage_order,
    steps: stepsResult.rows
      .filter((step) => step.stage_id === stage.id)
      .map((step) => mapStep(step, certsByStep.get(step.id) || [])),
  }));

  const steps = stages.flatMap((stage) => stage.steps);
  return {
    roleId,
    stages,
    totalSteps: steps.length,
    totalHours: steps.reduce((sum, step) => sum + step.estimatedHours, 0),
  };
};

// Replaces a role's roadmap with `stages` (already validated) inside the caller's
// transaction. Stages/steps that carry an existing id are updated in place, so
// users' step progress is preserved; anything missing from the payload is deleted.
export const saveRoadmap = async (client, roleId, stages) => {
  const { rows: existingStageRows } = await client.query(
    'SELECT id FROM career_roadmap_stages WHERE role_id = $1',
    [roleId],
  );
  const { rows: existingStepRows } = await client.query(
    `SELECT s.id FROM career_roadmap_steps s
     JOIN career_roadmap_stages st ON st.id = s.stage_id
     WHERE st.role_id = $1`,
    [roleId],
  );
  const existingStageIds = new Set(existingStageRows.map((row) => row.id));
  const existingStepIds = new Set(existingStepRows.map((row) => row.id));
  const keptStageIds = [];
  const keptStepIds = [];

  for (const [stageIndex, stage] of stages.entries()) {
    let stageId = stage.id;
    if (stageId && existingStageIds.has(stageId)) {
      await client.query(
        `UPDATE career_roadmap_stages SET title = $1, description = $2, stage_order = $3 WHERE id = $4`,
        [stage.title, stage.description, stageIndex + 1, stageId],
      );
    } else {
      const { rows } = await client.query(
        `INSERT INTO career_roadmap_stages (role_id, title, description, stage_order)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [roleId, stage.title, stage.description, stageIndex + 1],
      );
      stageId = rows[0].id;
    }
    keptStageIds.push(stageId);

    for (const [stepIndex, step] of stage.steps.entries()) {
      const values = [
        stageId, step.title, step.description, step.topics, step.skills,
        JSON.stringify(step.resources), step.projects, step.estimatedHours, stepIndex + 1,
      ];
      let stepId = step.id;
      if (stepId && existingStepIds.has(stepId)) {
        await client.query(
          `UPDATE career_roadmap_steps
           SET stage_id = $1, title = $2, description = $3, topics = $4, skills = $5,
               resources = $6::jsonb, projects = $7, estimated_hours = $8, step_order = $9
           WHERE id = $10`,
          [...values, stepId],
        );
      } else {
        const { rows } = await client.query(
          `INSERT INTO career_roadmap_steps
             (stage_id, title, description, topics, skills, resources, projects, estimated_hours, step_order)
           VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9) RETURNING id`,
          values,
        );
        stepId = rows[0].id;
      }
      keptStepIds.push(stepId);

      await client.query('DELETE FROM career_step_certifications WHERE step_id = $1', [stepId]);
      if (step.certificationIds.length) {
        // Unknown certification ids are silently ignored
        await client.query(
          `INSERT INTO career_step_certifications (step_id, certification_id)
           SELECT $1, id FROM career_certifications WHERE id = ANY($2::int[])`,
          [stepId, step.certificationIds],
        );
      }
    }
  }

  // Steps are re-parented before stages are removed, so the cascade only
  // deletes steps that were really dropped from the payload.
  await client.query(
    `DELETE FROM career_roadmap_steps s
     USING career_roadmap_stages st
     WHERE st.id = s.stage_id AND st.role_id = $1 AND NOT (s.id = ANY($2::int[]))`,
    [roleId, keptStepIds],
  );
  await client.query(
    'DELETE FROM career_roadmap_stages WHERE role_id = $1 AND NOT (id = ANY($2::int[]))',
    [roleId, keptStageIds],
  );
};
