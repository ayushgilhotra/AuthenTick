import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles specified, check role access
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Redirect to the correct dashboard for their role
    if (user.role === 'CUSTOMER') {
      return <Navigate to="/customer" replace />;
    } else if (user.role === 'RETAILER') {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === 'ADMIN') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
