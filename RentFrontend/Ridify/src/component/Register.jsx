import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (!formData.name) tempErrors.name = "Name is required";
    
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email is invalid";
    
    if (!formData.password) tempErrors.password = "Password is required";
    else if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    
    if (!formData.confirmPassword) tempErrors.confirmPassword = "Please confirm your password";
    else if (formData.confirmPassword !== formData.password) tempErrors.confirmPassword = "Passwords do not match";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically handle the API call to register the user
      console.log("Registration form submitted:", formData);
      
      // Redirect to login page after successful registration
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    }
  };

  return (
    <div className="register-form-container">
    <h2>Create Account</h2>
    <form onSubmit={handleSubmit} className="register-form">
      <div className="register-form-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
        />
        {errors.name && <span className="register-error-message">{errors.name}</span>}
      </div>
      
      <div className="register-form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
        />
        {errors.email && <span className="register-error-message">{errors.email}</span>}
      </div>
      
      <div className="register-form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="********"
        />
        {errors.password && <span className="register-error-message">{errors.password}</span>}
      </div>
      
      <div className="register-form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="********"
        />
        {errors.confirmPassword && <span className="register-error-message">{errors.confirmPassword}</span>}
      </div>
      
      <button type="submit" className="register-button">Register</button>
    </form>
    
    <p className="register-switch-prompt">
      Already have an account?{" "}
      <NavLink to="/login" className="register-nav-link">
        Login here
      </NavLink>
    </p>
  </div>
  );
};

export default Register;