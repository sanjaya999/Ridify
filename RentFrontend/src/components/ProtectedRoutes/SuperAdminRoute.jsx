import { Navigate, Outlet } from 'react-router-dom';

const SuperAdminRoute = () => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const isSuperAdmin = localStorage.getItem('role') === 'superAdmin';
  
  // If not authenticated or not superadmin, redirect to appropriate page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and superadmin, render child routes
  return <Outlet />;
};

export default SuperAdminRoute;
