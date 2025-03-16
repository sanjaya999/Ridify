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
import Landing from "./component/Landing.jsx";
import Contact from "./component/Contact.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";
import Layout from "./Layout.jsx";
import "./Style/Login.css";
import "./Style/Register.css";
import "./Style/Home.css";
import "./Style/Landing.css";
import "./Style/Contact.css";

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
      <div>
        <Message />
        <div >
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
            />

            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
