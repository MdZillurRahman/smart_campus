import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

const HOME = {
  student: '/student/dashboard',
  admin: '/admin/dashboard',
  staff: '/staff/dashboard',
}

export default function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />
  // Logged in but on a page for another role: send them to their own home.
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={HOME[user.role] ?? '/login'} replace />
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
