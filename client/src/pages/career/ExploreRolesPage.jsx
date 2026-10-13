import { useCallback } from 'react';
import { Compass } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import RoleCard from '../../components/career/RoleCard';
import { CardSkeleton, EmptyState, ErrorState } from '../../components/career/PageState';
import { PageHeader, Pagination, SearchInput, SelectFilter } from '../../components/career/CareerUi';
import useApiData from '../../hooks/useApiData';
import { careerApi } from '../../services/careerApi';

const EXPERIENCE_LEVELS = ['Entry', 'Mid', 'Senior'];
const DEMAND_LEVELS = ['Very High', 'High', 'Medium', 'Low'];
const PAGE_SIZE = 9;

export default function ExploreRolesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    demandLevel: searchParams.get('demandLevel') || '',
    page: Number(searchParams.get('page')) || 1,
  };

  // Filters live in the URL so results can be shared and survive a refresh.
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

  const roles = useApiData(
    () => careerApi.listRoles({ ...filters, limit: PAGE_SIZE }),
    [filters.search, filters.category, filters.experienceLevel, filters.demandLevel, filters.page],
  );
  const targets = useApiData(() => careerApi.getProgressSummary().catch(() => ({ targetRoles: [] })), []);
  const targetIds = new Set((targets.data?.targetRoles || []).map((item) => item.role.id));
  const hasFilters = filters.search || filters.category || filters.experienceLevel || filters.demandLevel;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Career roadmaps"
        title="Explore job roles"
        description="Compare roles, see who is hiring, and follow a complete step-by-step roadmap. Track up to 3 target roles."
      />

      <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr] xl:items-end">
        <SearchInput value={filters.search} onChange={setSearch} placeholder="Search roles or skills" />
        <SelectFilter label="Category" value={filters.category} onChange={(value) => setFilter('category', value)} options={roles.data?.filters.categories || []} />
        <SelectFilter label="Experience" value={filters.experienceLevel} onChange={(value) => setFilter('experienceLevel', value)} options={EXPERIENCE_LEVELS} />
        <SelectFilter label="Demand" value={filters.demandLevel} onChange={(value) => setFilter('demandLevel', value)} options={DEMAND_LEVELS} />
      </div>

      {roles.error && <ErrorState message={roles.error} onRetry={roles.reload} />}
      {roles.loading && !roles.data && <CardSkeleton />}

      {roles.data && (
        <>
          {roles.data.roles.length ? (
            <div className={`grid gap-5 md:grid-cols-2 xl:grid-cols-3 ${roles.loading ? 'opacity-60' : ''}`}>
              {roles.data.roles.map((role) => (
                <RoleCard key={role.id} role={role} isTarget={targetIds.has(role.id)} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Compass}
              title="No roles match your filters"
              message="Try a different search term or clear the filters."
              action={hasFilters && (
                <button onClick={() => setSearchParams({})} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                  Clear filters
                </button>
              )}
            />
          )}
          <Pagination pagination={roles.data.pagination} onPageChange={(page) => setFilter('page', String(page))} />
        </>
      )}
    </div>
  );
}
