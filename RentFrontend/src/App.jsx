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
import ConfirmBooking from "./components/VehicleBooking/ConfirmBooking.jsx";
import BookingDetails from "./components/VehicleBooking/BookingDetails.jsx";
import KhaltiCallback from "./components/VehicleBooking/KhaltiCallback.jsx";
import Upload from './pages/Upload';
import AllVehicles from './pages/AllVehicles';
import BrowseVehicles from './pages/BrowseVehicles';

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
          <Route path="/confirm-booking" element={<ConfirmBooking />} />
          <Route path="/booking-details" element={<BookingDetailsWrapper />} />
          <Route path="/khalti-callback" element={<KhaltiCallback />} />
          <Route path="upload" element={
            localStorage.getItem('role') === 'admin' ? <Upload /> : <div style={{padding:'2rem',textAlign:'center'}}>You are not authorized to view this page.</div>
          } />
          <Route path="all-vehicles" element={
            localStorage.getItem('role') === 'admin' ? <AllVehicles /> : <div style={{padding:'2rem',textAlign:'center'}}>You are not authorized to view this page.</div>
          } />
          <Route path="vehicles" element={<BrowseVehicles />} />
          <Route element={<PrivateRoute />}>
            <Route path="profile" element={<div>Profile Page</div>} />
            <Route path="bookings" element={<Bookings />} />
          </Route>
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

// Wrapper to pass location.state as props to BookingDetails
import { useLocation, useNavigate } from 'react-router-dom';
function BookingDetailsWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <BookingDetails
      bookingInfo={location.state?.bookingInfo}
      paymentMethod={location.state?.paymentMethod}
      totalAmount={location.state?.totalAmount}
      vehicleName={location.state?.vehicleName}
      vehicleModel={location.state?.vehicleModel}
      navigate={navigate}
    />
  );
}

export default App;
