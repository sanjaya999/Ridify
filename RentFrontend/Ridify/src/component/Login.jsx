import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email is invalid";
    
    if (!formData.password) tempErrors.password = "Password is required";
    else if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically handle the API call to authenticate
      console.log("Login form submitted:", formData);
      
      // Mock successful login - set user in localStorage
      localStorage.setItem('user', JSON.stringify({ email: formData.email, isAuthenticated: true }));
      
      // Redirect to home page
      navigate('/home');
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
          />
          {errors.email && <span className="login-error-message">{errors.email}</span>}
        </div>
        
        <div className="login-form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
          />
          {errors.password && <span className="login-error-message">{errors.password}</span>}
        </div>
        
        <button type="submit" className="login-button">Login</button>
      </form>
      
      <p className="login-switch-prompt">
        Don't have an account?{" "}
        <NavLink to="/register" className="login-nav-link">
          Register here
        </NavLink>
      </p>
    </div>
  );
};

export default Login;