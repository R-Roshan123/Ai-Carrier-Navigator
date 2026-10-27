// Seeds the Career Roadmap & Certification Tracker module.
//
// Safe to re-run: it NEVER deletes or overwrites existing rows.
//   - Roles, certifications, and companies are inserted only if missing
//     (matched by slug, name+provider, and name respectively).
//   - A role's roadmap is inserted only if that role has no stages yet, so
//     roadmaps edited in the admin panel are left untouched.
//   - If ADMIN_EMAIL is set, that existing user is promoted to admin.
//
// Usage: npm run seed:career   (run `npm run db:setup` first)
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { careerRoles } from './data/careerRoles.js';
import { careerCertifications } from './data/careerCertifications.js';
import { careerCompanies } from './data/careerCompanies.js';
import { careerRoadmaps } from './data/roadmaps/index.js';

// Fails fast on typos in the seed data (unknown role slugs / certification keys).
export const validateSeedData = () => {
  const roleSlugs = new Set(careerRoles.map((role) => role.slug));
  const certKeys = new Set(careerCertifications.map((cert) => cert.key));
  const errors = [];

  const checkRole = (slug, where) => {
    if (!roleSlugs.has(slug)) errors.push(`${where}: unknown role slug "${slug}"`);
  };

  careerRoles.forEach((role) => role.related.forEach((slug) => checkRole(slug, `role ${role.slug}`)));
  careerCertifications.forEach((cert) => cert.roles.forEach((slug) => checkRole(slug, `certification ${cert.key}`)));
  careerCompanies.forEach((company) => company.roles.forEach((slug) => checkRole(slug, `company ${company.name}`)));

  careerRoadmaps.forEach((roadmap) => {
    checkRole(roadmap.role, 'roadmap');
    const role = careerRoles.find((item) => item.slug === roadmap.role);
    const stepSkills = new Set();
    roadmap.stages.forEach((stage) =>
      stage.steps.forEach((step) => {
        step.skills.forEach((skill) => stepSkills.add(skill));
        step.certifications.forEach((key) => {
          const cert = careerCertifications.find((item) => item.key === key);
          if (!certKeys.has(key)) {
            errors.push(`roadmap ${roadmap.role} / ${step.title}: unknown certification "${key}"`);
          } else if (!cert.roles.includes(roadmap.role)) {
            errors.push(`roadmap ${roadmap.role} / ${step.title}: certification "${key}" is not listed for this role`);
          }
        });
      }),
    );
    // Every role skill must be taught by some step, otherwise it could never be
    // marked as acquired in the gap analysis.
    role?.skills.forEach((skill) => {
      if (!stepSkills.has(skill)) errors.push(`roadmap ${roadmap.role}: no step teaches role skill "${skill}"`);
    });
  });

  if (errors.length) {
    throw new Error(`Invalid career seed data:\n  - ${errors.join('\n  - ')}`);
  }
};

const insertRoles = async (db) => {
  let inserted = 0;
  for (const role of careerRoles) {
    const { rows } = await db.query(
      `INSERT INTO career_job_roles
         (title, slug, category, description, responsibilities, skills, tools,
          experience_level, salary_india, salary_global, demand_level, growth_outlook)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (slug) DO NOTHING
       RETURNING id`,
      [
        role.title, role.slug, role.category, role.description, role.responsibilities,
        role.skills, role.tools, role.experienceLevel, role.salaryIndia, role.salaryGlobal,
        role.demandLevel, role.growthOutlook,
      ],
    );
    inserted += rows.length;
  }

  const { rows } = await db.query('SELECT id, slug FROM career_job_roles');
  const roleIds = new Map(rows.map((row) => [row.slug, row.id]));

  for (const role of careerRoles) {
    for (const relatedSlug of role.related) {
      await db.query(
        `INSERT INTO career_related_roles (role_id, related_role_id)
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [roleIds.get(role.slug), roleIds.get(relatedSlug)],
      );
    }
  }

  return { inserted, roleIds };
};

const insertCertifications = async (db, roleIds) => {
  let inserted = 0;
  const certIds = new Map();

  for (const cert of careerCertifications) {
    const { rows } = await db.query(
      `INSERT INTO career_certifications
         (name, provider, level, cost, is_free, validity, exam_details, official_url, importance)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (name, provider) DO NOTHING
       RETURNING id`,
      [
        cert.name, cert.provider, cert.level, cert.cost, cert.isFree, cert.validity,
        cert.examDetails, cert.officialUrl, cert.importance,
      ],
    );
    inserted += rows.length;

    const existing = rows[0]
      ? rows[0]
      : (await db.query('SELECT id FROM career_certifications WHERE name = $1 AND provider = $2', [cert.name, cert.provider])).rows[0];
    certIds.set(cert.key, existing.id);

    for (const slug of cert.roles) {
      await db.query(
        `INSERT INTO career_certification_roles (certification_id, role_id)
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [existing.id, roleIds.get(slug)],
      );
    }
  }

  return { inserted, certIds };
};

const insertCompanies = async (db, roleIds) => {
  let inserted = 0;

  for (const company of careerCompanies) {
    const { rows } = await db.query(
      `INSERT INTO career_companies
         (name, description, logo_url, locations, company_type, website, careers_url, hiring_process, package_range)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (name) DO NOTHING
       RETURNING id`,
      [
        company.name, company.description, company.logoUrl, company.locations, company.companyType,
        company.website, company.careersUrl, company.hiringProcess, company.packageRange,
      ],
    );
    inserted += rows.length;

    const companyId = rows[0]
      ? rows[0].id
      : (await db.query('SELECT id FROM career_companies WHERE name = $1', [company.name])).rows[0].id;

    for (const slug of company.roles) {
      await db.query(
        `INSERT INTO career_company_roles (company_id, role_id)
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [companyId, roleIds.get(slug)],
      );
    }
  }

  return { inserted };
};

const insertRoadmaps = async (db, roleIds, certIds) => {
  let roadmapsInserted = 0;
  let stepsInserted = 0;

  for (const roadmap of careerRoadmaps) {
    const roleId = roleIds.get(roadmap.role);
    const { rows: existingStages } = await db.query(
      'SELECT 1 FROM career_roadmap_stages WHERE role_id = $1 LIMIT 1',
      [roleId],
    );
    if (existingStages.length) continue;

    for (const [stageIndex, stage] of roadmap.stages.entries()) {
      const { rows: stageRows } = await db.query(
        `INSERT INTO career_roadmap_stages (role_id, title, description, stage_order)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [roleId, stage.title, stage.description, stageIndex + 1],
      );

      for (const [stepIndex, step] of stage.steps.entries()) {
        const { rows: stepRows } = await db.query(
          `INSERT INTO career_roadmap_steps
             (stage_id, title, description, topics, skills, resources, projects, estimated_hours, step_order)
           VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9)
           RETURNING id`,
          [
            stageRows[0].id, step.title, step.description, step.topics, step.skills,
            JSON.stringify(step.resources), step.projects, step.estimatedHours, stepIndex + 1,
          ],
        );
        stepsInserted += 1;

        for (const key of step.certifications) {
          await db.query(
            `INSERT INTO career_step_certifications (step_id, certification_id)
             VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [stepRows[0].id, certIds.get(key)],
          );
        }
      }
    }
    roadmapsInserted += 1;
  }

  return { roadmapsInserted, stepsInserted };
};

const promoteAdmin = async (db, adminEmail) => {
  if (!adminEmail) return null;
  const { rows } = await db.query(
    `UPDATE users SET role = 'admin', updated_at = NOW()
     WHERE LOWER(email) = LOWER($1)
     RETURNING email`,
    [adminEmail],
  );
  return rows[0]?.email || false;
};

// `db` is any client exposing pg-style query(text, params) -> { rows }.
// The caller owns the transaction.
export const seedCareerData = async (db, { adminEmail } = {}) => {
  validateSeedData();

  const { inserted: rolesInserted, roleIds } = await insertRoles(db);
  const { inserted: certsInserted, certIds } = await insertCertifications(db, roleIds);
  const { inserted: companiesInserted } = await insertCompanies(db, roleIds);
  const { roadmapsInserted, stepsInserted } = await insertRoadmaps(db, roleIds, certIds);
  const promotedAdmin = await promoteAdmin(db, adminEmail);

  return {
    rolesInserted,
    certificationsInserted: certsInserted,
    companiesInserted,
    roadmapsInserted,
    stepsInserted,
    promotedAdmin,
  };
};

const runFromCli = async () => {
  const { default: pool } = await import('../config/db.js');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const summary = await seedCareerData(client, { adminEmail: process.env.ADMIN_EMAIL });
    await client.query('COMMIT');

    console.log('Career seed complete:');
    console.log(`  Roles inserted:          ${summary.rolesInserted}`);
    console.log(`  Certifications inserted: ${summary.certificationsInserted}`);
    console.log(`  Companies inserted:      ${summary.companiesInserted}`);
    console.log(`  Roadmaps inserted:       ${summary.roadmapsInserted} (${summary.stepsInserted} steps)`);
    if (summary.promotedAdmin === false) {
      console.warn(`  ADMIN_EMAIL "${process.env.ADMIN_EMAIL}" not found - register that account first, then re-run.`);
    } else if (summary.promotedAdmin) {
      console.log(`  Admin role granted to:   ${summary.promotedAdmin}`);
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Career seed failed, no changes were made:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runFromCli();
}
