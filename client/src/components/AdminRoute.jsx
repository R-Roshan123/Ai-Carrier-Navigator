import { Navigate } from 'react-router-dom';
import { isAdminUser } from '../utils/careerFormat';

// Hides admin pages from non-admins. The API enforces the same rule server-side.
export default function AdminRoute({ children }) {
  return isAdminUser() ? children : <Navigate to="/dashboard" replace />;
}
