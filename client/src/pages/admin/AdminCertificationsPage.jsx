import AdminCareerNav from '../../components/career/admin/AdminCareerNav';
import EntityManager from '../../components/career/admin/EntityManager';
import StatusBadge from '../../components/career/StatusBadge';
import useApiData from '../../hooks/useApiData';
import { careerApi } from '../../services/careerApi';

const searchText = (cert) => `${cert.name} ${cert.provider} ${cert.level}`;

const initialValues = (cert) =>
  cert ? { ...cert, roleIds: cert.roles.map((role) => role.id) } : { level: 'Beginner', importance: 'Recommended', isFree: false, roleIds: [] };

const renderItem = (cert) => (
  <>
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-semibold text-slate-900">{cert.name}</span>
      <StatusBadge status={cert.importance} />
      {cert.isFree && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">Free</span>}
    </div>
    <div className="mt-1 text-xs text-slate-500">
      {cert.provider} · {cert.level} · {cert.cost || 'Cost not set'} · {cert.roles.map((role) => role.title).join(', ') || 'No roles'}
    </div>
  </>
);

export default function AdminCertificationsPage() {
  const certs = useApiData(() => careerApi.admin.listCertifications(), []);
  const roles = useApiData(() => careerApi.admin.listRoles(), []);

  const fields = [
    { key: 'name', label: 'Name', required: true, full: true },
    { key: 'provider', label: 'Provider', required: true, placeholder: 'AWS, Google, Microsoft, NPTEL…' },
    { key: 'level', label: 'Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    { key: 'importance', label: 'Employer importance', type: 'select', options: ['Highly Valued', 'Recommended', 'Optional'], required: true, help: 'Highly Valued and Recommended count towards readiness.' },
    { key: 'cost', label: 'Cost', placeholder: 'USD 150' },
    { key: 'validity', label: 'Validity period', placeholder: '3 years' },
    { key: 'isFree', label: 'Free', type: 'checkbox', checkboxLabel: 'This certification is free' },
    { key: 'officialUrl', label: 'Official URL', type: 'url', required: true, full: true },
    { key: 'examDetails', label: 'Exam details', type: 'textarea', full: true, rows: 3 },
    {
      key: 'roleIds',
      label: 'Relevant roles',
      type: 'multiselect',
      full: true,
      options: (roles.data?.roles || []).map((role) => ({ value: role.id, label: role.title })),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminCareerNav />
      <h1 className="text-3xl font-bold text-slate-900">Certifications</h1>
      <EntityManager
        entityLabel="certification"
        items={certs.data?.certifications}
        loading={certs.loading}
        error={certs.error || roles.error}
        onRetry={() => { certs.reload(); roles.reload(); }}
        fields={fields}
        initialValues={initialValues}
        searchText={searchText}
        renderItem={renderItem}
        deleteWarning={(cert) => `"${cert.name}" will be removed from the master list and from roadmap steps. Users' uploaded certificates are kept under the same name. This cannot be undone.`}
        onSave={async (id, payload) => {
          const result = id ? await careerApi.admin.updateCertification(id, payload) : await careerApi.admin.createCertification(payload);
          certs.reload();
          return result;
        }}
        onDelete={async (id) => {
          const result = await careerApi.admin.deleteCertification(id);
          certs.reload();
          return result;
        }}
      />
    </div>
  );
}
