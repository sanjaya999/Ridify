import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/ProtectedRoutes/PrivateRoute';
import PublicRoute from './components/ProtectedRoutes/PublicRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes (accessible only when logged out) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Layout routes */}
        <Route path="/" element={<Layout />}>
          {/* Public routes within layout */}
          <Route index element={<Home />} />
          <Route path="about" element={<div>About Page</div>} />
          <Route path="contact" element={<div>Contact Page</div>} />

          {/* Protected routes (accessible only when logged in) */}
          <Route element={<PrivateRoute />}>
            <Route path="vehicles" element={<div>Vehicles Page</div>} />
            <Route path="profile" element={<div>Profile Page</div>} />
            <Route path="bookings" element={<div>My Bookings</div>} />
          </Route>
        </Route>

        {/* 404 route */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
