import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { TextField, CircularProgress, Alert } from '@mui/material';
import { post } from "../api/api";
import '../assets/styles/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await post('/api/v1/users/register', {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      if (response.success) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        {loading && (
          <div className="loading">
            <CircularProgress />
          </div>
        )}
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Please fill in your details to register</p>
        </div>
        <form onSubmit={handleSubmit} className="register-form">
          {error && <Alert severity="error" className="error-message">{error}</Alert>}
          <div className="form-group">
            <TextField
              fullWidth
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              variant="outlined"
            />
          </div>
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
          <div className="form-group">
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="outlined"
            />
          </div>
          <div className="form-group">
            <TextField
              fullWidth
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              variant="outlined"
              SelectProps={{
                native: true,
              }}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </TextField>
          </div>
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <div className="login-link">
          Already have an account? <NavLink to="/login">Login</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Register;