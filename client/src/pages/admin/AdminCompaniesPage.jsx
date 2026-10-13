import AdminCareerNav from '../../components/career/admin/AdminCareerNav';
import EntityManager from '../../components/career/admin/EntityManager';
import { CompanyLogo } from '../../components/career/CareerUi';
import useApiData from '../../hooks/useApiData';
import { careerApi } from '../../services/careerApi';

const searchText = (company) => `${company.name} ${company.companyType} ${company.locations.join(' ')}`;

const initialValues = (company) =>
  company ? { ...company, roleIds: company.roles.map((role) => role.id) } : { companyType: 'Product', roleIds: [] };

const renderItem = (company) => (
  <div className="flex items-center gap-3">
    <CompanyLogo name={company.name} logoUrl={company.logoUrl} size="h-10 w-10" />
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-900">{company.name}</span>
        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{company.companyType}</span>
      </div>
      <div className="mt-0.5 truncate text-xs text-slate-500">
        {company.locations.join(', ') || 'No locations'} · {company.roles.length} roles {company.packageRange && `· ${company.packageRange}`}
      </div>
    </div>
  </div>
);

export default function AdminCompaniesPage() {
  const companies = useApiData(() => careerApi.admin.listCompanies(), []);
  const roles = useApiData(() => careerApi.admin.listRoles(), []);

  const fields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'companyType', label: 'Company type', type: 'select', options: ['MNC', 'Product', 'Service', 'Startup'], required: true },
    { key: 'locations', label: 'Locations', type: 'csv', full: true, help: 'Comma separated, e.g. Bengaluru, Chennai, Remote' },
    { key: 'packageRange', label: 'Typical package range', placeholder: '₹6 – 12 LPA' },
    { key: 'logoUrl', label: 'Logo URL', type: 'url' },
    { key: 'website', label: 'Website', type: 'url' },
    { key: 'careersUrl', label: 'Careers page URL', type: 'url' },
    { key: 'description', label: 'Description', type: 'textarea', full: true, rows: 2 },
    { key: 'hiringProcess', label: 'Hiring process overview', type: 'textarea', full: true, rows: 3, help: 'Separate rounds with → to show them as numbered steps.' },
    {
      key: 'roleIds',
      label: 'Hires for roles',
      type: 'multiselect',
      full: true,
      options: (roles.data?.roles || []).map((role) => ({ value: role.id, label: role.title })),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminCareerNav />
      <h1 className="text-3xl font-bold text-slate-900">Companies</h1>
      <EntityManager
        entityLabel="company"
        items={companies.data?.companies}
        loading={companies.loading}
        error={companies.error || roles.error}
        onRetry={() => { companies.reload(); roles.reload(); }}
        fields={fields}
        initialValues={initialValues}
        searchText={searchText}
        renderItem={renderItem}
        deleteWarning={(company) => `"${company.name}" will be removed from every role it is linked to. This cannot be undone.`}
        onSave={async (id, payload) => {
          const result = id ? await careerApi.admin.updateCompany(id, payload) : await careerApi.admin.createCompany(payload);
          companies.reload();
          return result;
        }}
        onDelete={async (id) => {
          const result = await careerApi.admin.deleteCompany(id);
          companies.reload();
          return result;
        }}
      />
    </div>
  );
}
