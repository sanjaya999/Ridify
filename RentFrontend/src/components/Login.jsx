import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { TextField, CircularProgress, Alert } from '@mui/material';
import { post } from "../api/api";
import '../assets/styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  // const validateForm = () => {
  //   let tempErrors = {};
  //   if (!formData.email) tempErrors.email = "Email is required";
  //   else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email is invalid";
    
  //   if (!formData.password) tempErrors.password = "Password is required";
  //   else if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    
  //   setErrors(tempErrors);
  //   return Object.keys(tempErrors).length === 0;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await post('/api/v1/users/login', formData);
      if (response.success) {
        localStorage.setItem('user', response.data.id);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('refresh', response.data.refreshToken);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {loading && (
          <div className="loading">
            <CircularProgress />
          </div>
        )}
        <div className="login-header">
          <h2>Login</h2>
          <p>Please sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <Alert severity="error">{error}</Alert>}
          <div className="form-group">
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
            />
          </div>
          <div className="form-group">
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="register-link">
          Don't have an account? <NavLink to="/register">Register here</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Login;