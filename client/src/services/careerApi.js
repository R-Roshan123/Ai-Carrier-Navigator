import api from './api';

// Turns an axios error into a message that is safe to show to the user.
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (error && !error.response) return 'Cannot reach the server. Check that the API is running.';
  return fallback;
};

const data = (request) => request.then((response) => response.data);
const UPLOAD_TIMEOUT = 60000;

export const careerApi = {
  listRoles: (params) => data(api.get('/career/roles', { params })),
  getRole: (slug) => data(api.get(`/career/roles/${encodeURIComponent(slug)}`)),
  getRoleCompanies: (roleId) => data(api.get(`/career/roles/${roleId}/companies`)),
  getRoleRoadmap: (roleId) => data(api.get(`/career/roles/${roleId}/roadmap`)),
  getRoleCertifications: (roleId) => data(api.get(`/career/roles/${roleId}/certifications`)),
  listCompanies: (params) => data(api.get('/career/companies', { params })),
  getCompany: (id) => data(api.get(`/career/companies/${id}`)),
  listCertifications: (params) => data(api.get('/career/certifications', { params })),

  addTargetRole: (roleId) => data(api.post(`/career/target-roles/${roleId}`)),
  removeTargetRole: (roleId) => data(api.delete(`/career/target-roles/${roleId}`)),
  getProgressSummary: () => data(api.get('/career/progress')),
  getRoleProgress: (roleId) => data(api.get(`/career/progress/${roleId}`)),
  updateStepStatus: (roleId, stepId, status) => data(api.patch(`/career/progress/${roleId}/steps/${stepId}`, { status })),

  listMyCertificates: () => data(api.get('/career/certificates/me')),
  uploadCertificate: (formData) => data(api.post('/career/certificates', formData, { timeout: UPLOAD_TIMEOUT })),
  updateCertificate: (id, formData) => data(api.put(`/career/certificates/${id}`, formData, { timeout: UPLOAD_TIMEOUT })),
  deleteCertificate: (id) => data(api.delete(`/career/certificates/${id}`)),
  getCertificateFile: (id) => data(api.get(`/career/certificates/${id}/file`, { responseType: 'blob', timeout: UPLOAD_TIMEOUT })),

  admin: {
    listRoles: () => data(api.get('/career/admin/roles')),
    createRole: (payload) => data(api.post('/career/admin/roles', payload)),
    updateRole: (id, payload) => data(api.put(`/career/admin/roles/${id}`, payload)),
    deleteRole: (id) => data(api.delete(`/career/admin/roles/${id}`)),
    listCompanies: () => data(api.get('/career/admin/companies')),
    createCompany: (payload) => data(api.post('/career/admin/companies', payload)),
    updateCompany: (id, payload) => data(api.put(`/career/admin/companies/${id}`, payload)),
    deleteCompany: (id) => data(api.delete(`/career/admin/companies/${id}`)),
    listCertifications: () => data(api.get('/career/admin/certifications')),
    createCertification: (payload) => data(api.post('/career/admin/certifications', payload)),
    updateCertification: (id, payload) => data(api.put(`/career/admin/certifications/${id}`, payload)),
    deleteCertification: (id) => data(api.delete(`/career/admin/certifications/${id}`)),
    saveRoadmap: (roleId, stages) => data(api.put(`/career/admin/roadmaps/${roleId}`, { stages })),
    listCertificates: (params) => data(api.get('/career/admin/certificates', { params })),
    verifyCertificate: (id, status, remark) => data(api.patch(`/career/admin/certificates/${id}/verify`, { status, remark })),
    getStats: () => data(api.get('/career/admin/career-stats')),
  },
};

// Saves a Blob to disk with the given file name.
export const saveBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
