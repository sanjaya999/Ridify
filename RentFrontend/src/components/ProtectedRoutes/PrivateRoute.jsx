import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "../../context/AuthContext.jsx";

const PrivateRoute = () => {
 const {isAuthenticated , loading} = useAuth();

 if (loading){
   return <h1>loading...</h1>
 }

 return isAuthenticated ? <Outlet /> : <Navigate to="/login"  replace />
};

export default PrivateRoute;
