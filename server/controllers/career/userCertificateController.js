import fs from 'node:fs';
import pool from '../../config/db.js';
import { certificateFilePath, removeCertificateFile } from '../../middleware/certificateUpload.js';
import { mapUserCertificate } from '../../utils/careerMappers.js';
import { parseId, sendValidationError, userCertificateFields, validateFields } from '../../utils/careerValidation.js';

const EXPIRING_SOON_DAYS = 30;

// Shared SELECT used by the user and admin certificate endpoints. Dates are
// returned as YYYY-MM-DD strings so time zones never shift them.
export const USER_CERTIFICATE_SELECT = `
  SELECT uc.id, uc.user_id, uc.certification_id, uc.custom_name, uc.issuer,
         to_char(uc.issue_date, 'YYYY-MM-DD') AS issue_date,
         to_char(uc.expiry_date, 'YYYY-MM-DD') AS expiry_date,
         uc.credential_id, uc.credential_url, uc.file_type, uc.original_name, uc.file_size,
         uc.status, uc.admin_remark, uc.verified_at, uc.created_at, uc.updated_at,
         c.name AS certification_name, c.provider AS certification_provider, c.importance AS certification_importance,
         CASE
           WHEN uc.expiry_date IS NULL THEN 'No Expiry'
           WHEN uc.expiry_date < CURRENT_DATE THEN 'Expired'
           WHEN uc.expiry_date <= CURRENT_DATE + ${EXPIRING_SOON_DAYS} THEN 'Expiring Soon'
           ELSE 'Valid'
         END AS expiry_status,
         (uc.expiry_date - CURRENT_DATE) AS days_to_expiry
  FROM career_user_certificates uc
  LEFT JOIN career_certifications c ON c.id = uc.certification_id`;

const fetchOwnCertificate = async (id, userId) => {
  const { rows } = await pool.query(`${USER_CERTIFICATE_SELECT} WHERE uc.id = $1 AND uc.user_id = $2`, [id, userId]);
  return rows[0] || null;
};

// Validates the form fields shared by create and update. Either a certification
// from the master list or a custom name ("Other") is required; the issuer
// defaults to the certification's provider when left blank.
const validateCertificateInput = async (input) => {
  const { errors, value } = validateFields(input, userCertificateFields);
  const certificationId = value.certificationId[0] || null;
  let issuer = value.issuer;

  if (certificationId) {
    const { rows } = await pool.query('SELECT provider FROM career_certifications WHERE id = $1', [certificationId]);
    if (!rows[0]) errors.push('Selected certification does not exist.');
    issuer = issuer || rows[0]?.provider || null;
  } else if (!value.customName) {
    errors.push('Choose a certification from the list or enter a custom certificate name.');
  }
  if (!issuer) errors.push('Issuing organization is required.');

  const today = new Date().toISOString().slice(0, 10);
  if (value.issueDate && value.issueDate > today) errors.push('Issue date cannot be in the future.');
  if (value.issueDate && value.expiryDate && value.expiryDate < value.issueDate) {
    errors.push('Expiry date must be on or after the issue date.');
  }

  return {
    errors,
    value: { ...value, certificationId, customName: certificationId ? null : value.customName, issuer },
  };
};

// POST /api/career/certificates (multipart/form-data, file field: "file")
export const uploadCertificate = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please attach your certificate file (PDF, JPG, PNG, or WEBP, max 5 MB).' });
  }

  const { errors, value } = await validateCertificateInput(req.body);
  if (errors.length) {
    await removeCertificateFile(req.file.filename);
    return sendValidationError(res, errors);
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO career_user_certificates
         (user_id, certification_id, custom_name, issuer, issue_date, expiry_date, credential_id,
          credential_url, file_path, file_type, original_name, file_size)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        req.user.id, value.certificationId, value.customName, value.issuer, value.issueDate, value.expiryDate,
        value.credentialId, value.credentialUrl, req.file.filename, req.file.mimetype,
        req.file.originalname.slice(0, 255), req.file.size,
      ],
    );
    const certificate = await fetchOwnCertificate(rows[0].id, req.user.id);
    res.status(201).json({
      message: 'Certificate uploaded. It will count towards your readiness once an admin verifies it.',
      certificate: mapUserCertificate(certificate),
    });
  } catch (error) {
    await removeCertificateFile(req.file.filename);
    throw error;
  }
};

// GET /api/career/certificates/me
export const listMyCertificates = async (req, res) => {
  const { rows } = await pool.query(
    `${USER_CERTIFICATE_SELECT} WHERE uc.user_id = $1 ORDER BY uc.created_at DESC`,
    [req.user.id],
  );
  const certificates = rows.map(mapUserCertificate);
  res.json({
    certificates,
    summary: {
      total: certificates.length,
      verified: certificates.filter((cert) => cert.status === 'Verified').length,
      pending: certificates.filter((cert) => cert.status === 'Pending').length,
      rejected: certificates.filter((cert) => cert.status === 'Rejected').length,
      expired: certificates.filter((cert) => cert.expiryStatus === 'Expired').length,
      expiringSoon: certificates.filter((cert) => cert.expiryStatus === 'Expiring Soon').length,
    },
  });
};

// PUT /api/career/certificates/:id (multipart; the file is optional)
// Any edit sends the certificate back to Pending so an admin re-verifies it.
export const updateCertificate = async (req, res) => {
  const id = parseId(req.params.id);
  const existing = id
    ? (await pool.query(
      `SELECT *, to_char(issue_date, 'YYYY-MM-DD') AS issue_date_text, to_char(expiry_date, 'YYYY-MM-DD') AS expiry_date_text
       FROM career_user_certificates WHERE id = $1 AND user_id = $2`,
      [id, req.user.id],
    )).rows[0]
    : null;
  if (!existing) {
    if (req.file) await removeCertificateFile(req.file.filename);
    return res.status(404).json({ message: 'Certificate not found.' });
  }

  const body = req.body || {};
  const has = (key) => Object.prototype.hasOwnProperty.call(body, key);
  const merged = {
    certificationId: has('certificationId') ? body.certificationId : existing.certification_id ? String(existing.certification_id) : '',
    customName: has('customName') ? body.customName : existing.custom_name,
    issuer: has('issuer') ? body.issuer : existing.issuer,
    issueDate: has('issueDate') ? body.issueDate : existing.issue_date_text,
    expiryDate: has('expiryDate') ? body.expiryDate : existing.expiry_date_text || '',
    credentialId: has('credentialId') ? body.credentialId : existing.credential_id,
    credentialUrl: has('credentialUrl') ? body.credentialUrl : existing.credential_url,
  };

  const { errors, value } = await validateCertificateInput(merged);
  if (errors.length) {
    if (req.file) await removeCertificateFile(req.file.filename);
    return sendValidationError(res, errors);
  }

  const file = req.file
    ? { path: req.file.filename, type: req.file.mimetype, name: req.file.originalname.slice(0, 255), size: req.file.size }
    : { path: existing.file_path, type: existing.file_type, name: existing.original_name, size: existing.file_size };

  try {
    await pool.query(
      `UPDATE career_user_certificates
       SET certification_id = $1, custom_name = $2, issuer = $3, issue_date = $4, expiry_date = $5,
           credential_id = $6, credential_url = $7, file_path = $8, file_type = $9, original_name = $10,
           file_size = $11, status = 'Pending', admin_remark = NULL, verified_by = NULL, verified_at = NULL
       WHERE id = $12 AND user_id = $13`,
      [
        value.certificationId, value.customName, value.issuer, value.issueDate, value.expiryDate,
        value.credentialId, value.credentialUrl, file.path, file.type, file.name, file.size, id, req.user.id,
      ],
    );
  } catch (error) {
    if (req.file) await removeCertificateFile(req.file.filename);
    throw error;
  }
  if (req.file) await removeCertificateFile(existing.file_path);

  res.json({
    message: 'Certificate updated and sent for re-verification.',
    certificate: mapUserCertificate(await fetchOwnCertificate(id, req.user.id)),
  });
};

// DELETE /api/career/certificates/:id
export const deleteCertificate = async (req, res) => {
  const id = parseId(req.params.id);
  const { rows } = id
    ? await pool.query('DELETE FROM career_user_certificates WHERE id = $1 AND user_id = $2 RETURNING file_path', [id, req.user.id])
    : { rows: [] };
  if (!rows[0]) {
    return res.status(404).json({ message: 'Certificate not found.' });
  }
  await removeCertificateFile(rows[0].file_path);
  res.json({ message: 'Certificate deleted successfully.' });
};

// GET /api/career/certificates/:id/file – owner or admin only
export const downloadCertificateFile = async (req, res) => {
  const id = parseId(req.params.id);
  const { rows } = id
    ? await pool.query('SELECT user_id, file_path, file_type, original_name FROM career_user_certificates WHERE id = $1', [id])
    : { rows: [] };
  const certificate = rows[0];
  if (!certificate || (certificate.user_id !== req.user.id && req.user.role !== 'admin')) {
    return res.status(404).json({ message: 'Certificate not found.' });
  }

  const filePath = certificateFilePath(certificate.file_path);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'The certificate file is missing on the server.' });
  }

  const safeName = (certificate.original_name || 'certificate').replace(/[^\w.\- ]/g, '_');
  res.setHeader('Content-Type', certificate.file_type);
  res.setHeader('Content-Disposition', `${req.query.download === '1' ? 'attachment' : 'inline'}; filename="${safeName}"`);
  res.setHeader('Cache-Control', 'private, no-store');
  res.sendFile(filePath);
};
