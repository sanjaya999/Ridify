import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  return (
    <div className="home-container">
    <div className="home-header">
      <h1>Welcome to Your Dashboard</h1>
      <p className="home-user-email">Logged in as: {user.email}</p>
    </div>
    
    <div className="home-content">
      <div className="home-stats">
        <div className="home-stat-card">
          <h3>Projects</h3>
          <p className="home-stat-number">12</p>
        </div>
        <div className="home-stat-card">
          <h3>Tasks</h3>
          <p className="home-stat-number">34</p>
        </div>
        <div className="home-stat-card">
          <h3>Completed</h3>
          <p className="home-stat-number">27</p>
        </div>
      </div>
      
      <div className="home-recent-activity">
        <h2>Recent Activity</h2>
        <div className="home-activity-placeholder">
          <p>Your recent activity will appear here</p>
        </div>
      </div>
    </div>
    
    <button onClick={handleLogout} className="home-logout-button">
      Logout
    </button>
  </div>
  );
};

export default Home;