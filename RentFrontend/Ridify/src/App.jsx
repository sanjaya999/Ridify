import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./component/Login.jsx";
import Register from "./component/Register.jsx";
import Home from "./component/Home.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";
import "./Style/Login.css";
import "./Style/Register.css";
import "./Style/Home.css";

// Message component for displaying redirects
const Message = () => {
  const location = useLocation();
  const message = location.state?.message;

  if (!message) return null;

  return (
    <div className="message-container">
      <div className="message">{message}</div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <Message />
        <div className="auth-container">
          <Routes>
            <Route
              path="/login"
              element={
                localStorage.getItem("accessToken") ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Login />
                )
              }
            />
              <Route
              path="/register"
              element={
                localStorage.getItem("accessToken") ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Register />
                )
              }
            />            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            {/* Redirect to login by default */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/* catch invalid route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
