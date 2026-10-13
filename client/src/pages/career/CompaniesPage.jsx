import { useCallback } from 'react';
import { Building2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import CompanyCard from '../../components/career/CompanyCard';
import { CardSkeleton, EmptyState, ErrorState } from '../../components/career/PageState';
import { PageHeader, Pagination, SearchInput, SelectFilter } from '../../components/career/CareerUi';
import useApiData from '../../hooks/useApiData';
import { careerApi } from '../../services/careerApi';

const COMPANY_TYPES = ['MNC', 'Product', 'Service', 'Startup'];
const PAGE_SIZE = 12;

export default function CompaniesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = {
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
    roleId: searchParams.get('roleId') || '',
    page: Number(searchParams.get('page')) || 1,
  };

  const setFilter = useCallback(
    (key, value) =>
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== 'page') next.delete('page');
        return next;
      }),
    [setSearchParams],
  );
  const setSearch = useCallback((value) => setFilter('search', value), [setFilter]);
  const setLocation = useCallback((value) => setFilter('location', value), [setFilter]);

  const companies = useApiData(
    () => careerApi.listCompanies({ ...filters, limit: PAGE_SIZE }),
    [filters.search, filters.type, filters.location, filters.roleId, filters.page],
  );
  const roles = useApiData(() => careerApi.listRoles({ limit: 100 }), []);
  const roleOptions = (roles.data?.roles || []).map((role) => ({ value: String(role.id), label: role.title }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Companies hiring"
        title="Who is hiring"
        description="Indian and global companies that hire for each role, with typical packages and how their hiring process works."
      />

      <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-4 xl:items-end">
        <SearchInput value={filters.search} onChange={setSearch} placeholder="Search companies" />
        <SearchInput value={filters.location} onChange={setLocation} placeholder="Filter by city" label="Location" />
        <SelectFilter label="Company type" value={filters.type} onChange={(value) => setFilter('type', value)} options={COMPANY_TYPES} />
        <SelectFilter label="Hiring for" value={filters.roleId} onChange={(value) => setFilter('roleId', value)} options={roleOptions} allLabel="Any role" />
      </div>

      {companies.error && <ErrorState message={companies.error} onRetry={companies.reload} />}
      {companies.loading && !companies.data && <CardSkeleton />}

      {companies.data && (
        <>
          {companies.data.companies.length ? (
            <div className={`grid gap-5 md:grid-cols-2 xl:grid-cols-3 ${companies.loading ? 'opacity-60' : ''}`}>
              {companies.data.companies.map((company) => <CompanyCard key={company.id} company={company} showRoles />)}
            </div>
          ) : (
            <EmptyState
              icon={Building2}
              title="No companies match your filters"
              message="Try another city, type, or role."
              action={(
                <button onClick={() => setSearchParams({})} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                  Clear filters
                </button>
              )}
            />
          )}
          <Pagination pagination={companies.data.pagination} onPageChange={(page) => setFilter('page', String(page))} />
        </>
      )}
    </div>
  );
}
