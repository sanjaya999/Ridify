import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {post } from "../api/api.js"
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
    
  try {
     const response = await post(`/users/login`  , formData)
     console.log(response.success);
     
      if(response.success){
        navigate('/home');
        localStorage.setItem('user', response.data.id);
        localStorage.setItem('accessToken', response.data.accessToken );
        localStorage.setItem('refresh', response.data.refreshToken);

      }
  } catch (error) {
    const recievedError = error?.response?.data
    if(recievedError){
      setErrors(recievedError?.message );
    }
    
  }
          

    
  };

  return (
    <>
    {errors && <span >{errors}</span>}
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
    </>
  );
};

export default Login;