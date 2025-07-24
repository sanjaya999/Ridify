import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "../../context/AuthContext.jsx";

const SuperAdminRoute = () => {
  const{isAuthenticated , user , loading} = useAuth();

  if (loading) {
       return <div>Loading...</div>;
    }

  if (!isAuthenticated) {
         return <Navigate to="/login" replace />;
      }

  return user?.role === 'superAdmin' ? <Outlet /> : <Navigate to="/" />;
};

export default SuperAdminRoute;
