import { SelectFilter } from './career/CareerUi';
import { allRoles } from '../data/roleCareerData';

const roleOptions = allRoles.map((role) => ({ value: role.slug, label: role.title }));

export default function RoleSelect({ role, onChange, allLabel = 'All roles' }) {
  return (
    <div className="w-full md:w-72">
      <SelectFilter label="Role" value={role?.slug || ''} onChange={onChange} options={roleOptions} allLabel={allLabel} />
    </div>
  );
}
