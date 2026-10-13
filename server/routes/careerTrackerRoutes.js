// Career Roadmap & Certification Tracker – mounted at /api/career
import express from 'express';
import { protect, requireAdmin } from '../middleware/auth.js';
import { requireCareerUser, requireDatabase } from '../middleware/careerGuards.js';
import { certificateUpload } from '../middleware/certificateUpload.js';
import {
  adminListRoles,
  createRole,
  deleteRole,
  getRoleBySlug,
  getRoleCertifications,
  getRoleCompanies,
  getRoleRoadmap,
  listRoles,
  updateRole,
} from '../controllers/career/roleController.js';
import {
  adminListCompanies,
  createCompany,
  deleteCompany,
  getCompany,
  listCompanies,
  updateCompany,
} from '../controllers/career/companyController.js';
import {
  createCertification,
  deleteCertification,
  listCertifications,
  updateCertification,
} from '../controllers/career/certificationController.js';
import {
  addTargetRole,
  getProgressSummary,
  getRoleProgress,
  removeTargetRole,
  updateStepStatus,
} from '../controllers/career/progressController.js';
import {
  deleteCertificate,
  downloadCertificateFile,
  listMyCertificates,
  updateCertificate,
  uploadCertificate,
} from '../controllers/career/userCertificateController.js';
import {
  getCareerStats,
  listCertificatesForReview,
  updateRoadmap,
  verifyCertificate,
} from '../controllers/career/adminController.js';

const router = express.Router();
const signedIn = [protect, requireCareerUser];

router.use(requireDatabase);

// Public browsing
router.get('/roles', listRoles);
router.get('/roles/:slug', getRoleBySlug);
router.get('/roles/:id/companies', getRoleCompanies);
router.get('/roles/:id/roadmap', getRoleRoadmap);
router.get('/roles/:id/certifications', getRoleCertifications);
router.get('/companies', listCompanies);
router.get('/companies/:id', getCompany);
router.get('/certifications', listCertifications);

// Signed-in user
router.post('/target-roles/:roleId', ...signedIn, addTargetRole);
router.delete('/target-roles/:roleId', ...signedIn, removeTargetRole);
router.get('/progress', ...signedIn, getProgressSummary);
router.get('/progress/:roleId', ...signedIn, getRoleProgress);
router.patch('/progress/:roleId/steps/:stepId', ...signedIn, updateStepStatus);
router.post('/certificates', ...signedIn, certificateUpload, uploadCertificate);
router.get('/certificates/me', ...signedIn, listMyCertificates);
router.get('/certificates/:id/file', ...signedIn, downloadCertificateFile);
router.put('/certificates/:id', ...signedIn, certificateUpload, updateCertificate);
router.delete('/certificates/:id', ...signedIn, deleteCertificate);

// Admin
const admin = express.Router();
admin.use(protect, requireCareerUser, requireAdmin);

admin.get('/roles', adminListRoles);
admin.post('/roles', createRole);
admin.put('/roles/:id', updateRole);
admin.delete('/roles/:id', deleteRole);

admin.get('/companies', adminListCompanies);
admin.post('/companies', createCompany);
admin.put('/companies/:id', updateCompany);
admin.delete('/companies/:id', deleteCompany);

admin.get('/certifications', listCertifications);
admin.post('/certifications', createCertification);
admin.put('/certifications/:id', updateCertification);
admin.delete('/certifications/:id', deleteCertification);

admin.put('/roadmaps/:roleId', updateRoadmap);

admin.get('/certificates', listCertificatesForReview);
admin.patch('/certificates/:id/verify', verifyCertificate);

admin.get('/career-stats', getCareerStats);

router.use('/admin', admin);

export default router;
