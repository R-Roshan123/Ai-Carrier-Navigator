import pool from '../config/db.js';
import { loadRoadmap } from './careerRoadmapService.js';

// ---------------------------------------------------------------------------
// Readiness formula
// ---------------------------------------------------------------------------
// readiness (0–100) = 100 × (STEP_WEIGHT × stepScore + CERT_WEIGHT × certScore)
//
//   stepScore = completed step hours / total roadmap hours
//     Steps are weighted by their estimated hours, so finishing a 60-hour
//     "React" step moves the needle more than a 10-hour "Git" step.
//     "In Progress" steps count as 0 until they are marked Completed.
//
//   certScore = earned core certifications / core certifications for the role
//     "Core" = the role's certifications whose importance is "Highly Valued" or
//     "Recommended" (Optional ones are shown but never lower readiness).
//     "Earned" = the user has an admin-Verified certificate for it that has not
//     expired. Pending or rejected uploads do not count.
//
//   If a role has no core certifications, readiness = 100 × stepScore.
//   If a role has no roadmap steps yet, readiness = 100 × certScore.
// ---------------------------------------------------------------------------
export const STEP_WEIGHT = 0.7;
export const CERT_WEIGHT = 0.3;
const CORE_IMPORTANCE = ['Highly Valued', 'Recommended'];
const IMPORTANCE_RANK = { 'Highly Valued': 0, Recommended: 1, Optional: 2 };

// Minimum readiness at which we consider a user competitive for a company's
// hiring bar. A heuristic: product companies and well-funded startups run
// tougher interview loops than large service companies.
export const COMPANY_READINESS_BAR = { Product: 80, Startup: 70, MNC: 65, Service: 50 };
const ALMOST_READY_MARGIN = 15;
const NEXT_ACTION_COUNT = 3;

const percent = (part, whole) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

const certificateRank = (cert) => {
  if (cert.status === 'Verified' && cert.expiry_status !== 'Expired') return 0;
  if (cert.status === 'Pending') return 1;
  if (cert.status === 'Verified') return 2; // verified but expired
  return 3; // rejected
};

const describeUserCert = (cert) => {
  if (!cert) return null;
  if (cert.status === 'Verified') return cert.expiry_status === 'Expired' ? 'Expired' : 'Verified';
  return cert.status;
};

const companyReadiness = (companyType, readiness) => {
  const requiredReadiness = COMPANY_READINESS_BAR[companyType] ?? 70;
  const gap = Math.max(0, requiredReadiness - readiness);
  let status = 'Not yet';
  if (gap === 0) status = 'Ready';
  else if (gap <= ALMOST_READY_MARGIN) status = 'Almost';
  return { requiredReadiness, gap, status };
};

// Picks the "What to do next" list:
//   1. Steps already In Progress (finish what you started), then the earliest
//      Not Started steps in roadmap order.
//   2. The highest-priority "Highly Valued" certification not yet earned is
//      always included (it replaces the last step slot) so certifications that
//      employers care about are never buried behind a long roadmap.
//   3. Remaining slots are filled with more steps, then more certifications.
const pickNextActions = (remainingSteps, missingCerts) => {
  const orderedSteps = [
    ...remainingSteps.filter((step) => step.status === 'In Progress'),
    ...remainingSteps.filter((step) => step.status !== 'In Progress'),
  ].map((step) => ({
    type: 'step',
    id: step.id,
    title: step.title,
    stageTitle: step.stageTitle,
    estimatedHours: step.estimatedHours,
    reason: step.status === 'In Progress' ? 'You have already started this step – finish it next.' : `Next step in your ${step.stageTitle} stage.`,
  }));

  const certActions = missingCerts
    .filter((cert) => cert.userStatus !== 'Pending')
    .map((cert) => ({
      type: 'certification',
      id: cert.id,
      title: cert.name,
      provider: cert.provider,
      importance: cert.importance,
      officialUrl: cert.officialUrl,
      reason:
        cert.userStatus === 'Rejected'
          ? 'Your upload was rejected – review the remark and re-upload.'
          : cert.userStatus === 'Expired'
            ? 'Your certificate has expired – renew it to keep it counting.'
            : `${cert.importance} by employers for this role.`,
    }));

  const highlyValued = certActions.find((action) => action.importance === 'Highly Valued');
  const actions = orderedSteps.slice(0, highlyValued ? NEXT_ACTION_COUNT - 1 : NEXT_ACTION_COUNT);
  if (highlyValued) actions.push(highlyValued);

  const fillers = [...orderedSteps, ...certActions].filter(
    (candidate) => !actions.some((action) => action.type === candidate.type && action.id === candidate.id),
  );
  while (actions.length < NEXT_ACTION_COUNT && fillers.length) actions.push(fillers.shift());
  return actions;
};

// Builds the progress report for one user and role. Returns null if the role
// does not exist. `includeDetails` adds the full lists, stage breakdown,
// skills checklist and matching companies (used by GET /progress/:roleId).
export const buildRoleProgress = async (userId, roleId, { includeDetails = true } = {}) => {
  const { rows: roleRows } = await pool.query(
    'SELECT id, title, slug, category, skills FROM career_job_roles WHERE id = $1',
    [roleId],
  );
  const role = roleRows[0];
  if (!role) return null;

  const [roadmap, progressResult, roleCertsResult, userCertsResult, targetResult] = await Promise.all([
    loadRoadmap(roleId),
    pool.query(
      `SELECT p.step_id, p.status, p.completed_at, p.updated_at
       FROM career_user_step_progress p
       JOIN career_roadmap_steps s ON s.id = p.step_id
       JOIN career_roadmap_stages st ON st.id = s.stage_id
       WHERE p.user_id = $1 AND st.role_id = $2`,
      [userId, roleId],
    ),
    pool.query(
      `SELECT c.id, c.name, c.provider, c.level, c.importance, c.official_url, c.is_free
       FROM career_certification_roles cr
       JOIN career_certifications c ON c.id = cr.certification_id
       WHERE cr.role_id = $1`,
      [roleId],
    ),
    pool.query(
      `SELECT uc.id, uc.certification_id, uc.status, to_char(uc.expiry_date, 'YYYY-MM-DD') AS expiry_date,
              CASE WHEN uc.expiry_date IS NOT NULL AND uc.expiry_date < CURRENT_DATE THEN 'Expired' ELSE 'Valid' END AS expiry_status
       FROM career_user_certificates uc
       JOIN career_certification_roles cr ON cr.certification_id = uc.certification_id AND cr.role_id = $2
       WHERE uc.user_id = $1`,
      [userId, roleId],
    ),
    pool.query(
      'SELECT created_at FROM career_user_target_roles WHERE user_id = $1 AND role_id = $2',
      [userId, roleId],
    ),
  ]);

  // ---- Steps ----
  const progressByStep = new Map(progressResult.rows.map((row) => [row.step_id, row]));
  const stages = roadmap.stages.map((stage) => {
    const steps = stage.steps.map((step) => {
      const progress = progressByStep.get(step.id);
      return {
        id: step.id,
        title: step.title,
        stageId: stage.id,
        stageTitle: stage.title,
        skills: step.skills,
        estimatedHours: step.estimatedHours,
        status: progress?.status || 'Not Started',
        completedAt: progress?.completed_at || null,
      };
    });
    const completedSteps = steps.filter((step) => step.status === 'Completed');
    const totalHours = steps.reduce((sum, step) => sum + step.estimatedHours, 0);
    const completedHours = completedSteps.reduce((sum, step) => sum + step.estimatedHours, 0);
    return {
      id: stage.id,
      title: stage.title,
      order: stage.order,
      totalSteps: steps.length,
      completedSteps: completedSteps.length,
      inProgressSteps: steps.filter((step) => step.status === 'In Progress').length,
      totalHours,
      completedHours,
      percent: percent(completedHours, totalHours),
      steps,
    };
  });

  const allSteps = stages.flatMap((stage) => stage.steps);
  const doneSteps = allSteps.filter((step) => step.status === 'Completed');
  const remainingSteps = allSteps.filter((step) => step.status !== 'Completed');
  const totalHours = roadmap.totalHours;
  const completedHours = doneSteps.reduce((sum, step) => sum + step.estimatedHours, 0);

  // ---- Certifications ----
  const bestUserCert = new Map();
  userCertsResult.rows.forEach((cert) => {
    const current = bestUserCert.get(cert.certification_id);
    if (!current || certificateRank(cert) < certificateRank(current)) bestUserCert.set(cert.certification_id, cert);
  });

  const roleCerts = roleCertsResult.rows
    .map((cert) => {
      const userCert = bestUserCert.get(cert.id);
      const userStatus = describeUserCert(userCert);
      return {
        id: cert.id,
        name: cert.name,
        provider: cert.provider,
        level: cert.level,
        importance: cert.importance,
        isFree: cert.is_free,
        officialUrl: cert.official_url,
        userStatus,
        userCertificateId: userCert?.id || null,
        expiryDate: userCert?.expiry_date || null,
        earned: userStatus === 'Verified',
      };
    })
    .sort((a, b) => IMPORTANCE_RANK[a.importance] - IMPORTANCE_RANK[b.importance] || a.name.localeCompare(b.name));

  const coreCerts = roleCerts.filter((cert) => CORE_IMPORTANCE.includes(cert.importance));
  const earnedCoreCerts = coreCerts.filter((cert) => cert.earned);

  // ---- Readiness (see formula at the top of this file) ----
  const stepScore = totalHours > 0 ? completedHours / totalHours : 0;
  const certScore = coreCerts.length > 0 ? earnedCoreCerts.length / coreCerts.length : 0;
  let readinessRatio;
  if (totalHours > 0 && coreCerts.length > 0) readinessRatio = STEP_WEIGHT * stepScore + CERT_WEIGHT * certScore;
  else if (totalHours > 0) readinessRatio = stepScore;
  else readinessRatio = certScore;
  const readiness = Math.round(readinessRatio * 100);

  const summary = {
    role: { id: role.id, title: role.title, slug: role.slug, category: role.category },
    isTarget: targetResult.rows.length > 0,
    startedAt: targetResult.rows[0]?.created_at || null,
    readiness,
    breakdown: {
      stepScore: Math.round(stepScore * 100),
      certScore: Math.round(certScore * 100),
      stepWeight: Math.round(STEP_WEIGHT * 100),
      certWeight: Math.round(CERT_WEIGHT * 100),
    },
    totals: {
      totalSteps: allSteps.length,
      completedSteps: doneSteps.length,
      inProgressSteps: allSteps.filter((step) => step.status === 'In Progress').length,
      totalHours,
      completedHours,
      remainingHours: totalHours - completedHours,
      coreCertifications: coreCerts.length,
      earnedCoreCertifications: earnedCoreCerts.length,
    },
  };

  const missingCerts = roleCerts.filter((cert) => !cert.earned);
  const nextActions = pickNextActions(remainingSteps, missingCerts);

  if (!includeDetails) {
    return { ...summary, nextAction: nextActions[0] || null };
  }

  // ---- Skills ----
  const acquiredSkills = new Set(doneSteps.flatMap((step) => step.skills));
  const roleSkills = role.skills.length ? role.skills : [...new Set(allSteps.flatMap((step) => step.skills))];
  const skillsChecklist = roleSkills.map((skill) => ({ skill, acquired: acquiredSkills.has(skill) }));

  // ---- Matching companies ----
  const { rows: companyRows } = await pool.query(
    `SELECT c.id, c.name, c.logo_url, c.company_type, c.package_range, c.locations, c.careers_url
     FROM career_company_roles cr
     JOIN career_companies c ON c.id = cr.company_id
     WHERE cr.role_id = $1
     ORDER BY c.name`,
    [roleId],
  );
  const matchingCompanies = companyRows
    .map((company) => ({
      id: company.id,
      name: company.name,
      logoUrl: company.logo_url,
      companyType: company.company_type,
      packageRange: company.package_range,
      locations: company.locations,
      careersUrl: company.careers_url,
      ...companyReadiness(company.company_type, readiness),
    }))
    .sort((a, b) => a.gap - b.gap || a.name.localeCompare(b.name));

  const stripStepSkills = ({ skills, ...step }) => step;

  return {
    ...summary,
    stages: stages.map((stage) => ({ ...stage, steps: stage.steps.map(stripStepSkills) })),
    completed: {
      steps: doneSteps.map(stripStepSkills),
      certifications: roleCerts.filter((cert) => cert.earned),
      skills: skillsChecklist.filter((item) => item.acquired).map((item) => item.skill),
    },
    remaining: {
      steps: remainingSteps.map(stripStepSkills),
      certifications: missingCerts,
      skills: skillsChecklist.filter((item) => !item.acquired).map((item) => item.skill),
    },
    nextActions,
    skillsChecklist,
    matchingCompanies,
  };
};
