import { Link } from 'react-router-dom';
import AdminCareerNav from '../../components/career/admin/AdminCareerNav';
import EntityManager from '../../components/career/admin/EntityManager';
import useApiData from '../../hooks/useApiData';
import { careerApi } from '../../services/careerApi';

const searchText = (role) => `${role.title} ${role.category} ${role.skills.join(' ')}`;

const initialValues = (role) =>
  role
    ? {
      ...role,
      salaryIndia: role.salaryRange.india,
      salaryGlobal: role.salaryRange.global,
    }
    : { experienceLevel: 'Entry', demandLevel: 'High', relatedRoleIds: [] };

const renderItem = (role) => (
  <>
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-semibold text-slate-900">{role.title}</span>
      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{role.category}</span>
      <span className="text-xs text-slate-500">{role.experienceLevel} · {role.demandLevel} demand</span>
    </div>
    <div className="mt-1 text-xs text-slate-500">
      /{role.slug} · {role.stepCount} steps · {role.companyCount} companies · {role.certificationCount} certifications ·{' '}
      <Link to={`/admin/career/roadmaps?role=${role.id}`} className="font-medium text-indigo-600">Edit roadmap</Link>
    </div>
  </>
);

export default function AdminRolesPage() {
  const roles = useApiData(() => careerApi.admin.listRoles(), []);
  const items = roles.data?.roles;

  const fields = [
    { key: 'title', label: 'Title', required: true },
    { key: 'slug', label: 'Slug', help: 'Used in the URL. Leave blank to generate from the title.' },
    { key: 'category', label: 'Category', required: true, placeholder: 'e.g. Software Development' },
    { key: 'experienceLevel', label: 'Experience level', type: 'select', options: ['Entry', 'Mid', 'Senior'], required: true },
    { key: 'demandLevel', label: 'Demand level', type: 'select', options: ['Very High', 'High', 'Medium', 'Low'], required: true },
    { key: 'salaryIndia', label: 'Salary range (India)', placeholder: '₹4 – 18 LPA' },
    { key: 'salaryGlobal', label: 'Salary range (global)', placeholder: 'USD 70k – 140k' },
    { key: 'description', label: 'Description', type: 'textarea', required: true, full: true, rows: 3 },
    { key: 'responsibilities', label: 'Responsibilities', type: 'lines', full: true, help: 'One per line.' },
    { key: 'skills', label: 'Required skills', type: 'csv', full: true, help: 'Comma separated. Must match the skills used in roadmap steps for gap analysis.' },
    { key: 'tools', label: 'Tools & technologies', type: 'csv', full: true, help: 'Comma separated.' },
    { key: 'growthOutlook', label: 'Demand & growth outlook', type: 'textarea', full: true, rows: 2 },
    {
      key: 'relatedRoleIds',
      label: 'Related roles',
      type: 'multiselect',
      full: true,
      options: (items || []).map((role) => ({ value: role.id, label: role.title })),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminCareerNav />
      <h1 className="text-3xl font-bold text-slate-900">Job roles</h1>
      <EntityManager
        entityLabel="role"
        items={items}
        loading={roles.loading}
        error={roles.error}
        onRetry={roles.reload}
        fields={fields}
        initialValues={initialValues}
        searchText={searchText}
        renderItem={renderItem}
        deleteWarning={(role) => `Deleting "${role.title}" also removes its roadmap and every user's progress and target selection for it. This cannot be undone.`}
        onSave={async (id, payload) => {
          const result = id ? await careerApi.admin.updateRole(id, payload) : await careerApi.admin.createRole(payload);
          roles.reload();
          return result;
        }}
        onDelete={async (id) => {
          const result = await careerApi.admin.deleteRole(id);
          roles.reload();
          return result;
        }}
      />
    </div>
  );
}
