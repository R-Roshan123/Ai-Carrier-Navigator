// Convert snake_case database rows to the camelCase JSON the API returns.

export const mapRoleSummary = (row) => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  category: row.category,
  description: row.description,
  skills: row.skills,
  experienceLevel: row.experience_level,
  salaryRange: { india: row.salary_india, global: row.salary_global },
  demandLevel: row.demand_level,
  ...(row.company_count !== undefined && {
    companyCount: row.company_count,
    certificationCount: row.certification_count,
    stepCount: row.step_count,
    totalHours: row.total_hours,
  }),
});

export const mapRole = (row) => ({
  ...mapRoleSummary(row),
  responsibilities: row.responsibilities,
  tools: row.tools,
  growthOutlook: row.growth_outlook,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapCompany = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  logoUrl: row.logo_url,
  locations: row.locations,
  companyType: row.company_type,
  website: row.website,
  careersUrl: row.careers_url,
  hiringProcess: row.hiring_process,
  packageRange: row.package_range,
  ...(row.role_count !== undefined && { roleCount: row.role_count }),
  ...(row.roles !== undefined && { roles: row.roles }),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapCertification = (row) => ({
  id: row.id,
  name: row.name,
  provider: row.provider,
  level: row.level,
  cost: row.cost,
  isFree: row.is_free,
  validity: row.validity,
  examDetails: row.exam_details,
  officialUrl: row.official_url,
  importance: row.importance,
  ...(row.roles !== undefined && { roles: row.roles }),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapUserCertificate = (row) => ({
  id: row.id,
  certificationId: row.certification_id,
  certification: row.certification_id
    ? { id: row.certification_id, name: row.certification_name, provider: row.certification_provider, importance: row.certification_importance }
    : null,
  name: row.certification_name || row.custom_name,
  customName: row.custom_name,
  issuer: row.issuer,
  issueDate: row.issue_date,
  expiryDate: row.expiry_date,
  expiryStatus: row.expiry_status,
  daysToExpiry: row.days_to_expiry,
  credentialId: row.credential_id,
  credentialUrl: row.credential_url,
  fileType: row.file_type,
  originalName: row.original_name,
  fileSize: row.file_size,
  status: row.status,
  adminRemark: row.admin_remark,
  verifiedAt: row.verified_at,
  ...(row.user_email !== undefined && {
    user: { id: row.user_id, name: row.user_name, email: row.user_email },
    verifiedBy: row.verifier_name || null,
  }),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
