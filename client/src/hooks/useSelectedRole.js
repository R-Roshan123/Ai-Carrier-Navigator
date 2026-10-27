import { useSearchParams } from 'react-router-dom';
import { findRoleByTitle, getRole } from '../data/roleCareerData';
import { readTargetCareer } from '../utils/targetCareer';

// The role a page is showing: `?role=slug` if present, otherwise the user's target career.
// Choosing "" clears the selection (pages treat that as "all roles" or "pick a role").
export default function useSelectedRole() {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get('role');
  const role = param === null ? findRoleByTitle(readTargetCareer()) || null : getRole(param) || null;

  const selectRole = (slug) => setSearchParams({ role: slug });

  return [role, selectRole];
}
