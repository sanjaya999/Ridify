import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/ProtectedRoutes/PrivateRoute';
import PublicRoute from './components/ProtectedRoutes/PublicRoute';
import Bookings from './components/Bookings/Bookings';
import './App.css';
import VehicleDetail from "./components/VehicleBooking/VehicleDetail.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<div>About Page</div>} />
          <Route path="contact" element={<div>Contact Page</div>} />
          <Route path="/aboutVehicle/:id" element={<VehicleDetail />} />


          <Route element={<PrivateRoute />}>
            <Route path="vehicles" element={<div>Vehicles Page</div>} />
            <Route path="profile" element={<div>Profile Page</div>} />
            <Route path="bookings" element={<Bookings />} />
          </Route>
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
